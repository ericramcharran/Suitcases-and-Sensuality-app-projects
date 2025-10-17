import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPersonalityAnswersSchema, insertRelationshipAnswersSchema } from "@shared/schema";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
