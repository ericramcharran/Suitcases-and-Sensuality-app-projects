import { storage } from "./storage";
import twilio from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: any = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

export class DailyReminderScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start() {
    if (this.isRunning) {
      console.log("⏰ Daily reminder scheduler already running");
      return;
    }

    console.log("⏰ Starting daily reminder scheduler...");
    this.isRunning = true;

    // Run every minute to check for reminders to send
    this.intervalId = setInterval(() => {
      this.checkAndSendReminders().catch(error => {
        console.error("Error in daily reminder scheduler:", error);
      });
    }, 60 * 1000); // Every minute

    // Also run once immediately on startup
    this.checkAndSendReminders().catch(error => {
      console.error("Error in initial reminder check:", error);
    });

    console.log("✅ Daily reminder scheduler started");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log("⏹️ Daily reminder scheduler stopped");
    }
  }

  private async checkAndSendReminders() {
    try {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD

      // Get all couples
      const couples = await storage.getAllCouples();

      for (const couple of couples) {
        // Get reminder preferences for this couple
        const preferences = await storage.getReminderPreferences(couple.id);

        // Skip if no preferences or reminders are disabled
        if (!preferences || !preferences.enabled) {
          continue;
        }

        // Check if it's time to send the reminder
        if (preferences.reminderTime !== currentTime) {
          continue;
        }

        // Check if we already sent a reminder today
        if (preferences.lastSentAt) {
          const lastSentDate = new Date(preferences.lastSentAt).toISOString().split('T')[0];
          if (lastSentDate === today) {
            // Already sent today, skip
            continue;
          }
        }

        // Time to send reminder! Get random daily content
        const question = await storage.getRandomDailyContent('question');
        const activity = await storage.getRandomDailyContent('activity');
        const conversationStarter = await storage.getRandomDailyContent('conversation_starter');

        // Build the message without emoji
        let message = `Daily Spark It! Reminder\n\n`;
        
        if (question) {
          message += `Today's Question:\n${question.content}\n\n`;
        }
        
        if (activity) {
          message += `Activity Idea:\n${activity.content}\n\n`;
        }
        
        if (conversationStarter) {
          message += `Conversation Starter:\n${conversationStarter.content}\n\n`;
        }
        
        message += `Login to Spark It! to discover more: https://${process.env.REPL_SLUG}.replit.app/sparkit/login`;

        // Send notifications based on method and track success
        const deliverySuccess = await this.sendNotification(couple, preferences.notificationMethod, message);

        // Only update lastSentAt if notification was successfully delivered
        if (deliverySuccess) {
          await storage.updateReminderPreferences(couple.id, {
            lastSentAt: now
          });
          console.log(`✅ Sent daily reminder to couple ${couple.coupleCode} via ${preferences.notificationMethod}`);
        } else {
          console.error(`❌ Failed to send reminder to couple ${couple.coupleCode} - no delivery channels available or all failed`);
        }
      }
    } catch (error) {
      console.error("Error checking and sending reminders:", error);
    }
  }

  private async sendNotification(couple: any, method: string, message: string): Promise<boolean> {
    let success = false;
    
    switch (method) {
      case 'sms':
        success = await this.sendSMS(couple, message);
        break;
      case 'email':
        success = await this.sendEmail(couple, message);
        break;
      case 'push':
        success = await this.sendPushNotification(couple, message);
        break;
      case 'all':
        // For 'all' mode, at least one channel must succeed
        const results = await Promise.all([
          this.sendSMS(couple, message),
          this.sendEmail(couple, message),
          this.sendPushNotification(couple, message)
        ]);
        success = results.some(result => result);
        break;
      default:
        console.warn(`Unknown notification method: ${method}`);
        success = false;
    }
    
    return success;
  }

  private async sendSMS(couple: any, message: string): Promise<boolean> {
    if (!twilioClient || !TWILIO_PHONE_NUMBER) {
      console.warn("Twilio not configured, skipping SMS");
      return false;
    }

    const phones = [];
    if (couple.partner1Phone) phones.push(couple.partner1Phone);
    if (couple.partner2Phone) phones.push(couple.partner2Phone);

    if (phones.length === 0) {
      console.warn(`No phone numbers for couple ${couple.coupleCode}`);
      return false;
    }

    let anySuccess = false;
    for (const phone of phones) {
      try {
        await twilioClient.messages.create({
          body: message,
          from: TWILIO_PHONE_NUMBER,
          to: phone
        });
        console.log(`SMS sent to ${phone}`);
        anySuccess = true;
      } catch (error) {
        console.error(`Failed to send SMS to ${phone}:`, error);
      }
    }
    
    return anySuccess;
  }

  private async sendEmail(couple: any, message: string): Promise<boolean> {
    // TODO: Implement email via Resend
    console.warn(`Email notification not implemented yet for couple ${couple.coupleCode}`);
    return false;
  }

  private async sendPushNotification(couple: any, message: string): Promise<boolean> {
    // TODO: Implement push notifications via VAPID
    console.warn(`Push notification not implemented yet for couple ${couple.coupleCode}`);
    return false;
  }
}

// Export singleton instance
export const dailyReminderScheduler = new DailyReminderScheduler();
