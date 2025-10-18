import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'Dominant', 'Submissive', 'Switch'
  verified: boolean("verified").default(false),
  escrowBalance: integer("escrow_balance").default(0),
  personalityType: text("personality_type"),
  relationshipStyle: text("relationship_style"),
  plan: text("plan"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  agreedTerms: boolean("agreed_terms").default(false),
  agreedConsent: boolean("agreed_consent").default(false),
  agreedPrivacy: boolean("agreed_privacy").default(false),
  agreedGuidelines: boolean("agreed_guidelines").default(false),
  personalityAnswers: jsonb("personality_answers"),
  relationshipAnswers: jsonb("relationship_answers"),
  profileImages: jsonb("profile_images").$type<string[]>().default(sql`'[]'::jsonb`), // Array of image URLs (max 6)
  // Physical attributes
  age: integer("age"),
  sex: text("sex"), // Male, Female, Non-binary, etc.
  height: text("height"),
  weight: text("weight"),
  bodyType: text("body_type"), // Slim, Athletic, Average, Curvy, Plus-size, Muscular
  race: text("race"),
  eyeColor: text("eye_color"),
  hairColor: text("hair_color"),
  nationality: text("nationality"),
  bodyShape: text("body_shape"),
  // Location
  city: text("city"),
  state: text("state"),
  // Lifestyle
  profession: text("profession"), // General category
  drinking: text("drinking"), // Never, Socially, Regularly
  smoking: text("smoking"), // Never, Socially, Regularly
  fitnessLevel: text("fitness_level"), // Sedentary, Moderate, Active, Very Active
  // Relationship preferences
  lookingFor: text("looking_for"), // Casual, Long-term, Exploring, etc.
  experienceLevel: text("experience_level"), // Beginner, Intermediate, Advanced, Expert
  sexualOrientation: text("sexual_orientation"),
  importantTraits: jsonb("important_traits").$type<string[]>().default(sql`'[]'::jsonb`), // Array of selected important traits
  // Profile bio
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  targetUserId: varchar("target_user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // 'like' or 'pass'
  mutualMatch: boolean("mutual_match").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const personalityAnswers = pgTable("personality_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  answers: jsonb("answers").notNull(), // Array of answers
  personalityType: text("personality_type"), // Computed result
  scores: jsonb("scores"), // Category scores
  createdAt: timestamp("created_at").defaultNow(),
});

export const relationshipAnswers = pgTable("relationship_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  answers: jsonb("answers").notNull(), // Array of answers
  relationshipStyle: text("relationship_style"), // Computed result
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertPersonalityAnswersSchema = createInsertSchema(personalityAnswers).omit({
  id: true,
  createdAt: true,
});

export const insertRelationshipAnswersSchema = createInsertSchema(relationshipAnswers).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertPersonalityAnswers = z.infer<typeof insertPersonalityAnswersSchema>;
export type PersonalityAnswers = typeof personalityAnswers.$inferSelect;
export type InsertRelationshipAnswers = z.infer<typeof insertRelationshipAnswersSchema>;
export type RelationshipAnswers = typeof relationshipAnswers.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
