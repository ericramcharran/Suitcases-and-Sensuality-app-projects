import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPersonalityAnswersSchema, insertRelationshipAnswersSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Transform snake_case database fields to camelCase for frontend
function transformUserForFrontend(user: any) {
  return {
    ...user,
    eyeColor: user.eye_color,
    hairColor: user.hair_color,
    bodyShape: user.body_shape,
    profileImages: user.profile_images,
    escrowBalance: user.escrow_balance,
    personalityType: user.personality_type,
    relationshipStyle: user.relationship_style,
    agreedTerms: user.agreed_terms,
    agreedConsent: user.agreed_consent,
    agreedPrivacy: user.agreed_privacy,
    agreedGuidelines: user.agreed_guidelines,
    createdAt: user.created_at
  };
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
      res.json(transformUserForFrontend(user));
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
            
            // Convert to compatibility (max diff is 20, so normalize to 0-30 points)
            compatibility += Math.max(0, 30 - (scoreDiff * 1.5));
          }

          // Role compatibility bonus
          if (currentUser.role === 'Dominant' && user.role === 'Submissive') {
            compatibility += 15;
          } else if (currentUser.role === 'Submissive' && user.role === 'Dominant') {
            compatibility += 15;
          } else if (currentUser.role === 'Switch' || user.role === 'Switch') {
            compatibility += 10;
          }

          // Relationship style compatibility
          if (userRelationship && targetRelationship) {
            if (userRelationship.relationshipStyle === targetRelationship.relationshipStyle) {
              compatibility += 10;
            }
          }

          // Cap at 99%
          compatibility = Math.min(99, Math.round(compatibility));

          return {
            ...transformUserForFrontend(user),
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

  const httpServer = createServer(app);
  return httpServer;
}
