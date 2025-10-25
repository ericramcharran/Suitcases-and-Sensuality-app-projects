import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPersonalityAnswersSchema, insertRelationshipAnswersSchema, insertPushSubscriptionSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import { sendMatchNotification, sendVerificationEmail } from "./email";
import webpush from "web-push";
import { WebSocketServer, WebSocket } from "ws";
import { uploadUserDataToDrive } from "./googleDrive";

// Initialize Stripe (from blueprint:javascript_stripe)
// Guard initialization to allow development without keys
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover",
    })
  : null;

// Initialize Web Push with VAPID keys (optional - gracefully handle missing/invalid keys)
let pushNotificationsEnabled = false;
try {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    pushNotificationsEnabled = true;
    console.log('✅ Push notifications enabled');
  } else {
    console.log('⚠️  Push notifications disabled - VAPID keys not configured');
  }
} catch (error) {
  console.error('⚠️  Push notifications disabled - Invalid VAPID keys:', error);
}

// Drizzle ORM automatically converts database snake_case to TypeScript camelCase
// No transformation needed - just return user objects as-is

// Configure multer for image uploads
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last active timestamp
      await storage.updateUser(user.id, { lastActive: new Date() });

      res.json({ 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.verified,
          profileName: user.profileName
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create a new user profile
  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  // Get a user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Update a user profile
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update user" });
      }
    }
  });

  // Get all users (for matching)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Send email verification code
  app.post("/api/verification/send-email", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store code in database
      await storage.createVerificationCode(email, code, 'email');
      
      // Send email with code
      await sendVerificationEmail(email, code);
      
      res.json({ message: "Verification code sent", success: true });
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  // Verify email code
  app.post("/api/verification/verify-email", async (req, res) => {
    try {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ error: "Email and code are required" });
      }

      const isValid = await storage.verifyCode(email, code, 'email');
      
      if (isValid) {
        res.json({ message: "Email verified successfully", success: true });
      } else {
        res.status(400).json({ error: "Invalid or expired code" });
      }
    } catch (error) {
      console.error('Error verifying email code:', error);
      res.status(500).json({ error: "Failed to verify code" });
    }
  });

  // Send phone verification code (SMS via Twilio)
  app.post("/api/verification/send-phone", async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
      }

      // Check if Twilio credentials are configured
      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        return res.status(503).json({ 
          error: "Phone verification not configured",
          message: "Twilio credentials are required. Please contact support."
        });
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store code in database
      await storage.createVerificationCode(phone, code, 'phone');
      
      // Send SMS with Twilio (when credentials are available)
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
        body: `Your Executive Society verification code is: ${code}. This code expires in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      
      res.json({ message: "Verification code sent", success: true });
    } catch (error) {
      console.error('Error sending verification SMS:', error);
      res.status(500).json({ error: "Failed to send verification code" });
    }
  });

  // Verify phone code
  app.post("/api/verification/verify-phone", async (req, res) => {
    try {
      const { phone, code } = req.body;
      
      if (!phone || !code) {
        return res.status(400).json({ error: "Phone and code are required" });
      }

      const isValid = await storage.verifyCode(phone, code, 'phone');
      
      if (isValid) {
        res.json({ message: "Phone verified successfully", success: true });
      } else {
        res.status(400).json({ error: "Invalid or expired code" });
      }
    } catch (error) {
      console.error('Error verifying phone code:', error);
      res.status(500).json({ error: "Failed to verify code" });
    }
  });

  // Export user data to Google Drive (admin only)
  app.post("/api/users/export-to-drive", async (req, res) => {
    try {
      // Check if user is admin
      const adminEmail = process.env.ADMIN_EMAIL;
      const requestEmail = req.body.email;
      
      if (!adminEmail || requestEmail !== adminEmail) {
        res.status(403).json({ error: "Unauthorized - Admin access only" });
        return;
      }

      const users = await storage.getAllUsers();
      const result = await uploadUserDataToDrive(users);
      
      res.json({ 
        success: true, 
        message: "User data exported to Google Drive",
        fileId: result.id,
        fileName: result.name,
        webViewLink: result.webViewLink
      });
    } catch (error: any) {
      console.error('Export to Drive error:', error);
      res.status(500).json({ error: error.message || "Failed to export to Google Drive" });
    }
  });

  // Upload profile images (up to 6)
  app.post("/api/users/:id/images", upload.single('image'), async (req, res) => {
    try {
      const userId = req.params.id;
      
      if (!req.file) {
        res.status(400).json({ error: "No image file provided" });
        return;
      }

      // Get current user to check existing images
      const user = await storage.getUser(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const currentImages = (user.profileImages || []) as string[];
      
      // Check if already have 6 images
      if (currentImages.length >= 6) {
        // Delete the uploaded file since we can't use it
        fs.unlinkSync(req.file.path);
        res.status(400).json({ error: "Maximum 6 images allowed" });
        return;
      }

      // Create image URL
      const imageUrl = `/uploads/${req.file.filename}`;
      const updatedImages = [...currentImages, imageUrl];

      // Update user with new image URL
      const updatedUser = await storage.updateUser(userId, {
        profileImages: updatedImages as any
      });

      res.json({ 
        imageUrl,
        profileImages: updatedImages,
        user: updatedUser 
      });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Delete a profile image
  app.delete("/api/users/:id/images", async (req, res) => {
    try {
      const userId = req.params.id;
      const { imageUrl } = req.body;

      if (!imageUrl) {
        res.status(400).json({ error: "Image URL required" });
        return;
      }

      const user = await storage.getUser(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const currentImages = (user.profileImages || []) as string[];
      const updatedImages = currentImages.filter(img => img !== imageUrl);

      // Delete the file from disk
      const filename = imageUrl.split('/').pop();
      if (filename) {
        const filePath = path.join(uploadDir, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Update user
      const updatedUser = await storage.updateUser(userId, {
        profileImages: updatedImages as any
      });

      res.json({ 
        profileImages: updatedImages,
        user: updatedUser 
      });
    } catch (error) {
      console.error('Image delete error:', error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Submit personality test answers
  app.post("/api/personality-test", async (req, res) => {
    try {
      const { userId, answers } = req.body;
      
      if (!userId || !answers || !Array.isArray(answers)) {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }

      // Calculate category scores
      const categories: Record<string, { start: number; end: number; score: number }> = {
        "Emotional Intelligence": { start: 0, end: 5, score: 0 },
        "Ethics": { start: 5, end: 9, score: 0 },
        "Sensuality": { start: 9, end: 13, score: 0 },
        "Emotional Stability": { start: 13, end: 17, score: 0 },
        "D/s Dynamics": { start: 17, end: 20, score: 0 }
      };

      Object.entries(categories).forEach(([category, range]) => {
        for (let i = range.start; i < range.end; i++) {
          const answerIndex = answers[i];
          // Score: 4 points for first option, 3 for second, 2 for third, 1 for fourth
          categories[category].score += (4 - answerIndex);
        }
      });

      // Determine personality type based on dominant traits
      const scores = {
        emotionalIntelligence: categories["Emotional Intelligence"].score / 5,
        ethics: categories["Ethics"].score / 4,
        sensuality: categories["Sensuality"].score / 4,
        stability: categories["Emotional Stability"].score / 4,
        dsCompatibility: categories["D/s Dynamics"].score / 3
      };

      // Determine personality type
      let personalityType = "Balanced";
      if (scores.emotionalIntelligence >= 3.5 && scores.ethics >= 3.5) {
        personalityType = "Empathetic Leader";
      } else if (scores.sensuality >= 3.5 && scores.dsCompatibility >= 3.0) {
        personalityType = "Sensual Dominant";
      } else if (scores.stability >= 3.5 && scores.emotionalIntelligence >= 3.0) {
        personalityType = "Grounded Nurturer";
      } else if (scores.dsCompatibility >= 3.5) {
        personalityType = "Protocol Enthusiast";
      }

      // Save to database
      const validatedData = insertPersonalityAnswersSchema.parse({
        userId,
        answers,
        personalityType,
        scores
      });
      
      const result = await storage.createPersonalityAnswers(validatedData);
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to save personality test results" });
      }
    }
  });

  // Submit relationship test answers
  app.post("/api/relationship-test", async (req, res) => {
    try {
      const { userId, answers } = req.body;
      
      if (!userId || !answers || !Array.isArray(answers)) {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }

      // Determine relationship style based on answers
      let relationshipStyle = "Flexible Explorer";
      
      // First question determines primary relationship type
      const relationshipType = answers[0];
      const structure = answers[1];
      const exclusivity = answers[2];
      
      if (relationshipType === 0 && structure === 0) {
        relationshipStyle = "24/7 TPE Devotee";
      } else if (relationshipType === 0 && exclusivity === 0) {
        relationshipStyle = "Monogamous Lifestyle Partner";
      } else if (structure === 2) {
        relationshipStyle = "Scene-Based Player";
      } else if (exclusivity === 1 || exclusivity === 2) {
        relationshipStyle = "Polyamorous Explorer";
      } else if (answers[3] === 0) {
        relationshipStyle = "Full Lifestyle Practitioner";
      } else if (answers[4] === 0) {
        relationshipStyle = "Deep Connection Seeker";
      } else if (answers[4] === 1) {
        relationshipStyle = "Growth-Oriented Learner";
      }

      // Save to database
      const validatedData = insertRelationshipAnswersSchema.parse({
        userId,
        answers,
        relationshipStyle
      });
      
      const result = await storage.createRelationshipAnswers(validatedData);
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to save relationship test results" });
      }
    }
  });

  // Submit BDSM test results
  app.post("/api/bdsm-test-results", async (req, res) => {
    try {
      const { userId, kinkPreferences, testImageUrl } = req.body;
      
      if (!userId || !kinkPreferences) {
        res.status(400).json({ error: "Missing required fields: userId, kinkPreferences" });
        return;
      }

      // Determine top role based on highest percentage
      let topRole = "Balanced";
      let highestPercentage = 0;
      
      const rolePercentages = kinkPreferences as Record<string, number>;
      Object.entries(rolePercentages).forEach(([role, percentage]) => {
        if (percentage > highestPercentage) {
          highestPercentage = percentage;
          topRole = role;
        }
      });

      // Check if user already has results
      const existingResults = await storage.getBdsmTestResults(userId);
      
      let result;
      if (existingResults) {
        // Update existing results
        result = await storage.updateBdsmTestResults(userId, {
          kinkPreferences,
          testImageUrl,
          topRole,
          rolePercentages
        });
      } else {
        // Create new results
        result = await storage.createBdsmTestResults({
          userId,
          kinkPreferences,
          testImageUrl,
          topRole,
          rolePercentages
        });
      }
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to save BDSM test results" });
      }
    }
  });

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
            role: user.role
          }
        });
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        await storage.updateUser(userId, { stripeCustomerId: customerId });
      }

      // Map billing period to interval and count
      const billingConfig: Record<string, { interval: 'month' | 'year', intervalCount: number, displayName: string }> = {
        "monthly": { interval: 'month', intervalCount: 1, displayName: 'Monthly' },
        "3month": { interval: 'month', intervalCount: 3, displayName: '3-Month' },
        "6month": { interval: 'month', intervalCount: 6, displayName: '6-Month' },
        "1year": { interval: 'year', intervalCount: 1, displayName: 'Yearly' },
        "5year": { interval: 'year', intervalCount: 5, displayName: '5-Year' }
      };

      const config = billingConfig[billingPeriod];
      if (!config) {
        res.status(400).json({ error: "Invalid billing period" });
        return;
      }

      // Determine success URL based on role
      const isDominant = user.role === 'Dominant' || user.role === 'Domme' || user.role === 'Master';
      const successUrl = isDominant 
        ? `${req.headers.origin}/escrow?session_id={CHECKOUT_SESSION_ID}`
        : `${req.headers.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`;

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'The Executive Society Membership',
              description: `${config.displayName} - ${user.role} Plan`
            },
            unit_amount: amount,
            recurring: {
              interval: config.interval,
              interval_count: config.intervalCount
            }
          },
          quantity: 1
        }],
        success_url: successUrl,
        cancel_url: `${req.headers.origin}/subscription`,
        metadata: {
          userId: user.id,
          role: user.role,
          billingPeriod: billingPeriod,
          planName: config.displayName
        }
      });

      res.json({
        sessionId: session.id,
        url: session.url
      });
    } catch (error: any) {
      console.error("Stripe subscription error:", error);
      res.status(500).json({ error: "Failed to create subscription", message: error.message });
    }
  });

  // Like a user
  app.post("/api/matches/like", async (req, res) => {
    try {
      const { userId, targetUserId } = req.body;
      
      if (!userId || !targetUserId) {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }

      // Create the match
      const match = await storage.createMatch({
        userId,
        targetUserId,
        action: 'like'
      });

      // Check if this creates a mutual match
      const reverseMatch = await storage.checkMutualMatch(userId, targetUserId);
      const isMutualMatch = reverseMatch && reverseMatch.action === 'like';

      // If it's a mutual match, send email notification
      if (isMutualMatch) {
        try {
          const [user1, user2, personality1, personality2, relationship1, relationship2] = await Promise.all([
            storage.getUser(userId),
            storage.getUser(targetUserId),
            storage.getPersonalityAnswers(userId),
            storage.getPersonalityAnswers(targetUserId),
            storage.getRelationshipAnswers(userId),
            storage.getRelationshipAnswers(targetUserId)
          ]);
          
          if (user1 && user2) {
            // Merge user data with complete assessment results
            const user1Data = {
              ...user1,
              personalityAnswers: personality1 || null,
              relationshipAnswers: relationship1 || null
            };
            
            const user2Data = {
              ...user2,
              personalityAnswers: personality2 || null,
              relationshipAnswers: relationship2 || null
            };
            
            await sendMatchNotification({
              user1: user1Data as any,
              user2: user2Data as any,
              matchId: match.id
            });
            console.log(`Match notification sent for ${user1.name} & ${user2.name}`);
          }
        } catch (emailError) {
          console.error('Failed to send match notification:', emailError);
          // Don't fail the request if email fails
        }
      }

      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to create like" });
    }
  });

  // Pass on a user
  app.post("/api/matches/pass", async (req, res) => {
    try {
      const { userId, targetUserId } = req.body;
      
      if (!userId || !targetUserId) {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }

      // Create the pass
      const match = await storage.createMatch({
        userId,
        targetUserId,
        action: 'pass'
      });

      res.json(match);
    } catch (error) {
      res.status(500).json({ error: "Failed to create pass" });
    }
  });

  // Admin endpoint to create mutual match for testing
  app.post("/api/admin/create-mutual-match", async (req, res) => {
    try {
      const { userId, targetUserId } = req.body;
      
      if (!userId || !targetUserId) {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }

      // Create both likes using the proper storage method
      const match1 = await storage.createMatch({
        userId,
        targetUserId,
        action: 'like'
      });

      const match2 = await storage.createMatch({
        userId: targetUserId,
        targetUserId: userId,
        action: 'like'
      });

      res.json({ 
        success: true, 
        message: "Mutual match created",
        matches: [match1, match2]
      });
    } catch (error) {
      console.error('Error creating mutual match:', error);
      res.status(500).json({ error: "Failed to create mutual match" });
    }
  });

  // Get potential matches for a user
  app.get("/api/matches/potential/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { includeReviewed } = req.query;
      
      // Get current user's data
      const currentUser = await storage.getUser(userId);
      if (!currentUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Get all users
      const allUsers = await storage.getAllUsers();
      
      // Get user's existing matches (likes and passes)
      const existingMatches = await storage.getMatches(userId);
      const matchedUserIds = existingMatches.map(m => m.targetUserId);
      
      // Filter out self and optionally already matched users
      const potentialMatches = allUsers.filter(
        u => u.id !== userId && (includeReviewed === 'true' || !matchedUserIds.includes(u.id))
      );

      // Get personality and relationship data for current user
      const userPersonality = await storage.getPersonalityAnswers(userId);
      const userRelationship = await storage.getRelationshipAnswers(userId);

      // Calculate compatibility scores for each potential match
      const matchesWithScores = await Promise.all(
        potentialMatches.map(async (user) => {
          const targetPersonality = await storage.getPersonalityAnswers(user.id);
          const targetRelationship = await storage.getRelationshipAnswers(user.id);

          // Calculate compatibility score
          let compatibility = 50; // Base score

          if (userPersonality && targetPersonality) {
            const userScores = userPersonality.scores as any;
            const targetScores = targetPersonality.scores as any;
            
            // Compare personality scores (higher similarity = higher compatibility)
            const scoreDiff = Math.abs(userScores.emotionalIntelligence - targetScores.emotionalIntelligence) +
                             Math.abs(userScores.ethics - targetScores.ethics) +
                             Math.abs(userScores.sensuality - targetScores.sensuality) +
                             Math.abs(userScores.stability - targetScores.stability) +
                             Math.abs(userScores.dsCompatibility - targetScores.dsCompatibility);
            
            // Convert to compatibility (max diff is 20, so normalize to 0-25 points)
            compatibility += Math.max(0, 25 - (scoreDiff * 1.25));
          }

          // Role compatibility bonus
          if (currentUser.role === 'Dominant' && user.role === 'submissive') {
            compatibility += 15;
          } else if (currentUser.role === 'submissive' && user.role === 'Dominant') {
            compatibility += 15;
          } else if (currentUser.role === 'Switch' || user.role === 'Switch') {
            compatibility += 10;
          }

          // Relationship style compatibility
          if (userRelationship && targetRelationship) {
            if (userRelationship.relationshipStyle === targetRelationship.relationshipStyle) {
              compatibility += 5;
            }
          }

          // BDSM test kink compatibility (NEW - up to 30 points)
          const userBdsmResults = await storage.getBdsmTestResults(userId);
          const targetBdsmResults = await storage.getBdsmTestResults(user.id);
          
          if (userBdsmResults && targetBdsmResults) {
            const userKinks = userBdsmResults.kinkPreferences as Record<string, number>;
            const targetKinks = targetBdsmResults.kinkPreferences as Record<string, number>;
            
            // Calculate complementary kink compatibility
            // Look for complementary pairings (e.g., dominant/submissive, sadist/masochist, rigger/ropeBottom)
            const complementaryPairs: Record<string, string[]> = {
              'dominant': ['submissive', 'slave'],
              'submissive': ['dominant', 'master'],
              'master': ['slave', 'submissive'],
              'slave': ['master', 'dominant'],
              'sadist': ['masochist'],
              'masochist': ['sadist'],
              'degrader': ['degradee'],
              'degradee': ['degrader'],
              'rigger': ['ropeBottom'],
              'ropeBottom': ['rigger'],
              'bratTamer': ['brat'],
              'brat': ['bratTamer']
            };
            
            let kinkScore = 0;
            let totalPairings = 0;
            
            // Check complementary pairings
            Object.entries(userKinks).forEach(([userKink, userPercentage]) => {
              const complementaryKinks = complementaryPairs[userKink] || [];
              complementaryKinks.forEach(compKink => {
                if (targetKinks[compKink]) {
                  totalPairings++;
                  // Higher score for well-matched percentages (both high)
                  const avgPercentage = (userPercentage + targetKinks[compKink]) / 2;
                  kinkScore += (avgPercentage / 100) * 5; // Max 5 points per pairing
                }
              });
            });
            
            // Also check for matching interests (same kinks, both enjoy)
            Object.entries(userKinks).forEach(([kink, userPercentage]) => {
              if (targetKinks[kink]) {
                // Similarity bonus for shared interests
                const similarity = 1 - Math.abs(userPercentage - targetKinks[kink]) / 100;
                kinkScore += similarity * 2; // Max 2 points per shared kink
              }
            });
            
            // Cap kink compatibility at 30 points
            compatibility += Math.min(30, Math.round(kinkScore));
          }

          // Important traits compatibility (new)
          const currentUserTraits = (currentUser.importantTraits || []) as string[];
          const targetUserTraits = (user.importantTraits || []) as string[];
          
          if (currentUserTraits.length > 0 && targetUserTraits.length > 0) {
            // Find overlapping traits
            const overlappingTraits = currentUserTraits.filter(trait => 
              targetUserTraits.includes(trait)
            );
            
            // Calculate trait match percentage
            const totalUniqueTraits = new Set([...currentUserTraits, ...targetUserTraits]).size;
            const traitMatchPercentage = (overlappingTraits.length / totalUniqueTraits) * 100;
            
            // Add up to 12 points based on trait overlap (weighted heavily for matching values)
            compatibility += Math.round((traitMatchPercentage / 100) * 12);
          }

          // Cap at 99%
          compatibility = Math.min(99, Math.round(compatibility));

          return {
            ...user,
            matchPercentage: compatibility
          };
        })
      );

      // Sort by compatibility
      matchesWithScores.sort((a, b) => b.matchPercentage - a.matchPercentage);

      res.json(matchesWithScores);
    } catch (error) {
      res.status(500).json({ error: "Failed to get potential matches" });
    }
  });

  // Message API Routes
  
  // Get match details by matchId
  app.get("/api/matches/:matchId", async (req, res) => {
    try {
      const matchId = req.params.matchId;
      const match = await storage.getMatch(matchId);
      
      if (!match) {
        res.status(404).json({ error: "Match not found" });
        return;
      }
      
      res.json(match);
    } catch (error) {
      console.error('Get match error:', error);
      res.status(500).json({ error: "Failed to get match" });
    }
  });
  
  // Get all conversations for a user (from mutual matches)
  app.get("/api/messages/conversations/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Get all mutual matches for this user
      const mutualMatches = await storage.getMutualMatches(userId);
      
      // Get the latest message for each match and build conversation list
      const conversations = await Promise.all(
        mutualMatches.map(async (match) => {
          const otherUserId = match.userId === userId ? match.targetUserId : match.userId;
          const otherUser = await storage.getUser(otherUserId);
          
          // Get all messages for this match
          const matchMessages = await storage.getMessages(match.id);
          const latestMessage = matchMessages[matchMessages.length - 1];
          
          // Count unread messages
          const unreadCount = matchMessages.filter(
            msg => msg.receiverId === userId && !msg.read
          ).length;
          
          return {
            matchId: match.id,
            user: otherUser,
            latestMessage: latestMessage || null,
            unreadCount,
            createdAt: match.createdAt
          };
        })
      );
      
      // Sort by latest message time
      conversations.sort((a, b) => {
        const aTime = a.latestMessage?.createdAt || a.createdAt;
        const bTime = b.latestMessage?.createdAt || b.createdAt;
        const aDate = aTime ? new Date(aTime) : new Date(0);
        const bDate = bTime ? new Date(bTime) : new Date(0);
        return bDate.getTime() - aDate.getTime();
      });
      
      res.json(conversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });
  
  // Get all messages for a specific match
  app.get("/api/messages/:matchId", async (req, res) => {
    try {
      const matchId = req.params.matchId;
      const messages = await storage.getMessages(matchId);
      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  });
  
  // Send a new message
  app.post("/api/messages", async (req, res) => {
    try {
      const { matchId, senderId, receiverId, content } = req.body;
      
      if (!matchId || !senderId || !receiverId || !content) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      
      const message = await storage.createMessage({
        matchId,
        senderId,
        receiverId,
        content
      });
      
      // Send WebSocket notification to receiver if they're online
      const receiverWs = wsClients.get(receiverId);
      if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
        receiverWs.send(JSON.stringify({
          type: 'new_message',
          data: message
        }));
      }
      
      res.json(message);
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });
  
  // Mark message as read
  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      const messageId = req.params.id;
      await storage.markMessageAsRead(messageId);
      res.json({ success: true });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // Push notification routes
  
  // Get VAPID public key
  app.get("/api/push/vapid-public-key", (req, res) => {
    if (!pushNotificationsEnabled) {
      return res.status(503).json({ error: "Push notifications not configured" });
    }
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
  });

  // Subscribe to push notifications
  app.post("/api/push/subscribe", async (req, res) => {
    if (!pushNotificationsEnabled) {
      return res.status(503).json({ error: "Push notifications not configured" });
    }
    
    try {
      const { userId, subscription } = req.body;
      
      if (!userId || !subscription || !subscription.endpoint || !subscription.keys) {
        return res.status(400).json({ error: "Invalid subscription data" });
      }

      const validatedSubscription = insertPushSubscriptionSchema.parse({
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      });

      await storage.createPushSubscription(validatedSubscription);
      
      // Send welcome notification
      const payload = JSON.stringify({
        title: 'Notifications Enabled',
        body: 'You will now receive notifications for matches and messages.',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png'
      });

      try {
        await webpush.sendNotification(subscription, payload);
      } catch (pushError) {
        console.error('Failed to send welcome notification:', pushError);
      }

      res.status(201).json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error('Subscription error:', error);
        res.status(500).json({ error: "Failed to save subscription" });
      }
    }
  });

  // Unsubscribe from push notifications
  app.post("/api/push/unsubscribe", async (req, res) => {
    try {
      const { endpoint } = req.body;
      
      if (!endpoint) {
        return res.status(400).json({ error: "Endpoint is required" });
      }

      await storage.deletePushSubscription(endpoint);
      res.json({ success: true });
    } catch (error) {
      console.error('Unsubscribe error:', error);
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });

  // Send notification to specific user
  app.post("/api/push/send", async (req, res) => {
    if (!pushNotificationsEnabled) {
      return res.status(503).json({ error: "Push notifications not configured" });
    }
    
    try {
      const { userId, title, body, url } = req.body;
      
      if (!userId || !title || !body) {
        return res.status(400).json({ error: "userId, title, and body are required" });
      }

      const subscriptions = await storage.getPushSubscriptions(userId);
      
      if (subscriptions.length === 0) {
        return res.status(404).json({ error: "No subscriptions found for user" });
      }

      const payload = JSON.stringify({
        title,
        body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        url: url || '/'
      });

      const sendPromises = subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        };

        try {
          await webpush.sendNotification(pushSubscription, payload);
        } catch (error: any) {
          // Remove invalid subscriptions
          if (error.statusCode === 404 || error.statusCode === 410) {
            await storage.deletePushSubscription(sub.endpoint);
          }
          console.error('Push notification error:', error);
        }
      });

      await Promise.all(sendPromises);
      res.json({ success: true, sent: subscriptions.length });
    } catch (error) {
      console.error('Send notification error:', error);
      res.status(500).json({ error: "Failed to send notifications" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time notifications
  const wss = new WebSocketServer({ noServer: true });
  
  // Store WebSocket connections by user ID
  const wsClients = new Map<string, WebSocket>();

  // Handle WebSocket upgrade
  httpServer.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '', `ws://${request.headers.host}`);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, userId);
    });
  });

  // Handle WebSocket connections
  wss.on('connection', (ws: WebSocket, userId: string) => {
    console.log(`User ${userId} connected via WebSocket`);
    wsClients.set(userId, ws);

    // Heartbeat
    const heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    }, 30000);

    ws.on('close', () => {
      console.log(`User ${userId} disconnected`);
      wsClients.delete(userId);
      clearInterval(heartbeatInterval);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
    });
  });

  // Helper function to send WebSocket notification
  app.post("/api/ws/send", async (req, res) => {
    try {
      const { userId, type, data } = req.body;
      
      const client = wsClients.get(userId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, data }));
        res.json({ success: true, delivered: true });
      } else {
        res.json({ success: true, delivered: false, message: "User not connected" });
      }
    } catch (error) {
      console.error('WebSocket send error:', error);
      res.status(500).json({ error: "Failed to send WebSocket message" });
    }
  });

  return httpServer;
}
