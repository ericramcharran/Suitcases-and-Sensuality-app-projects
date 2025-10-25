import express, { type Request, Response, NextFunction } from "express";
import { db } from "@db";
import { 
  users, matches, messages, pushSubscriptions, bdsmTestResults, verificationCodes,
  sparkitCouples, sparkitActivityRatings, sparkitActivityResults,
  sparkitTriviaCategories, sparkitTriviaQuestions, sparkitTriviaContests, sparkitTriviaAnswers
} from "@shared/schema";
import { eq, and, or, not, desc, sql } from "drizzle-orm";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import webpush from "web-push";
import Stripe from "stripe";
import twilio from "twilio";

// Guard initialization to allow development without keys
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    })
  : null;

// Twilio guard initialization
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Check if required environment variables are set
const hasPushNotificationKeys = 
  process.env.VAPID_PUBLIC_KEY && 
  process.env.VAPID_PRIVATE_KEY && 
  process.env.VAPID_SUBJECT;

// Only configure push notifications if all required keys are present
if (hasPushNotificationKeys) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  console.log("✅ Push notifications enabled");
} else {
  console.warn("⚠️  Push notification keys not found. Push notifications disabled.");
}

export function registerRoutes(app: express.Application) {
  // Test route to verify server is running
  app.get("/api/healthcheck", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ============================================
  // AUTHENTICATION & USER MANAGEMENT
  // ============================================

  // Sign up route
  app.post("/api/signup", async (req, res) => {
    const { email, password, name, role } = req.body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate role
    const validRoles = ["submissive", "Dominant", "Switch", "Domme", "Master"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    try {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        passwordHash,
        name,
        role,
        isVerified: false,
        onboardingCompleted: false
      });

      // Return user without password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Login route
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Return user without password hash
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Update user profile route
  app.patch("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;

      // Don't allow updating sensitive fields
      delete updates.passwordHash;
      delete updates.id;
      delete updates.email;

      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const { passwordHash: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // ============================================
  // VERIFICATION CODES
  // ============================================

  // Email verification code endpoint
  app.post("/api/verification/email/send", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Save to database with 10-minute expiration
      await storage.createVerificationCode({
        emailOrPhone: email,
        code,
        type: 'email',
        verified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });

      // Send email using Resend
      if (process.env.RESEND_API_KEY) {
        const resend = await import('resend');
        const resendClient = new resend.Resend(process.env.RESEND_API_KEY);
        
        await resendClient.emails.send({
          from: process.env.ADMIN_EMAIL || 'onboarding@resend.dev',
          to: email,
          subject: 'Your verification code',
          text: `Your verification code is: ${code}. This code will expire in 10 minutes.`
        });
      }

      res.json({ success: true, message: "Verification code sent" });
    } catch (error) {
      console.error('Send email verification error:', error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  // Phone verification code endpoint (requires Twilio)
  app.post("/api/verification/phone/send", async (req, res) => {
    try {
      if (!twilioClient) {
        return res.status(500).json({ error: "Phone verification is not configured. Please add Twilio credentials." });
      }

      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Save to database with 10-minute expiration
      await storage.createVerificationCode({
        emailOrPhone: phone,
        code,
        type: 'phone',
        verified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });

      // Send SMS using Twilio
      await twilioClient.messages.create({
        body: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });

      res.json({ success: true, message: "Verification code sent" });
    } catch (error) {
      console.error('Send phone verification error:', error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  // Verify code endpoint
  app.post("/api/verification/verify", async (req, res) => {
    try {
      const { emailOrPhone, code } = req.body;
      
      if (!emailOrPhone || !code) {
        return res.status(400).json({ error: "Email/phone and code are required" });
      }

      const isValid = await storage.verifyCode(emailOrPhone, code);
      
      if (isValid) {
        res.json({ success: true, verified: true });
      } else {
        res.status(400).json({ success: false, verified: false, error: "Invalid or expired code" });
      }
    } catch (error) {
      console.error('Verify code error:', error);
      res.status(500).json({ error: "Failed to verify code" });
    }
  });

  // ============================================
  // MATCHES & MESSAGING
  // ============================================

  // Get all matches for a user
  app.get("/api/users/:userId/matches", async (req, res) => {
    try {
      const { userId } = req.params;
      const matches = await storage.getMatchesForUser(userId);
      res.json(matches);
    } catch (error) {
      console.error('Get matches error:', error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  // Get messages for a match
  app.get("/api/matches/:matchId/messages", async (req, res) => {
    try {
      const { matchId } = req.params;
      const messages = await storage.getMessagesForMatch(matchId);
      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Mark messages as read
  app.post("/api/matches/:matchId/read", async (req, res) => {
    try {
      const { matchId } = req.params;
      const { userId } = req.body;
      
      await storage.markMessagesAsRead(matchId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });

  // ============================================
  // PUSH NOTIFICATIONS
  // ============================================

  // Subscribe to push notifications
  app.post("/api/push/subscribe", async (req, res) => {
    try {
      if (!hasPushNotificationKeys) {
        return res.status(500).json({ error: "Push notifications are not configured" });
      }

      const { userId, subscription } = req.body;
      
      if (!userId || !subscription) {
        return res.status(400).json({ error: "User ID and subscription are required" });
      }

      await storage.savePushSubscription({
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Push subscribe error:', error);
      res.status(500).json({ error: "Failed to save push subscription" });
    }
  });

  // Send push notification
  app.post("/api/push/send", async (req, res) => {
    try {
      if (!hasPushNotificationKeys) {
        return res.status(500).json({ error: "Push notifications are not configured" });
      }

      const { userId, title, body, data } = req.body;
      
      if (!userId || !title || !body) {
        return res.status(400).json({ error: "User ID, title, and body are required" });
      }

      const subscriptions = await storage.getPushSubscriptions(userId);
      
      const payload = JSON.stringify({
        title,
        body,
        data
      });

      const sendPromises = subscriptions.map(sub => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        };
        
        return webpush.sendNotification(pushSubscription, payload)
          .catch(err => {
            console.error('Push notification error:', err);
            // If subscription is invalid, delete it
            if (err.statusCode === 410) {
              storage.deletePushSubscription(sub.endpoint);
            }
          });
      });

      await Promise.all(sendPromises);
      res.json({ success: true, sent: subscriptions.length });
    } catch (error) {
      console.error('Send push error:', error);
      res.status(500).json({ error: "Failed to send push notification" });
    }
  });

  // Get VAPID public key
  app.get("/api/push/vapid-public-key", (req, res) => {
    if (!process.env.VAPID_PUBLIC_KEY) {
      return res.status(500).json({ error: "VAPID public key not configured" });
    }
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
  });

  // ============================================
  // STRIPE SUBSCRIPTION ROUTES
  // ============================================

  // Stripe: Create subscription checkout session (from blueprint:javascript_stripe)
  app.post("/api/create-subscription", async (req, res) => {
    try {
      // Validate Stripe is initialized
      if (!stripe) {
        res.status(500).json({ error: "Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables." });
        return;
      }

      const { userId, planType, billingPeriod } = req.body;
      
      if (!userId || !planType || !billingPeriod) {
        res.status(400).json({ error: "Missing required fields: userId, planType, billingPeriod" });
        return;
      }

      // Get user from storage
      const user = await storage.getUser(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Define price amounts based on role and billing period (in cents)
      const prices: Record<string, Record<string, number>> = {
        "Dominant": {
          "monthly": 24900,  // $249.00/mo
          "3month": 22900,   // $229.00/mo ($687 total)
          "6month": 19900,   // $199.00/mo ($1,194 total)
          "1year": 14900,    // $149.00/mo ($1,788 total)
          "5year": 11900     // $119.00/mo ($7,140 total)
        },
        "Domme": {
          "monthly": 24900,
          "3month": 22900,
          "6month": 19900,
          "1year": 14900,
          "5year": 11900
        },
        "Master": {
          "monthly": 24900,
          "3month": 22900,
          "6month": 19900,
          "1year": 14900,
          "5year": 11900
        },
        "submissive": {
          "monthly": 2500,   // $25.00/mo
          "3month": 2300,    // $23.00/mo ($69 total)
          "6month": 2000,    // $20.00/mo ($120 total)
          "1year": 1800,     // $18.00/mo ($216 total)
          "5year": 1500      // $15.00/mo ($900 total)
        },
        "Switch": {
          "monthly": 2500,
          "3month": 2300,
          "6month": 2000,
          "1year": 1800,
          "5year": 1500
        }
      };

      const amount = prices[user.role]?.[billingPeriod];
      if (!amount) {
        res.status(400).json({ error: "Invalid plan type or billing period" });
        return;
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: {
            userId: user.id,
            name: user.name,
            email: user.email
          }
        });
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }

      // Determine billing interval
      let interval: "month" | "year" = "month";
      let intervalCount = 1;
      
      if (billingPeriod === "1year" || billingPeriod === "5year") {
        interval = "year";
        intervalCount = billingPeriod === "5year" ? 5 : 1;
      } else if (billingPeriod === "3month" || billingPeriod === "6month") {
        intervalCount = billingPeriod === "3month" ? 3 : 6;
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${user.role} Membership - ${billingPeriod.replace(/([a-z])([A-Z])/g, '$1 $2')}`,
                description: `The Executive Society ${user.role} subscription`,
              },
              unit_amount: amount,
              recurring: {
                interval,
                interval_count: intervalCount,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/subscription`,
        metadata: {
          userId: user.id,
          planType,
          billingPeriod,
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Create subscription error:', error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Stripe webhook handler
  app.post("/api/webhooks/stripe", express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) {
      return res.status(500).send("Stripe not configured");
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return res.status(400).send("Missing webhook signature or secret");
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const userId = session.metadata?.userId;
          
          if (userId && session.subscription) {
            await storage.updateUser(userId, {
              stripeSubscriptionId: session.subscription as string,
              subscriptionPlan: 'premium',
              isVerified: true
            });
          }
          break;

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          const customerId = subscription.customer;
          
          // Find user by Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(customerId as string);
          if (user) {
            const isActive = subscription.status === 'active' || subscription.status === 'trialing';
            await storage.updateUser(user.id, {
              subscriptionPlan: isActive ? 'premium' : 'free'
            });
          }
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook handler error:', error);
      res.status(500).send("Webhook handler failed");
    }
  });

  // ============================================
  // BDSM TEST RESULTS
  // ============================================

  // Save BDSM test results
  app.post("/api/users/:userId/bdsm-test", async (req, res) => {
    try {
      const { userId } = req.params;
      const { testImageUrl, kinkPreferences, topRole, rolePercentages } = req.body;

      const results = await storage.saveBdsmTestResults({
        userId,
        testImageUrl,
        kinkPreferences: kinkPreferences || {},
        topRole,
        rolePercentages: rolePercentages || {}
      });

      res.json(results);
    } catch (error) {
      console.error('Save BDSM test error:', error);
      res.status(500).json({ error: "Failed to save test results" });
    }
  });

  // Get BDSM test results for a user
  app.get("/api/users/:userId/bdsm-test", async (req, res) => {
    try {
      const { userId } = req.params;
      const results = await storage.getBdsmTestResults(userId);
      res.json(results);
    } catch (error) {
      console.error('Get BDSM test error:', error);
      res.status(500).json({ error: "Failed to fetch test results" });
    }
  });

  // ============================================
  // WEBSOCKET MESSAGE ENDPOINT
  // ============================================

  // Send a WebSocket message to a connected user
  app.post("/api/websocket/send", async (req, res) => {
    try {
      const { userId, message } = req.body;
      
      if (!userId || !message) {
        return res.status(400).json({ error: "User ID and message are required" });
      }

      // Get WebSocket connections from global storage
      const wsServer = (global as any).wsServer;
      if (wsServer) {
        const delivered = wsServer.sendToUser(userId, message);
        res.json({ success: true, delivered: true });
      } else {
        res.json({ success: true, delivered: false, message: "User not connected" });
      }
    } catch (error) {
      console.error('WebSocket send error:', error);
      res.status(500).json({ error: "Failed to send WebSocket message" });
    }
  });

  // ============================================
  // SPARK IT! COUPLE PAIRING API ROUTES
  // ============================================

  // Generate unique 6-character couple code
  function generateCoupleCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Create a new couple (first partner signs up)
  app.post("/api/sparkit/couples", async (req, res) => {
    try {
      const { partner1Name } = req.body;
      
      if (!partner1Name) {
        return res.status(400).json({ error: "Partner name is required" });
      }

      // Generate unique couple code
      let coupleCode = generateCoupleCode();
      let existingCouple = await storage.getCoupleByCode(coupleCode);
      
      // Ensure code is unique
      while (existingCouple) {
        coupleCode = generateCoupleCode();
        existingCouple = await storage.getCoupleByCode(coupleCode);
      }

      const couple = await storage.createCouple({
        coupleCode,
        partner1Name,
        partner2Name: null,
        subscriptionPlan: 'free',
        sparksRemaining: 3,
        lastSparkReset: new Date(),
        stripeCustomerId: null,
        stripeSubscriptionId: null
      });

      res.json(couple);
    } catch (error) {
      console.error('Create couple error:', error);
      res.status(500).json({ error: "Failed to create couple" });
    }
  });

  // Join a couple (second partner uses code)
  app.post("/api/sparkit/couples/join", async (req, res) => {
    try {
      const { coupleCode, partner2Name } = req.body;
      
      if (!coupleCode || !partner2Name) {
        return res.status(400).json({ error: "Couple code and partner name are required" });
      }

      const couple = await storage.getCoupleByCode(coupleCode.toUpperCase());
      
      if (!couple) {
        return res.status(404).json({ error: "Invalid couple code" });
      }

      if (couple.partner2Name) {
        return res.status(400).json({ error: "This couple is already complete" });
      }

      // Start trial period when partner 2 joins
      const updatedCouple = await storage.updateCouple(couple.id, {
        partner2Name,
        partner2JoinedAt: new Date(),
        subscriptionPlan: 'trial',
        subscriptionStatus: 'active'
      });

      res.json(updatedCouple);
    } catch (error) {
      console.error('Join couple error:', error);
      res.status(500).json({ error: "Failed to join couple" });
    }
  });

  // Get couple by ID or code
  app.get("/api/sparkit/couples/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if parameter is a couple code (6 chars, alphanumeric) or ID (UUID)
      const isCode = /^[A-Z0-9]{6}$/.test(id.toUpperCase());
      
      const couple = isCode 
        ? await storage.getCoupleByCode(id.toUpperCase())
        : await storage.getCoupleById(id);
      
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      res.json(couple);
    } catch (error) {
      console.error('Get couple error:', error);
      res.status(500).json({ error: "Failed to get couple" });
    }
  });

  // Use a spark
  app.post("/api/sparkit/couples/:id/use-spark", async (req, res) => {
    try {
      const { id } = req.params;
      const couple = await storage.useSpark(id);
      
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      res.json(couple);
    } catch (error) {
      console.error('Use spark error:', error);
      res.status(500).json({ error: "Failed to use spark" });
    }
  });

  // Create activity rating
  app.post("/api/sparkit/activity-ratings", async (req, res) => {
    try {
      const { coupleId, activityId, activityTitle, rating } = req.body;
      
      if (!coupleId || !activityId || !activityTitle || !rating) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const activityRating = await storage.createActivityRating({
        coupleId,
        activityId,
        activityTitle,
        rating
      });

      res.json(activityRating);
    } catch (error) {
      console.error('Create rating error:', error);
      res.status(500).json({ error: "Failed to create rating" });
    }
  });

  // Create activity result (winner selection)
  app.post("/api/sparkit/activity-results", async (req, res) => {
    try {
      const { coupleId, activityId, activityTitle, winner } = req.body;
      
      if (!coupleId || !activityId || !activityTitle || !winner) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await storage.createActivityResult({
        coupleId,
        activityId,
        activityTitle,
        winner
      });

      res.json(result);
    } catch (error) {
      console.error('Create result error:', error);
      res.status(500).json({ error: "Failed to create result" });
    }
  });

  // Get scoreboard stats
  app.get("/api/sparkit/couples/:id/scoreboard", async (req, res) => {
    try {
      const { id } = req.params;
      const stats = await storage.getScoreboardStats(id);
      const recentResults = await storage.getActivityResultsByCoupleId(id, 10);
      
      res.json({
        stats,
        recentResults
      });
    } catch (error) {
      console.error('Get scoreboard error:', error);
      res.status(500).json({ error: "Failed to get scoreboard" });
    }
  });

  // ============================================
  // SPARK IT! SUBSCRIPTION ROUTES
  // ============================================

  // Create Spark It! subscription checkout session
  app.post("/api/sparkit/create-subscription", async (req, res) => {
    try {
      // Validate Stripe is initialized
      if (!stripe) {
        res.status(500).json({ error: "Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables." });
        return;
      }

      const { coupleId, billingPeriod } = req.body;
      
      if (!coupleId || !billingPeriod) {
        res.status(400).json({ error: "Missing required fields: coupleId, billingPeriod" });
        return;
      }

      // Get couple from storage
      const couple = await storage.getCoupleById(coupleId);
      if (!couple) {
        res.status(404).json({ error: "Couple not found" });
        return;
      }

      // Define pricing for Spark It! (in cents)
      const prices: Record<string, number> = {
        "monthly": 699,  // $6.99/mo (reduced from regular $9.99)
        "yearly": 5999   // $59.99/year (saves $24, reduced from $79.99)
      };

      const amount = prices[billingPeriod];
      if (!amount) {
        res.status(400).json({ error: "Invalid billing period. Choose 'monthly' or 'yearly'" });
        return;
      }

      // Create or get Stripe customer
      let customerId = couple.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: {
            coupleId: couple.id,
            partner1Name: couple.partner1Name,
            partner2Name: couple.partner2Name || ''
          }
        });
        customerId = customer.id;
        
        // Update couple with Stripe customer ID
        await storage.updateCouple(couple.id, { stripeCustomerId: customerId });
      }

      // Determine billing interval
      const interval: "month" | "year" = billingPeriod === "yearly" ? "year" : "month";

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Spark It! Premium - ${billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'}`,
                description: billingPeriod === 'yearly' 
                  ? 'Unlimited sparks + unlimited activities for a whole year!' 
                  : 'Unlimited sparks + unlimited activities',
              },
              unit_amount: amount,
              recurring: {
                interval,
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/spark?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/sparkit/pricing`,
        metadata: {
          coupleId: couple.id,
          billingPeriod,
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Create Spark It! subscription error:', error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Spark It! Stripe webhook handler
  app.post("/api/sparkit/webhooks/stripe", express.raw({ type: 'application/json' }), async (req, res) => {
    if (!stripe) {
      return res.status(500).send("Stripe not configured");
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return res.status(400).send("Missing webhook signature or secret");
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const coupleId = session.metadata?.coupleId;
          const billingPeriod = session.metadata?.billingPeriod;
          
          if (coupleId && session.subscription) {
            await storage.updateCouple(coupleId, {
              stripeSubscriptionId: session.subscription as string,
              subscriptionPlan: billingPeriod === 'yearly' ? 'yearly' : 'monthly',
              billingPeriod,
              subscriptionStatus: 'active',
              sparksRemaining: 999 // Effectively unlimited
            });
          }
          break;

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          const customerId = subscription.customer;
          
          // Find couple by Stripe customer ID
          const couples = await db.select()
            .from(sparkitCouples)
            .where(eq(sparkitCouples.stripeCustomerId, customerId as string));
          
          if (couples.length > 0) {
            const couple = couples[0];
            const isActive = subscription.status === 'active' || subscription.status === 'trialing';
            await storage.updateCouple(couple.id, {
              subscriptionPlan: isActive ? (couple.billingPeriod === 'yearly' ? 'yearly' : 'monthly') : 'trial',
              subscriptionStatus: isActive ? 'active' : 'trial_expired',
              sparksRemaining: isActive ? 999 : 3
            });
          }
          break;

        default:
          console.log(`Unhandled Spark It! event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Spark It! webhook handler error:', error);
      res.status(500).send("Webhook handler failed");
    }
  });

  // ============================================
  // TRIVIA API ROUTES
  // ============================================

  // Get all trivia categories
  app.get("/api/sparkit/trivia/categories", async (req, res) => {
    try {
      const categories = await db.select().from(sparkitTriviaCategories);
      res.json(categories);
    } catch (error) {
      console.error('Get trivia categories error:', error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get random questions for a contest
  app.get("/api/sparkit/trivia/questions/:categoryId/random", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const limit = parseInt(req.query.limit as string) || 5;

      const questions = await db.select()
        .from(sparkitTriviaQuestions)
        .where(eq(sparkitTriviaQuestions.categoryId, categoryId))
        .orderBy(sql`RANDOM()`)
        .limit(limit);

      res.json(questions);
    } catch (error) {
      console.error('Get random questions error:', error);
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  // Create a trivia contest
  app.post("/api/sparkit/trivia/contests", async (req, res) => {
    try {
      const { coupleId, categoryId, categoryName, senderId, questionIds } = req.body;

      if (!coupleId || !categoryId || !categoryName || !senderId || !questionIds) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const contest = await db.insert(sparkitTriviaContests).values({
        coupleId,
        categoryId,
        categoryName,
        senderId,
        questionIds,
        partner1Score: 0,
        partner2Score: 0,
        status: 'pending',
        completedAt: null
      }).returning();

      res.json(contest[0]);
    } catch (error) {
      console.error('Create contest error:', error);
      res.status(500).json({ error: "Failed to create contest" });
    }
  });

  // Submit trivia answer
  app.post("/api/sparkit/trivia/answers", async (req, res) => {
    try {
      const { contestId, questionId, partnerId, answer, isCorrect, timeSpent } = req.body;

      if (!contestId || !questionId || !partnerId || answer === undefined || isCorrect === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const triviaAnswer = await db.insert(sparkitTriviaAnswers).values({
        contestId,
        questionId,
        partnerId,
        answer,
        isCorrect,
        timeSpent
      }).returning();

      res.json(triviaAnswer[0]);
    } catch (error) {
      console.error('Submit answer error:', error);
      res.status(500).json({ error: "Failed to submit answer" });
    }
  });

  // Get contest by ID with answers
  app.get("/api/sparkit/trivia/contests/:contestId", async (req, res) => {
    try {
      const { contestId } = req.params;

      const contest = await db.select()
        .from(sparkitTriviaContests)
        .where(eq(sparkitTriviaContests.id, contestId));

      if (contest.length === 0) {
        return res.status(404).json({ error: "Contest not found" });
      }

      const answers = await db.select()
        .from(sparkitTriviaAnswers)
        .where(eq(sparkitTriviaAnswers.contestId, contestId));

      res.json({
        contest: contest[0],
        answers
      });
    } catch (error) {
      console.error('Get contest error:', error);
      res.status(500).json({ error: "Failed to fetch contest" });
    }
  });

  // Update contest scores and status
  app.patch("/api/sparkit/trivia/contests/:contestId", async (req, res) => {
    try {
      const { contestId } = req.params;
      const { partner1Score, partner2Score, status } = req.body;

      const updates: any = {};
      if (partner1Score !== undefined) updates.partner1Score = partner1Score;
      if (partner2Score !== undefined) updates.partner2Score = partner2Score;
      if (status) {
        updates.status = status;
        if (status === 'completed') {
          updates.completedAt = new Date();
        }
      }

      const updated = await db.update(sparkitTriviaContests)
        .set(updates)
        .where(eq(sparkitTriviaContests.id, contestId))
        .returning();

      res.json(updated[0]);
    } catch (error) {
      console.error('Update contest error:', error);
      res.status(500).json({ error: "Failed to update contest" });
    }
  });
}
