import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPersonalityAnswersSchema, insertRelationshipAnswersSchema, insertPushSubscriptionSchema, updateCoupleNamesSchema, updateAvatarSchema, type InsertSparkitCouple } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import { sendMatchNotification, sendVerificationEmail } from "./email";
import webpush from "web-push";
import { WebSocketServer, WebSocket } from "ws";
import { uploadUserDataToDrive } from "./googleDrive";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import bcrypt from "bcrypt";
import { generateLocalActivity } from "./openai";
import { sendSMS } from "./twilio";

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

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

// Middleware to check if user is authenticated (Spark It!)
function requireSparkitAuth(req: any, res: any, next: any) {
  console.log('🔍 Auth check - Session:', {
    sessionID: req.sessionID,
    sparkitCoupleId: req.session?.sparkitCoupleId,
    sparkitPartnerRole: req.session?.sparkitPartnerRole,
    cookie: req.headers.cookie ? 'present' : 'missing'
  });
  
  if (!req.session.sparkitCoupleId || !req.session.sparkitPartnerRole) {
    console.log('❌ Auth failed - missing session data');
    return res.status(401).json({ error: "Authentication required" });
  }
  console.log('✅ Auth passed');
  next();
}

// Middleware to verify couple ID in URL matches session
function verifyCoupleOwnership(req: any, res: any, next: any) {
  // Support both :id and :coupleId params
  const coupleIdFromUrl = req.params.id || req.params.coupleId;
  const sessionCoupleId = req.session.sparkitCoupleId;
  
  if (!sessionCoupleId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (coupleIdFromUrl && coupleIdFromUrl !== sessionCoupleId) {
    return res.status(403).json({ error: "Unauthorized: You can only access your own couple's data" });
  }
  
  next();
}

// Middleware to verify couple ID in request body matches session
function verifyCoupleOwnershipBody(req: any, res: any, next: any) {
  const coupleIdFromBody = req.body.coupleId;
  const sessionCoupleId = req.session.sparkitCoupleId;
  
  if (!sessionCoupleId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  if (coupleIdFromBody && coupleIdFromBody !== sessionCoupleId) {
    return res.status(403).json({ error: "Unauthorized: You can only modify your own couple's data" });
  }
  
  next();
}

// Middleware to verify trivia contest ownership
async function verifyTriviaContestOwnership(req: any, res: any, next: any) {
  const contestId = req.params.id;
  const sessionCoupleId = req.session.sparkitCoupleId;
  
  if (!sessionCoupleId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  try {
    const contest = await storage.getTriviaContestById(contestId);
    
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }
    
    if (contest.coupleId !== sessionCoupleId) {
      return res.status(403).json({ error: "Unauthorized: You can only access your own couple's trivia contests" });
    }
    
    next();
  } catch (error) {
    console.error('Trivia contest ownership verification error:', error);
    return res.status(500).json({ error: "Failed to verify contest ownership" });
  }
}

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

  // Admin endpoint to view demo user activity logs
  app.get("/api/admin/demo-activity", async (req, res) => {
    try {
      const { window = '24h', severity, eventType, coupleCode, limit = '50', offset = '0' } = req.query;
      
      // Parse and validate query params
      const parsedLimit = Math.min(parseInt(limit as string) || 50, 200); // Max 200 per request
      const parsedOffset = parseInt(offset as string) || 0;
      
      // Validate window parameter
      if (window && !['24h', '7d', '30d'].includes(window as string)) {
        return res.status(400).json({ error: "Invalid window parameter. Use: 24h, 7d, or 30d" });
      }

      // Fetch logs with filters
      const logs = await storage.getDemoActivityLogs({
        window: window as '24h' | '7d' | '30d',
        severity: severity as string,
        eventType: eventType as string,
        coupleCode: coupleCode as string,
        limit: parsedLimit,
        offset: parsedOffset
      });

      res.json({
        logs,
        count: logs.length,
        filters: {
          window,
          severity,
          eventType,
          coupleCode,
          limit: parsedLimit,
          offset: parsedOffset
        }
      });
    } catch (error) {
      console.error('Error fetching demo activity logs:', error);
      res.status(500).json({ error: "Failed to fetch demo activity logs" });
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

  // Verify if user has valid push subscription in database
  app.get("/api/push/verify/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const subscriptions = await storage.getPushSubscriptions(userId);
      res.json({ valid: subscriptions.length > 0 });
    } catch (error) {
      console.error('Verify subscription error:', error);
      res.status(500).json({ error: "Failed to verify subscription" });
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

  // ============================================
  // SPARK IT! AUTHENTICATION API ROUTES
  // ============================================

  // Login for Spark It! (either partner can log in)
  app.post("/api/sparkit/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log('🔐 Login attempt:', { email });
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Check if email belongs to partner 1 or partner 2
      const couple = await storage.getCoupleByPartnerEmail(email);
      
      if (!couple) {
        console.log('❌ No couple found for email:', email);
        return res.status(401).json({ error: "Invalid email or password" });
      }

      console.log('✅ Found couple:', { coupleCode: couple.coupleCode, partner1Email: couple.partner1Email, partner2Email: couple.partner2Email });

      // Determine which partner is logging in and verify password
      let partnerRole: 'partner1' | 'partner2' | null = null;
      if (couple.partner1Email === email && couple.partner1Password) {
        console.log('🔍 Checking partner1 password...');
        const isValid = await bcrypt.compare(password, couple.partner1Password);
        console.log('Partner1 password valid:', isValid);
        if (isValid) partnerRole = 'partner1';
      } else if (couple.partner2Email === email && couple.partner2Password) {
        console.log('🔍 Checking partner2 password...');
        const isValid = await bcrypt.compare(password, couple.partner2Password);
        console.log('Partner2 password valid:', isValid);
        if (isValid) partnerRole = 'partner2';
      }

      if (!partnerRole) {
        console.log('❌ Password verification failed');
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Store auth info in session
      req.session.sparkitCoupleId = couple.id;
      req.session.sparkitPartnerRole = partnerRole;

      // CRITICAL: Save session before responding to prevent race condition
      // This ensures the session is persisted to the database before the client redirects
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // Log demo user activity
      await storage.logDemoActivity({
        coupleId: couple.id,
        coupleCode: couple.coupleCode,
        partnerRole,
        actorEmail: email,
        eventType: 'auth',
        eventName: 'login',
        eventSource: 'auth',
        eventPayload: {
          partner: partnerRole,
          partnerName: partnerRole === 'partner1' ? couple.partner1Name : couple.partner2Name
        }
      });

      res.json({ 
        coupleId: couple.id, 
        partnerRole,
        partnerName: partnerRole === 'partner1' ? couple.partner1Name : couple.partner2Name
      });
    } catch (error) {
      console.error('Spark It! login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout for Spark It!
  app.post("/api/sparkit/auth/logout", async (req, res) => {
    try {
      const coupleId = req.session.sparkitCoupleId;
      const partnerRole = req.session.sparkitPartnerRole;

      // Log demo user activity before clearing session
      if (coupleId && partnerRole) {
        const couple = await storage.getCoupleById(coupleId);
        if (couple) {
          const email = partnerRole === 'partner1' ? couple.partner1Email : couple.partner2Email;
          await storage.logDemoActivity({
            coupleId,
            coupleCode: couple.coupleCode,
            partnerRole,
            actorEmail: email,
            eventType: 'auth',
            eventName: 'logout',
            eventSource: 'auth'
          });
        }
      }

      req.session.sparkitCoupleId = undefined;
      req.session.sparkitPartnerRole = undefined;
      res.json({ success: true });
    } catch (error) {
      console.error('Spark It! logout error:', error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // Get current logged in Spark It! user
  app.get("/api/sparkit/auth/me", async (req, res) => {
    try {
      if (!req.session.sparkitCoupleId || !req.session.sparkitPartnerRole) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const couple = await storage.getCoupleById(req.session.sparkitCoupleId);
      
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      const partnerRole = req.session.sparkitPartnerRole;
      res.json({ 
        coupleId: couple.id, 
        partnerRole,
        partnerName: partnerRole === 'partner1' ? couple.partner1Name : couple.partner2Name
      });
    } catch (error) {
      console.error('Spark It! get me error:', error);
      res.status(500).json({ error: "Failed to get user" });
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
      const { partner1Name, partner1Email, partner1Password, city, state, relationshipType, coupleCode: customCoupleCode, subscriptionPlan } = req.body;
      
      if (!partner1Name || !partner1Email || !partner1Password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      // Check if email already exists
      const existingCouple = await storage.getCoupleByPartnerEmail(partner1Email);
      if (existingCouple) {
        return res.status(400).json({ error: "This email is already registered. Please use a different email or log in instead." });
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(partner1Password, 10);

      // Generate or validate custom couple code
      let coupleCode: string;
      
      if (customCoupleCode) {
        // Validate custom code format (6 alphanumeric characters)
        if (!/^[A-Z0-9]{6}$/.test(customCoupleCode)) {
          return res.status(400).json({ error: "Couple code must be exactly 6 uppercase alphanumeric characters" });
        }
        
        // Check if custom code already exists
        const codeExists = await storage.getCoupleByCode(customCoupleCode);
        if (codeExists) {
          return res.status(400).json({ error: "This couple code is already in use. Please choose a different code." });
        }
        
        coupleCode = customCoupleCode;
      } else {
        // Generate unique couple code automatically
        coupleCode = generateCoupleCode();
        let codeExists = await storage.getCoupleByCode(coupleCode);
        
        // Ensure code is unique
        while (codeExists) {
          coupleCode = generateCoupleCode();
          codeExists = await storage.getCoupleByCode(coupleCode);
        }
      }

      const planType = subscriptionPlan || 'trial';
      const initialSparks = planType === 'trial' ? 20 : 999; // Trial gets 20 sparks, Premium gets 999 (effectively unlimited)
      
      const couple = await storage.createCouple({
        coupleCode,
        partner1Name,
        partner1Email,
        partner1Password: hashedPassword,
        partner2Name: null,
        subscriptionPlan: planType,
        sparksRemaining: initialSparks,
        lastSparkReset: new Date(),
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        city: city || null,
        state: state || null,
        relationshipType: relationshipType || 'monogamous'
      });

      // Log demo user activity
      await storage.logDemoActivity({
        coupleId: couple.id,
        coupleCode: couple.coupleCode,
        partnerRole: 'partner1',
        actorEmail: partner1Email,
        eventType: 'auth',
        eventName: 'signup',
        eventSource: 'signup',
        eventPayload: {
          partner: 'partner1',
          partnerName: partner1Name,
          subscriptionPlan: planType,
          relationshipType: relationshipType || 'monogamous'
        }
      });

      // Auto-login after signup
      req.session.sparkitCoupleId = couple.id;
      req.session.sparkitPartnerRole = 'partner1';

      res.json(couple);
    } catch (error) {
      console.error('Create couple error:', error);
      res.status(500).json({ error: "Failed to create couple" });
    }
  });

  // Join a couple (second partner uses code)
  app.post("/api/sparkit/couples/join", async (req, res) => {
    try {
      const { coupleCode, partner2Name, partner2Email, partner2Password } = req.body;
      
      if (!coupleCode || !partner2Name || !partner2Email || !partner2Password) {
        return res.status(400).json({ error: "Code, name, email, and password are required" });
      }

      // Check if email already exists
      const existingCouple = await storage.getCoupleByPartnerEmail(partner2Email);
      if (existingCouple) {
        return res.status(400).json({ error: "This email is already registered. Please use a different email or log in instead." });
      }

      const couple = await storage.getCoupleByCode(coupleCode.toUpperCase());
      
      if (!couple) {
        return res.status(404).json({ error: "Invalid couple code" });
      }

      if (couple.partner2Name) {
        return res.status(400).json({ error: "This couple is already complete" });
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(partner2Password, 10);

      // When partner 2 joins, start the trial period with 20 total sparks
      const updatedCouple = await storage.updateCouple(couple.id, {
        partner2Name,
        partner2Email,
        partner2Password: hashedPassword,
        partner2JoinedAt: new Date(),
        subscriptionPlan: 'trial',
        sparksRemaining: 20, // Trial gets 20 total sparks
        totalSparksUsed: 0 // Reset counter
      });

      // Log demo user activity
      await storage.logDemoActivity({
        coupleId: updatedCouple!.id,
        coupleCode: updatedCouple!.coupleCode,
        partnerRole: 'partner2',
        actorEmail: partner2Email,
        eventType: 'auth',
        eventName: 'join_couple',
        eventSource: 'signup',
        eventPayload: {
          partner: 'partner2',
          partnerName: partner2Name,
          partner1Name: updatedCouple!.partner1Name
        }
      });

      // Auto-login after joining
      req.session.sparkitCoupleId = updatedCouple!.id;
      req.session.sparkitPartnerRole = 'partner2';

      res.json(updatedCouple);
    } catch (error) {
      console.error('Join couple error:', error);
      res.status(500).json({ error: "Failed to join couple" });
    }
  });

  // Get couple by ID or code
  app.get("/api/sparkit/couples/:id", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    // CRITICAL: Prevent all caching to ensure users always get fresh subscription data
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    try {
      const { id } = req.params;
      
      console.log('📊 GET /api/sparkit/couples/:id - Request:', { id, sessionCoupleId: req.session.sparkitCoupleId });
      
      // Check if parameter is a couple code (6 chars, alphanumeric) or ID (UUID)
      const isCode = /^[A-Z0-9]{6}$/.test(id.toUpperCase());
      
      const couple = isCode 
        ? await storage.getCoupleByCode(id.toUpperCase())
        : await storage.getCoupleById(id);
      
      if (!couple) {
        console.log('❌ Couple not found');
        return res.status(404).json({ error: "Couple not found" });
      }

      // Include which partner is logged in
      const response = {
        ...couple,
        loggedInPartnerRole: req.session.sparkitPartnerRole
      };
      
      res.json(response);
    } catch (error) {
      console.error('Get couple error:', error);
      res.status(500).json({ error: "Failed to get couple" });
    }
  });

  // Update couple partner names
  app.patch("/api/sparkit/couples/:id/names", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate request body
      const validation = updateCoupleNamesSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Validation failed",
          details: validation.error.errors 
        });
      }

      const { partner1Name, partner2Name } = validation.data;

      const updates: Partial<InsertSparkitCouple> = {};
      if (partner1Name !== undefined) updates.partner1Name = partner1Name;
      if (partner2Name !== undefined) updates.partner2Name = partner2Name;

      const updatedCouple = await storage.updateCouple(id, updates);
      
      if (!updatedCouple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      res.json(updatedCouple);
    } catch (error) {
      console.error('Update couple names error:', error);
      res.status(500).json({ error: "Failed to update couple names" });
    }
  });

  // Update couple location for AI activity suggestions
  app.patch("/api/sparkit/couples/:id/phones", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      const { id } = req.params;
      const { partner1Phone, partner2Phone } = req.body;

      const updates: Partial<InsertSparkitCouple> = {
        partner1Phone: partner1Phone?.trim() || null,
        partner2Phone: partner2Phone?.trim() || null
      };

      const updatedCouple = await storage.updateCouple(id, updates);
      
      if (!updatedCouple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      res.json(updatedCouple);
    } catch (error) {
      console.error('Update couple phones error:', error);
      res.status(500).json({ error: "Failed to update couple phones" });
    }
  });

  app.patch("/api/sparkit/couples/:id/location", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      const { id } = req.params;
      const { city, state } = req.body;
      
      if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
      }

      const updates: Partial<InsertSparkitCouple> = {
        city: city.trim(),
        state: state.trim()
      };

      const updatedCouple = await storage.updateCouple(id, updates);
      
      if (!updatedCouple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      res.json(updatedCouple);
    } catch (error) {
      console.error('Update couple location error:', error);
      res.status(500).json({ error: "Failed to update couple location" });
    }
  });

  // Get AI-generated activities based on couple's location
  app.get("/api/sparkit/couples/:id/ai-activities", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      // Check if AI activities feature is enabled
      if (process.env.ENABLE_AI_ACTIVITIES !== 'true') {
        console.log('[AI Activities] Feature is disabled');
        return res.status(503).json({ error: "AI activities feature is currently disabled" });
      }

      console.log(`[AI Activities] Request for couple ${req.params.id}`);
      const { id } = req.params;
      const couple = await storage.getCoupleById(id);
      
      if (!couple) {
        console.log('[AI Activities] Couple not found');
        return res.status(404).json({ error: "Couple not found" });
      }

      if (!couple.city || !couple.state) {
        console.log('[AI Activities] Location not set');
        return res.status(400).json({ error: "Location not set. Please set your location in Settings to use AI activities." });
      }

      console.log(`[AI Activities] Generating activity for ${couple.city}, ${couple.state}`);
      
      // Generate just 1 AI activity to keep response fast
      const { generateLocalActivity } = await import('./openai.js');
      
      // Add timeout to prevent hanging (20 seconds should be enough for 1 activity)
      const activityPromise = Promise.race([
        generateLocalActivity({
          city: couple.city!,
          state: couple.state!,
          relationshipType: couple.relationshipType || undefined
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Activity generation timed out after 20 seconds')), 20000)
        )
      ]);

      const activity = await activityPromise;
      console.log(`[AI Activities] Successfully generated activity: ${activity.title}`);

      // Return in array format to match frontend expectations
      res.json({
        activities: [activity],
        location: {
          city: couple.city,
          state: couple.state
        }
      });
    } catch (error) {
      console.error('[AI Activities] Error:', error);
      res.status(500).json({ 
        error: "Failed to generate AI activity",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Use a spark
  app.post("/api/sparkit/couples/:id/use-spark", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      const { id } = req.params;
      const couple = await storage.useSpark(id);
      
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      // Check if trial has expired (0 sparks and still on trial plan)
      if (couple.subscriptionPlan === 'trial' && couple.sparksRemaining === 0) {
        return res.status(403).json({ 
          error: "Trial limit reached",
          message: "Your trial has ended. Please upgrade to premium to continue using Spark It!",
          couple 
        });
      }

      // Get recent activity IDs to prevent duplicates
      const recentActivityIds = (couple.recentActivityIds as number[]) || [];
      console.log(`[Use Spark] Recent activity IDs (${recentActivityIds.length}):`, recentActivityIds);

      // Generate a random activity for this spark (excluding recent ones)
      const { getRandomActivity } = await import('../client/src/data/activities.js');
      const activity = getRandomActivity(couple.relationshipType, recentActivityIds);
      console.log(`[Use Spark] Generated activity: ${activity.title} (ID: ${activity.id})`);

      // Update recent activity IDs (keep last 15)
      const updatedRecentIds = [...recentActivityIds, activity.id].slice(-15);
      console.log(`[Use Spark] Updated recent IDs (${updatedRecentIds.length}):`, updatedRecentIds);

      // Clear button press timestamps and store the activity after spark is consumed
      await storage.updateCouple(id, {
        partner1LastPressed: null as any,
        partner2LastPressed: null as any,
        currentActivityData: activity as any,
        recentActivityIds: updatedRecentIds as any
      });
      console.log('[Use Spark] Cleared button press timestamps, stored activity, and updated recent IDs');

      // Send WebSocket message to BOTH partners to navigate to activity page
      const partner1Client = wsClients.get(`sparkit-${id}-partner1`);
      const partner2Client = wsClients.get(`sparkit-${id}-partner2`);
      
      const navigationMessage = JSON.stringify({
        type: 'spark-used',
        data: { navigateTo: '/spark-activity' }
      });
      
      if (partner1Client && partner1Client.readyState === WebSocket.OPEN) {
        console.log('[Use Spark] Sending navigation message to partner1');
        partner1Client.send(navigationMessage);
      }
      
      if (partner2Client && partner2Client.readyState === WebSocket.OPEN) {
        console.log('[Use Spark] Sending navigation message to partner2');
        partner2Client.send(navigationMessage);
      }

      // Log demo user activity - use partner1 email as default since this is a couple action
      const actorEmail = couple.partner1Email || couple.partner2Email;
      await storage.logDemoActivity({
        coupleId: id,
        coupleCode: couple.coupleCode,
        partnerRole: null,  // Both partners involved in activity reveal
        actorEmail,
        eventType: 'spark',
        eventName: 'activity_reveal',
        eventSource: 'spark',
        eventPayload: {
          activityTitle: activity.title,
          activityCategory: activity.category,
          sparksRemaining: couple.sparksRemaining,
          subscriptionPlan: couple.subscriptionPlan
        }
      });

      res.json(couple);
    } catch (error) {
      console.error('Use spark error:', error);
      res.status(500).json({ error: "Failed to use spark" });
    }
  });

  // Create activity rating
  app.post("/api/sparkit/activity-ratings", requireSparkitAuth, verifyCoupleOwnershipBody, async (req, res) => {
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
  app.post("/api/sparkit/activity-results", requireSparkitAuth, verifyCoupleOwnershipBody, async (req, res) => {
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

  // Generate AI-powered local activity
  app.post("/api/sparkit/couples/:id/ai-activity", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get couple to check location and relationship type
      const couple = await storage.getSparkitCoupleById(id);
      
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }
      
      if (!couple.city || !couple.state) {
        return res.status(400).json({ 
          error: "Location not set",
          message: "Please set your location in Settings to get AI-powered local activities"
        });
      }
      
      // Generate AI activity
      const aiActivity = await generateLocalActivity({
        city: couple.city,
        state: couple.state,
        relationshipType: couple.relationshipType || undefined,
      });
      
      res.json(aiActivity);
    } catch (error) {
      console.error('Generate AI activity error:', error);
      res.status(500).json({ error: "Failed to generate AI activity" });
    }
  });

  // Send activity via SMS to partner
  app.post("/api/sparkit/couples/:id/send-sms", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      const { id } = req.params;
      const { activityTitle, activityDescription, partnerRole } = req.body;
      
      // Validate required fields
      if (!activityTitle || !partnerRole) {
        return res.status(400).json({ error: "Missing required fields: activityTitle and partnerRole" });
      }

      // Authenticate: verify session couple ID matches the couple ID in the URL
      const sessionCoupleId = (req.session as any)?.sparkitCoupleId;
      
      if (!sessionCoupleId || sessionCoupleId !== id) {
        return res.status(403).json({ error: "Unauthorized: couple ID mismatch" });
      }
      
      // Get couple to retrieve partner phone numbers
      const couple = await storage.getSparkitCoupleById(id);
      
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }
      
      // Determine which partner to send to (opposite of current user)
      const recipientPhone = partnerRole === 'partner1' ? couple.partner2Phone : couple.partner1Phone;
      const recipientName = partnerRole === 'partner1' ? couple.partner2Name : couple.partner1Name;
      const senderName = partnerRole === 'partner1' ? couple.partner1Name : couple.partner2Name;
      
      if (!recipientPhone) {
        return res.status(400).json({ 
          error: "Phone number not set",
          message: `${recipientName || 'Your partner'} hasn't added their phone number yet. Ask them to add it in Settings!`
        });
      }
      
      // Format SMS message
      const message = `${senderName} sent you a Spark It! activity:\n\n${activityTitle}${activityDescription ? `\n\n${activityDescription}` : ''}\n\nReady to spark some fun together?`;
      
      // Send SMS
      const result = await sendSMS({
        to: recipientPhone,
        message: message
      });
      
      if (!result.success) {
        console.error('SMS send failed:', result.error);
        return res.status(500).json({ 
          error: "Failed to send SMS",
          message: result.error
        });
      }
      
      console.log(`SMS sent successfully to ${recipientName} at ${recipientPhone}`);
      res.json({ 
        success: true,
        message: `Activity sent to ${recipientName || 'your partner'}!`
      });
      
    } catch (error) {
      console.error('Send SMS error:', error);
      res.status(500).json({ error: "Failed to send SMS" });
    }
  });

  // Get scoreboard stats
  app.get("/api/sparkit/couples/:id/scoreboard", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
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

  // Button press notification (send WebSocket to partner)
  app.post("/api/sparkit/couples/:id/button-press", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Authenticate: verify session couple ID matches the couple ID in the URL
      const sessionCoupleId = (req.session as any)?.sparkitCoupleId;
      const sessionPartnerRole = (req.session as any)?.sparkitPartnerRole;
      
      if (!sessionCoupleId || sessionCoupleId !== id) {
        console.log(`[Button Press] Auth failed - session: ${sessionCoupleId}, requested: ${id}`);
        return res.status(403).json({ error: "Unauthorized: couple ID mismatch" });
      }
      
      if (!sessionPartnerRole || (sessionPartnerRole !== 'partner1' && sessionPartnerRole !== 'partner2')) {
        console.log(`[Button Press] Invalid partner role in session: ${sessionPartnerRole}`);
        return res.status(403).json({ error: "Unauthorized: invalid partner role" });
      }
      
      // Use partner role from session (don't trust client)
      const partner = sessionPartnerRole;
      console.log(`[Button Press] Authenticated request for couple ${id}, partner: ${partner}`);

      // Fetch couple data for SMS and push notifications
      const couple = await storage.getCoupleById(id);
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      // Save button press timestamp to database
      const timestampField = partner === 'partner1' ? 'partner1LastPressed' : 'partner2LastPressed';
      await storage.updateCouplePressTimestamp(id, timestampField);
      console.log(`[Button Press] Saved ${timestampField} timestamp to database`);

      // Determine the other partner (recipient of notifications)
      const otherPartner = partner === 'partner1' ? 'partner2' : 'partner1';
      const presserName = partner === 'partner1' ? couple.partner1Name : couple.partner2Name;
      const recipientName = otherPartner === 'partner1' ? couple.partner1Name : couple.partner2Name;
      const recipientPhone = otherPartner === 'partner1' ? couple.partner1Phone : couple.partner2Phone;
      
      console.log(`[Button Press] Notification routing:`);
      console.log(`  - Presser: ${partner} (${presserName})`);
      console.log(`  - Recipient: ${otherPartner} (${recipientName})`);
      console.log(`  - Recipient phone: ${recipientPhone}`);

      // Send WebSocket message to BOTH partners
      const partner1Client = wsClients.get(`sparkit-${id}-partner1`);
      const partner2Client = wsClients.get(`sparkit-${id}-partner2`);
      
      console.log(`[Button Press] Partner 1 WS: ${partner1Client ? 'connected' : 'NOT connected'}`);
      console.log(`[Button Press] Partner 2 WS: ${partner2Client ? 'connected' : 'NOT connected'}`);
      
      const message = JSON.stringify({
        type: 'spark-button-press',
        data: { partner }
      });
      
      if (partner1Client && partner1Client.readyState === WebSocket.OPEN) {
        console.log(`[Button Press] Sending to partner1 client`);
        partner1Client.send(message);
      }
      
      if (partner2Client && partner2Client.readyState === WebSocket.OPEN) {
        console.log(`[Button Press] Sending to partner2 client`);
        partner2Client.send(message);
      }

      // Send SMS notification to other partner if they have a phone number
      if (recipientPhone) {
        const smsMessage = `${presserName} wants to Spark It! with you! 🎯\n\nOpen the app now to press your button and get an activity together!\n\n${process.env.REPLIT_DEPLOYMENT ? `https://${process.env.REPLIT_DEPLOYMENT}` : 'http://localhost:5000'}/spark`;
        
        try {
          const smsResult = await sendSMS({ 
            to: recipientPhone, 
            message: smsMessage 
          });
          
          if (smsResult.success) {
            console.log(`[Button Press] SMS sent to ${recipientName}`);
          } else {
            console.log(`[Button Press] SMS failed: ${smsResult.error}`);
          }
        } catch (smsError) {
          console.error('[Button Press] SMS error:', smsError);
        }
      }

      // Send push notification to other partner
      const otherPartnerUserId = `sparkit-${id}-${otherPartner}`;
      console.log(`[Button Press] Looking up push subscriptions for userId: ${otherPartnerUserId}`);
      try {
        const subscriptions = await storage.getPushSubscriptions(otherPartnerUserId);
        console.log(`[Button Press] Found ${subscriptions.length} subscription(s) for ${otherPartnerUserId}`);
        
        if (subscriptions.length > 0 && pushNotificationsEnabled) {
          const notificationBody = `${presserName} wants to spark with you! Press your button now!`;
          console.log(`[Button Press] Notification body: "${notificationBody}"`);
          
          const payload = JSON.stringify({
            title: '🎯 Spark It!',
            body: notificationBody,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png',
            url: '/spark'
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
              console.log(`[Button Press] Push notification sent to ${recipientName}`);
            } catch (error: any) {
              if (error.statusCode === 404 || error.statusCode === 410) {
                await storage.deletePushSubscription(sub.endpoint);
              }
              console.error('[Button Press] Push notification error:', error);
            }
          });

          await Promise.all(sendPromises);
        }
      } catch (pushError) {
        console.error('[Button Press] Push notification error:', pushError);
      }

      // Log demo user activity
      const actorEmail = partner === 'partner1' ? couple.partner1Email : couple.partner2Email;
      await storage.logDemoActivity({
        coupleId: id,
        coupleCode: couple.coupleCode,
        partnerRole: partner,
        actorEmail,
        eventType: 'spark',
        eventName: 'button_press',
        eventSource: 'spark',
        eventPayload: {
          partner,
          presserName,
          notificationsSent: {
            websocket: !!(partner1Client || partner2Client),
            sms: !!recipientPhone,
            push: subscriptions?.length > 0
          }
        }
      });
      
      console.log(`[Button Press] Response sent successfully`);
      res.json({ success: true });
    } catch (error) {
      console.error('Button press notification error:', error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Button reset notification (send WebSocket to partner)
  app.post("/api/sparkit/couples/:id/button-reset", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      const { id } = req.params;

      // Authenticate: verify session couple ID matches the couple ID in the URL
      const sessionCoupleId = (req.session as any)?.sparkitCoupleId;
      const sessionPartnerRole = (req.session as any)?.sparkitPartnerRole;
      
      if (!sessionCoupleId || sessionCoupleId !== id) {
        return res.status(403).json({ error: "Unauthorized: couple ID mismatch" });
      }
      
      if (!sessionPartnerRole || (sessionPartnerRole !== 'partner1' && sessionPartnerRole !== 'partner2')) {
        return res.status(403).json({ error: "Unauthorized: invalid partner role" });
      }

      // Clear button press timestamps
      await storage.updateCouple(id, {
        partner1LastPressed: null as any,
        partner2LastPressed: null as any
      });
      console.log('[Button Reset] Cleared button press timestamps');

      // Send WebSocket message to BOTH partners
      const partner1Client = wsClients.get(`sparkit-${id}-partner1`);
      const partner2Client = wsClients.get(`sparkit-${id}-partner2`);
      
      const message = JSON.stringify({
        type: 'spark-button-reset',
        data: {}
      });
      
      if (partner1Client && partner1Client.readyState === WebSocket.OPEN) {
        partner1Client.send(message);
      }
      
      if (partner2Client && partner2Client.readyState === WebSocket.OPEN) {
        partner2Client.send(message);
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Button reset notification error:', error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // Get random trivia questions by category
  app.get("/api/sparkit/trivia/questions/random/:categorySlug", async (req, res) => {
    try {
      const { categorySlug } = req.params;
      const count = parseInt(req.query.count as string) || 5;
      
      console.log('[Trivia Questions API] Request for category:', categorySlug, 'count:', count);
      
      // Map frontend category slugs to database category names
      const categoryNameMap: Record<string, string> = {
        'pop-culture': 'Pop Culture',
        'science': 'Science',
        'history': 'History',
        'geography': 'Geography',
        'food-drink': 'Food & Drink',
        'sports': 'Sports',
        'music': 'Music',
        'literature': 'Art & Literature',
        'general': 'General Knowledge',
        'couples': 'General Knowledge'
      };
      
      const categoryName = categoryNameMap[categorySlug];
      console.log('[Trivia Questions API] Mapped to category name:', categoryName);
      
      if (!categoryName) {
        console.error('[Trivia Questions API] Category slug not found:', categorySlug);
        return res.status(404).json({ error: "Category not found" });
      }
      
      // Get all questions for this category by matching category name
      const questions = await storage.getTriviaQuestionsByCategoryName(categoryName);
      console.log('[Trivia Questions API] Found questions:', questions.length);
      
      if (questions.length === 0) {
        console.error('[Trivia Questions API] No questions for category:', categoryName);
        return res.status(404).json({ error: "No questions found for this category" });
      }
      
      // Shuffle and take the requested count
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const randomQuestions = shuffled.slice(0, Math.min(count, questions.length));
      
      console.log('[Trivia Questions API] Returning', randomQuestions.length, 'questions');
      res.json(randomQuestions);
    } catch (error) {
      console.error('[Trivia Questions API] Error:', error);
      res.status(500).json({ error: "Failed to get random trivia questions" });
    }
  });

  // Create trivia contest (send challenge)
  app.post("/api/sparkit/trivia/contests", requireSparkitAuth, verifyCoupleOwnershipBody, async (req, res) => {
    try {
      console.log('[Trivia API] Creating contest. Session:', {
        coupleId: req.session.sparkitCoupleId,
        partnerRole: req.session.sparkitPartnerRole
      });
      console.log('[Trivia API] Request body:', {
        coupleId: req.body.coupleId,
        categoryId: req.body.categoryId,
        categoryName: req.body.categoryName,
        questionCount: req.body.questionIds?.length,
        senderName: req.body.senderName
      });

      const { coupleId, categoryId, categoryName, questionIds, senderName } = req.body;
      
      if (!coupleId || !categoryId || !categoryName || !questionIds || !senderName) {
        console.error('[Trivia API] Missing required fields:', {
          hasCoupleId: !!coupleId,
          hasCategoryId: !!categoryId,
          hasCategoryName: !!categoryName,
          hasQuestionIds: !!questionIds,
          hasSenderName: !!senderName
        });
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!Array.isArray(questionIds) || questionIds.length !== 5) {
        console.error('[Trivia API] Invalid questionIds:', questionIds);
        return res.status(400).json({ error: "questionIds must be an array of 5 question IDs" });
      }

      const contest = await storage.createTriviaContest({
        coupleId,
        categoryId,
        categoryName,
        questionIds,
        senderName,
        senderPartnerRole: req.session.sparkitPartnerRole!, // 'partner1' or 'partner2'
        status: 'pending'
      });

      console.log('[Trivia API] Contest created successfully:', contest.id);
      res.json(contest);
    } catch (error) {
      console.error('[Trivia API] Create trivia contest error:', error);
      res.status(500).json({ error: "Failed to create trivia contest" });
    }
  });

  // Get trivia contest by ID (PUBLIC - anyone with link can access)
  app.get("/api/sparkit/trivia/contests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const contest = await storage.getTriviaContestById(id);
      
      if (!contest) {
        return res.status(404).json({ error: "Contest not found" });
      }

      // Fetch the full question objects for the contest
      const questions = await storage.getTriviaQuestionsByIds(contest.questionIds as string[]);

      res.json({
        ...contest,
        questions
      });
    } catch (error) {
      console.error('Get trivia contest error:', error);
      res.status(500).json({ error: "Failed to get trivia contest" });
    }
  });

  // Get trivia contests by couple ID
  app.get("/api/sparkit/trivia/couples/:coupleId/contests", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      const { coupleId } = req.params;
      const contests = await storage.getTriviaContestsByCoupleId(coupleId);
      
      res.json(contests);
    } catch (error) {
      console.error('Get trivia contests error:', error);
      res.status(500).json({ error: "Failed to get trivia contests" });
    }
  });

  // Start/accept trivia challenge (AUTHENTICATED - receiver must be logged in)
  app.post("/api/sparkit/trivia/contests/:id/start", requireSparkitAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const receiverPartnerRole = req.session.sparkitPartnerRole!; // Get from session
      const receiverCoupleId = req.session.sparkitCoupleId!; // Get from session

      const contest = await storage.getTriviaContestById(id);
      if (!contest) {
        return res.status(404).json({ error: "Contest not found" });
      }

      // Verify receiver is from the same couple as sender
      if (contest.coupleId !== receiverCoupleId) {
        return res.status(403).json({ error: "You can only accept challenges from your own couple" });
      }

      // Verify receiver is not the sender
      if (contest.senderPartnerRole === receiverPartnerRole) {
        return res.status(400).json({ error: "You cannot accept your own challenge" });
      }

      if (contest.status === 'completed') {
        return res.status(400).json({ error: "Contest has already been completed" });
      }

      // Get couple data to determine receiver name
      const couple = await storage.getCoupleById(receiverCoupleId);
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      const receiverName = receiverPartnerRole === 'partner1' ? couple.partner1Name : couple.partner2Name;

      // Atomically update receiverName, receiverPartnerRole, and status
      // This prevents race conditions from concurrent acceptance attempts
      const updatedContest = await storage.startTriviaContest(id, receiverName, receiverPartnerRole);

      // If update failed, someone else already accepted
      if (!updatedContest) {
        return res.status(400).json({ 
          error: "Contest has already been started"
        });
      }

      // Send WebSocket notification to the sender (couple already loaded above)
      // Determine sender's partner role (opposite of receiver)
      const senderPartnerRole = receiverPartnerRole === 'partner1' ? 'partner2' : 'partner1';

      const senderUserId = `sparkit-${contest.coupleId}-${senderPartnerRole}`;
      const senderClient = (global as any).webSocketClients?.get(senderUserId);
      
      if (senderClient && senderClient.readyState === 1) {
        const wsMessage = JSON.stringify({
          type: 'trivia-accepted',
          data: {
            contestId: id,
            categoryName: contest.categoryName,
            receiverName
          }
        });
        
        senderClient.send(wsMessage);
        console.log(`[Trivia Started] WebSocket notification sent to ${contest.senderName}: ${receiverName} started the challenge`);
      } else {
        console.log(`[Trivia Started] Sender ${contest.senderName} not connected via WebSocket`);
      }

      res.json({ success: true, message: "Challenge started" });
    } catch (error) {
      console.error('Start trivia contest error:', error);
      res.status(500).json({ error: "Failed to start trivia contest" });
    }
  });

  // Submit trivia answers (AUTHENTICATED - logged in partner submits)
  app.post("/api/sparkit/trivia/contests/:id/answers", requireSparkitAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { answers } = req.body;
      const submitterPartnerRole = req.session.sparkitPartnerRole!; // 'partner1' or 'partner2'

      if (!answers || !Array.isArray(answers) || answers.length !== 5) {
        return res.status(400).json({ error: "answers must be an array of 5 answers" });
      }

      const contest = await storage.getTriviaContestById(id);
      if (!contest) {
        return res.status(404).json({ error: "Contest not found" });
      }

      if (contest.status === 'completed') {
        return res.status(400).json({ error: "Contest has already been completed" });
      }

      // Determine if submitter is sender or receiver
      const isSender = contest.senderPartnerRole === submitterPartnerRole;
      
      // Check if this partner already submitted
      if (isSender && contest.senderScore !== null) {
        return res.status(400).json({ error: "You have already submitted your answers" });
      }
      if (!isSender && contest.receiverScore !== null) {
        return res.status(400).json({ error: "You have already submitted your answers" });
      }

      // Save all answers
      let correctCount = 0;
      for (const answer of answers) {
        await storage.createTriviaAnswer({
          contestId: id,
          coupleId: contest.coupleId,
          partner: submitterPartnerRole, // Store actual partner role
          questionId: String(answer.questionId),
          selectedAnswer: String(answer.selectedAnswer),
          isCorrect: answer.isCorrect
        });
        
        if (answer.isCorrect) {
          correctCount++;
        }
      }

      // Update contest with this partner's score
      const updates: any = {};
      if (isSender) {
        updates.senderScore = correctCount;
      } else {
        updates.receiverScore = correctCount;
      }

      // Check if both partners have now submitted
      const bothSubmitted = (isSender && contest.receiverScore !== null) || 
                           (!isSender && contest.senderScore !== null);
      
      if (bothSubmitted) {
        updates.status = 'completed';
        updates.score = correctCount; // For backwards compatibility
      }

      const updatedContest = await storage.updateTriviaContest(id, updates);

      // Send notification only when BOTH partners have submitted (contest completed)
      if (bothSubmitted) {
        const couple = await storage.getCoupleById(contest.coupleId);
      
        if (couple) {
          // Send WebSocket notification to BOTH partners
          const senderWsId = `sparkit-${contest.coupleId}-${contest.senderPartnerRole}`;
          const receiverWsId = `sparkit-${contest.coupleId}-${contest.receiverPartnerRole}`;
          
          const wsMessage = JSON.stringify({
            type: 'trivia-completed',
            data: {
              contestId: id,
              categoryName: contest.categoryName,
              senderName: contest.senderName,
              receiverName: contest.receiverName,
              senderScore: updatedContest.senderScore,
              receiverScore: updatedContest.receiverScore,
              totalQuestions: 5
            }
          });

          // Notify sender
          const senderClient = wsClients.get(senderWsId);
          if (senderClient && senderClient.readyState === WebSocket.OPEN) {
            senderClient.send(wsMessage);
            console.log(`[Trivia Complete] WebSocket notification sent to ${contest.senderName}`);
          }

          // Notify receiver
          const receiverClient = wsClients.get(receiverWsId);
          if (receiverClient && receiverClient.readyState === WebSocket.OPEN) {
            receiverClient.send(wsMessage);
            console.log(`[Trivia Complete] WebSocket notification sent to ${contest.receiverName}`);
          }
        }
      }

      res.json({
        contest: updatedContest,
        score: correctCount,
        totalQuestions: 5
      });
    } catch (error) {
      console.error('Submit trivia answers error:', error);
      res.status(500).json({ error: "Failed to submit trivia answers" });
    }
  });

  // Get trivia results (contest with answers) (PUBLIC - anyone with link can view)
  app.get("/api/sparkit/trivia/contests/:id/results", async (req, res) => {
    try {
      const { id } = req.params;
      const contest = await storage.getTriviaContestById(id);
      
      if (!contest) {
        return res.status(404).json({ error: "Contest not found" });
      }

      if (contest.status !== 'completed') {
        return res.status(400).json({ error: "Contest not yet completed" });
      }

      const answers = await storage.getTriviaAnswersByContestId(id);

      res.json({
        contest,
        answers,
        score: contest.score,
        totalQuestions: 5
      });
    } catch (error) {
      console.error('Get trivia results error:', error);
      res.status(500).json({ error: "Failed to get trivia results" });
    }
  });

  // Create Spark It! subscription checkout session
  app.post("/api/sparkit/create-subscription", requireSparkitAuth, verifyCoupleOwnershipBody, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ error: "Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables." });
      }

      const { coupleId, billingPeriod } = req.body;
      
      if (!coupleId || !billingPeriod) {
        return res.status(400).json({ error: "Missing required fields: coupleId, billingPeriod" });
      }

      const couple = await storage.getCoupleById(coupleId);
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      // Define pricing for Spark It! (in cents)
      const prices: Record<string, number> = {
        "monthly": 699,  // $6.99/mo (reduced trial price)
        "yearly": 5999   // $59.99/year (saves $24)
      };

      const amount = prices[billingPeriod];
      if (!amount) {
        return res.status(400).json({ error: "Invalid billing period. Choose 'monthly' or 'yearly'" });
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

  // Stripe webhook handler for Spark It! subscriptions
  app.post("/api/sparkit/webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).send("Stripe not configured");
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig) {
      return res.status(400).send("No signature provided");
    }

    let event: Stripe.Event;

    try {
      // Verify the webhook signature (if webhook secret is configured)
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // In development, just use the event from the body
        event = req.body as Stripe.Event;
      }
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const coupleId = session.metadata?.coupleId;
          const billingPeriod = session.metadata?.billingPeriod;

          if (coupleId && billingPeriod) {
            const subscriptionPlan = billingPeriod === 'yearly' ? 'yearly' : 'monthly';
            
            await storage.updateCouple(coupleId, {
              subscriptionPlan,
              stripeSubscriptionId: session.subscription as string,
              sparksRemaining: 999 // Premium gets 999 sparks
            });

            console.log(`✅ Subscription activated for couple ${coupleId}: ${subscriptionPlan}`);
          }
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          // Find couple by Stripe customer ID using efficient query
          const couple = await storage.getCoupleByStripeCustomerId(customerId);

          if (couple) {
            // Update subscription status based on Stripe status
            if (subscription.status === 'active') {
              const interval = subscription.items.data[0]?.price.recurring?.interval;
              const plan = interval === 'year' ? 'yearly' : 'monthly';
              
              await storage.updateCouple(couple.id, {
                subscriptionPlan: plan,
                stripeSubscriptionId: subscription.id,
                sparksRemaining: 999 // Premium gets 999 sparks
              });
            } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
              await storage.updateCouple(couple.id, {
                subscriptionPlan: 'trial',
                sparksRemaining: 20, // Trial gets 20 total sparks
                totalSparksUsed: 0 // Reset trial counter
              });
            }
            console.log(`✅ Subscription updated for couple ${couple.id}: ${subscription.status}`);
          }
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          // Find couple by Stripe customer ID using efficient query
          const couple = await storage.getCoupleByStripeCustomerId(customerId);

          if (couple) {
            await storage.updateCouple(couple.id, {
              subscriptionPlan: 'trial',
              stripeSubscriptionId: null,
              sparksRemaining: 20, // Trial gets 20 total sparks
              totalSparksUsed: 0 // Reset trial counter
            });
            console.log(`✅ Subscription canceled for couple ${couple.id}`);
          }
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).send('Webhook handler failed');
    }
  });

  // Spark It! Video Room Routes
  // Create a new Daily.co video room for a couple
  app.post("/api/sparkit/video/create-room", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      const { coupleId } = req.body;

      if (!coupleId) {
        return res.status(400).json({ message: "Couple ID is required" });
      }

      if (!process.env.DAILY_API_KEY) {
        return res.status(503).json({ message: "Video service not configured" });
      }

      // Check if couple has premium subscription (video calling is premium-only)
      const couple = await storage.getCoupleById(coupleId);
      if (!couple) {
        return res.status(404).json({ message: "Couple not found" });
      }

      const isPremium = couple.subscriptionPlan === 'monthly' || couple.subscriptionPlan === 'yearly';
      if (!isPremium) {
        return res.status(403).json({ 
          message: "Premium subscription required for video calling",
          error: "Video calling is a premium feature. Please upgrade to continue."
        });
      }

      // Check if couple already has an active video session
      const existingSession = await storage.getActiveVideoSessionByCoupleId(coupleId);
      if (existingSession) {
        return res.json({
          roomUrl: existingSession.roomUrl,
          roomName: existingSession.roomName,
          sessionId: existingSession.id
        });
      }

      // Create a new Daily.co room
      const roomName = `sparkit-${coupleId}-${Date.now()}`;
      const expiresInSeconds = 60 * 60; // 1 hour

      const response = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DAILY_API_KEY}`
        },
        body: JSON.stringify({
          name: roomName,
          privacy: 'private',
          properties: {
            max_participants: 2,
            enable_screenshare: false,
            enable_chat: false,
            enable_knocking: false,
            enable_prejoin_ui: false,
            exp: Math.floor(Date.now() / 1000) + expiresInSeconds
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Daily.co API error:', error);
        return res.status(500).json({ message: "Failed to create video room" });
      }

      const roomData = await response.json();

      // Save session to database
      const session = await storage.createVideoSession({
        coupleId,
        roomName: roomData.name,
        roomUrl: roomData.url,
        status: 'active',
        expiresAt: new Date(Date.now() + expiresInSeconds * 1000)
      });

      res.json({
        roomUrl: session.roomUrl,
        roomName: session.roomName,
        sessionId: session.id
      });
    } catch (error) {
      console.error('Create video room error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // End a video session
  app.post("/api/sparkit/video/end-session", requireSparkitAuth, async (req, res) => {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      const session = await storage.getVideoSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Update session status
      await storage.updateVideoSession(sessionId, { status: 'ended' });

      // Optionally delete the room from Daily.co (or let it expire)
      if (process.env.DAILY_API_KEY) {
        try {
          await fetch(`https://api.daily.co/v1/rooms/${session.roomName}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${process.env.DAILY_API_KEY}`
            }
          });
        } catch (error) {
          console.error('Error deleting Daily.co room:', error);
          // Non-critical error, continue
        }
      }

      res.json({ message: "Session ended successfully" });
    } catch (error) {
      console.error('End video session error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Avatar & Object Storage Routes (from blueprint:javascript_object_storage)
  
  // Serve public objects (avatars can be accessed publicly)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Serve public assets (for pre-made avatars)
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get upload URL for custom avatar
  app.post("/api/sparkit/avatar/upload-url", requireSparkitAuth, verifyCoupleOwnershipBody, async (req, res) => {
    try {
      const { coupleId } = req.body;
      
      if (!coupleId) {
        return res.status(400).json({ error: "Couple ID is required" });
      }

      // Verify couple exists
      const couple = await storage.getCoupleById(coupleId);
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Get avatar upload URL error:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Update avatar after upload
  app.patch("/api/sparkit/couples/:id/avatars", requireSparkitAuth, verifyCoupleOwnership, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateAvatarSchema.parse(req.body);

      const couple = await storage.getCoupleById(id);
      if (!couple) {
        return res.status(404).json({ error: "Couple not found" });
      }

      // Server-side premium check: only monthly or yearly subscriptions can use avatars
      const isPremium = couple.subscriptionPlan === 'monthly' || couple.subscriptionPlan === 'yearly';
      if (!isPremium) {
        return res.status(403).json({ error: "Premium subscription required for custom avatars" });
      }

      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        validatedData.avatarUrl,
        {
          owner: id, // Couple owns the avatar
          visibility: "public", // Avatars are public (visible on scoreboard)
        },
      );

      // Update couple with new avatar URL
      const updateData: Partial<InsertSparkitCouple> = {};
      if (validatedData.partner === "partner1") {
        updateData.partner1AvatarUrl = objectPath;
      } else {
        updateData.partner2AvatarUrl = objectPath;
      }

      await storage.updateCouple(id, updateData);
      const updatedCouple = await storage.getCoupleById(id);

      res.json(updatedCouple);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Update avatar error:', error);
      res.status(500).json({ error: "Failed to update avatar" });
    }
  });

  // Spark It! Daily Reminders - Get reminder preferences for couple
  app.get("/api/sparkit/reminders/preferences", requireSparkitAuth, async (req, res) => {
    try {
      const coupleId = req.session.sparkitCoupleId!;
      
      let preferences = await storage.getReminderPreferences(coupleId);
      
      // If no preferences exist, create default ones
      if (!preferences) {
        preferences = await storage.createReminderPreferences({
          coupleId,
          enabled: true,
          reminderTime: '09:00',
          notificationMethod: 'sms'
        });
      }
      
      res.json(preferences);
    } catch (error) {
      console.error('Get reminder preferences error:', error);
      res.status(500).json({ error: "Failed to get reminder preferences" });
    }
  });

  // Spark It! Daily Reminders - Update reminder preferences
  app.put("/api/sparkit/reminders/preferences", requireSparkitAuth, async (req, res) => {
    try {
      const coupleId = req.session.sparkitCoupleId!;
      const { enabled, reminderTime, notificationMethod } = req.body;
      
      // Validate reminder time format (HH:MM)
      if (reminderTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(reminderTime)) {
        return res.status(400).json({ error: "Invalid time format. Use HH:MM (e.g., '09:00')" });
      }
      
      // Validate notification method
      if (notificationMethod && !['sms', 'email', 'push', 'all'].includes(notificationMethod)) {
        return res.status(400).json({ error: "Invalid notification method. Use 'sms', 'email', 'push', or 'all'" });
      }
      
      // Get or create preferences
      let preferences = await storage.getReminderPreferences(coupleId);
      
      if (!preferences) {
        // Create new preferences
        preferences = await storage.createReminderPreferences({
          coupleId,
          enabled: enabled ?? true,
          reminderTime: reminderTime ?? '09:00',
          notificationMethod: notificationMethod ?? 'sms'
        });
      } else {
        // Update existing preferences
        const updates: any = {};
        if (enabled !== undefined) updates.enabled = enabled;
        if (reminderTime) updates.reminderTime = reminderTime;
        if (notificationMethod) updates.notificationMethod = notificationMethod;
        
        preferences = await storage.updateReminderPreferences(coupleId, updates);
      }
      
      res.json(preferences);
    } catch (error) {
      console.error('Update reminder preferences error:', error);
      res.status(500).json({ error: "Failed to update reminder preferences" });
    }
  });

  // Spark It! Daily Reminders - Preview today's content
  app.get("/api/sparkit/reminders/preview", requireSparkitAuth, async (req, res) => {
    try {
      // Get random content of each type
      const question = await storage.getRandomDailyContent('question');
      const activity = await storage.getRandomDailyContent('activity');
      const conversationStarter = await storage.getRandomDailyContent('conversation_starter');
      
      res.json({
        question: question?.content || null,
        activity: activity?.content || null,
        conversationStarter: conversationStarter?.content || null
      });
    } catch (error) {
      console.error('Get daily content preview error:', error);
      res.status(500).json({ error: "Failed to get daily content preview" });
    }
  });

  // Admin: Send announcement to all Spark It! users with push notifications
  app.post("/api/admin/sparkit/announce", async (req, res) => {
    console.log('📢 Admin announcement endpoint called');
    try {
      // Verify admin access using Authorization header
      const authHeader = req.headers.authorization;
      const adminEmail = process.env.ADMIN_EMAIL;
      
      if (!authHeader || !adminEmail) {
        console.log('❌ Unauthorized: Missing auth header or admin email');
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      // Extract token from "Bearer <token>" format
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
      
      // Verify token matches admin email (simple approach for demo)
      if (token !== adminEmail) {
        console.log('❌ Unauthorized: Token mismatch');
        return res.status(403).json({ error: "Unauthorized" });
      }
      
      const { title, body, url } = req.body;
      console.log(`✅ Admin authenticated. Announcement: "${title}"`);
      
      if (!pushNotificationsEnabled) {
        console.log('❌ Push notifications not configured');
        return res.status(503).json({ error: "Push notifications not configured" });
      }
      
      if (!title || !body) {
        console.log('❌ Missing title or body');
        return res.status(400).json({ error: "Title and body are required" });
      }
      
      // Get all Spark It! couples
      const couples = await storage.getAllCouples();
      console.log(`📊 Found ${couples.length} couples`);
      
      let sentCount = 0;
      let failedCount = 0;
      
      // Send to each couple who has push subscriptions
      for (const couple of couples) {
        // Get subscriptions for both partners
        const partner1Subscriptions = await storage.getPushSubscriptions(`sparkit-${couple.id}-partner1`);
        const partner2Subscriptions = await storage.getPushSubscriptions(`sparkit-${couple.id}-partner2`);
        const subscriptions = [...partner1Subscriptions, ...partner2Subscriptions];
        
        if (subscriptions.length === 0) {
          continue;
        }
        
        console.log(`📱 Sending to ${couple.partner1Name} & ${couple.partner2Name} (${subscriptions.length} subscriptions)`);
        
        const payload = JSON.stringify({
          title,
          body,
          icon: '/sparkit-icon-192.png',
          badge: '/sparkit-icon-192.png',
          url: url || '/sparkit'
        });
        
        for (const sub of subscriptions) {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          };
          
          try {
            await webpush.sendNotification(pushSubscription, payload);
            sentCount++;
            console.log(`  ✅ Sent to subscription ${sub.endpoint.substring(0, 50)}...`);
          } catch (error: any) {
            // Remove invalid subscriptions
            if (error.statusCode === 404 || error.statusCode === 410) {
              await storage.deletePushSubscription(sub.endpoint);
              console.log(`  🗑️  Removed invalid subscription (${error.statusCode})`);
            }
            failedCount++;
            console.error('  ❌ Push notification error:', error.message);
          }
        }
      }
      
      console.log(`📊 Announcement complete: ${sentCount} sent, ${failedCount} failed, ${couples.length} couples`);
      
      res.json({ 
        success: true, 
        sent: sentCount,
        failed: failedCount,
        totalCouples: couples.length
      });
    } catch (error) {
      console.error('Send announcement error:', error);
      res.status(500).json({ error: "Failed to send announcement" });
    }
  });

  // TEMPORARY: Admin route to fix production database
  app.get('/admin/fix-premm1-production', async (req, res) => {
    try {
      console.log('🔧 Admin: Fixing PREMM1 production data...');
      
      // Find couple by code
      const couple = await storage.getCoupleByCode('PREMM1');
      if (!couple) {
        return res.status(404).json({ error: 'PREMM1 not found' });
      }
      
      console.log('📋 Current PREMM1 data:', {
        id: couple.id,
        subscriptionPlan: couple.subscriptionPlan,
        sparksRemaining: couple.sparksRemaining,
        subscriptionStatus: couple.subscriptionStatus
      });
      
      // Update PREMM1 to premium monthly
      const result = await storage.updateCouple(couple.id, {
        subscriptionPlan: 'monthly',
        subscriptionStatus: 'active',
        sparksRemaining: 999
      });
      
      console.log('✅ Updated PREMM1:', result);
      
      res.json({ 
        success: true, 
        message: 'PREMM1 updated to Premium Monthly with 999 sparks',
        before: {
          subscriptionPlan: couple.subscriptionPlan,
          sparksRemaining: couple.sparksRemaining
        },
        after: result
      });
    } catch (error) {
      console.error('❌ Fix production error:', error);
      res.status(500).json({ error: String(error) });
    }
  });

  return httpServer;
}
