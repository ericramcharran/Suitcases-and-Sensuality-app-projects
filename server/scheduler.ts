import { storage } from "./storage";
import twilio from "twilio";
import { Resend } from "resend";
import webpush from "web-push";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: any = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize web-push with VAPID keys
let pushNotificationsEnabled = false;
try {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    pushNotificationsEnabled = true;
  }
} catch (error) {
  console.error('Failed to initialize web-push for scheduler:', error);
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
    if (!process.env.RESEND_API_KEY) {
      console.warn("Resend not configured, skipping email");
      return false;
    }

    const emails = [];
    if (couple.partner1Email) emails.push(couple.partner1Email);
    if (couple.partner2Email) emails.push(couple.partner2Email);

    if (emails.length === 0) {
      console.warn(`No email addresses for couple ${couple.coupleCode}`);
      return false;
    }

    // Convert plain text message to HTML
    const htmlMessage = message.replace(/\n/g, '<br>');

    let anySuccess = false;
    for (const email of emails) {
      try {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Daily Spark It! Reminder</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #ef4444 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">Daily Spark It! Reminder</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Time to connect with your partner</p>
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
                <div style="font-size: 16px; line-height: 1.8;">
                  ${htmlMessage}
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                <p>Spark It! - Ignite Your Relationship</p>
              </div>
            </body>
          </html>
        `;

        await resend.emails.send({
          from: 'Spark It! <onboarding@resend.dev>',
          to: email,
          subject: 'Your Daily Spark It! Reminder',
          html: htmlContent,
        });
        
        console.log(`✉️ Email sent to ${email}`);
        anySuccess = true;
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
      }
    }
    
    return anySuccess;
  }

  private async sendPushNotification(couple: any, message: string): Promise<boolean> {
    if (!pushNotificationsEnabled) {
      console.warn("Push notifications not configured, skipping");
      return false;
    }

    // Get push subscriptions for both partners
    const partner1Subscriptions = await storage.getPushSubscriptions(`sparkit-${couple.id}-partner1`);
    const partner2Subscriptions = await storage.getPushSubscriptions(`sparkit-${couple.id}-partner2`);
    const allSubscriptions = [...partner1Subscriptions, ...partner2Subscriptions];

    if (allSubscriptions.length === 0) {
      console.warn(`No push subscriptions for couple ${couple.coupleCode}`);
      return false;
    }

    // Create notification payload
    const payload = JSON.stringify({
      title: 'Daily Spark It! Reminder',
      body: message.substring(0, 200) + (message.length > 200 ? '...' : ''), // Limit body length
      icon: '/sparkit-icon-192.png',
      badge: '/sparkit-icon-192.png',
      url: '/spark'
    });

    let anySuccess = false;
    for (const sub of allSubscriptions) {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        };

        await webpush.sendNotification(pushSubscription, payload);
        console.log(`🔔 Push notification sent to subscription ${sub.id.substring(0, 8)}...`);
        anySuccess = true;
      } catch (error: any) {
        console.error(`Failed to send push notification:`, error);
        
        // If subscription is invalid (410 Gone), remove it
        if (error.statusCode === 410) {
          console.log(`Removing invalid subscription ${sub.id}`);
          await storage.deletePushSubscription(sub.endpoint);
        }
      }
    }
    
    return anySuccess;
  }
}

// Export singleton instance
export const dailyReminderScheduler = new DailyReminderScheduler();
