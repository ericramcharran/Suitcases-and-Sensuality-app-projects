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
  agreedTerms: boolean("agreed_terms").default(false),
  agreedConsent: boolean("agreed_consent").default(false),
  agreedPrivacy: boolean("agreed_privacy").default(false),
  agreedGuidelines: boolean("agreed_guidelines").default(false),
  personalityAnswers: jsonb("personality_answers"),
  relationshipAnswers: jsonb("relationship_answers"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
