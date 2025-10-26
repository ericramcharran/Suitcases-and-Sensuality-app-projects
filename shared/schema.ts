import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").default(false),
  phone: text("phone"),
  phoneVerified: boolean("phone_verified").default(false),
  password: text("password"),
  name: text("name").notNull(),
  profileName: varchar("profile_name", { length: 20 }), // Display name for profile (max 20 chars)
  role: text("role").notNull(), // 'Dominant', 'submissive', 'Switch'
  verified: boolean("verified").default(false), // ID/background check verified
  escrowBalance: integer("escrow_balance").default(0),
  escrowVerified: boolean("escrow_verified").default(false), // For Dominants with escrow/mutual fund verification
  fullyFunded: boolean("fully_funded").default(false), // Indicates if escrow account is fully funded
  personalityType: text("personality_type"),
  relationshipStyle: text("relationship_style"),
  plan: text("plan"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  agreedTerms: boolean("agreed_terms").default(false),
  termsSignature: text("terms_signature"),
  termsSignedDate: timestamp("terms_signed_date"),
  agreedConsent: boolean("agreed_consent").default(false),
  consentSignature: text("consent_signature"),
  consentSignedDate: timestamp("consent_signed_date"),
  agreedPrivacy: boolean("agreed_privacy").default(false),
  privacySignature: text("privacy_signature"),
  privacySignedDate: timestamp("privacy_signed_date"),
  agreedGuidelines: boolean("agreed_guidelines").default(false),
  guidelinesSignature: text("guidelines_signature"),
  guidelinesSignedDate: timestamp("guidelines_signed_date"),
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
  lastActive: timestamp("last_active").defaultNow(),
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

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bdsmTestResults = pgTable("bdsm_test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  testImageUrl: text("test_image_url"), // URL of uploaded test result screenshot/PDF
  kinkPreferences: jsonb("kink_preferences").$type<Record<string, number>>().default(sql`'{}'::jsonb`), // Key-value pairs of kink categories and percentages
  topRole: text("top_role"), // Primary role from test (e.g., "Rope Top", "Sadist")
  rolePercentages: jsonb("role_percentages").$type<Record<string, number>>().default(sql`'{}'::jsonb`), // Role breakdown with percentages
  createdAt: timestamp("created_at").defaultNow(),
});

export const verificationCodes = pgTable("verification_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emailOrPhone: text("email_or_phone").notNull(), // Email address or phone number
  code: varchar("code", { length: 6 }).notNull(), // 6-digit verification code
  type: text("type").notNull(), // 'email' or 'phone'
  verified: boolean("verified").default(false),
  expiresAt: timestamp("expires_at").notNull(), // Codes expire after 10 minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// Spark It! Tables
export const sparkitCouples = pgTable("sparkit_couples", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partner1Name: text("partner1_name").notNull(),
  partner2Name: text("partner2_name"), // Nullable - set when partner 2 joins
  partner1Email: text("partner1_email").unique(), // Email for partner 1 login
  partner1Password: text("partner1_password"), // Password for partner 1 login
  partner2Email: text("partner2_email").unique(), // Email for partner 2 login
  partner2Password: text("partner2_password"), // Password for partner 2 login
  partner1AvatarUrl: text("partner1_avatar_url"), // Avatar for partner 1 (pre-made or custom upload)
  partner2AvatarUrl: text("partner2_avatar_url"), // Avatar for partner 2 (pre-made or custom upload)
  coupleCode: varchar("couple_code", { length: 10 }).unique().notNull(), // Unique code for couple pairing
  emailOrPhone: text("email_or_phone"), // Optional for notifications
  subscriptionPlan: text("subscription_plan").default('free'), // 'free', 'trial', 'monthly', 'yearly'
  subscriptionStatus: text("subscription_status").default('active'), // 'active', 'trial_expired', 'cancelled'
  billingPeriod: text("billing_period"), // 'monthly' or 'yearly'
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  sparksRemaining: integer("sparks_remaining").default(3), // Free tier: 3 sparks/day
  lastSparkReset: timestamp("last_spark_reset").defaultNow(),
  partner2JoinedAt: timestamp("partner2_joined_at"), // Track when trial period starts
  totalSparksUsed: integer("total_sparks_used").default(0), // Track total sparks used during trial
  createdAt: timestamp("created_at").defaultNow(),
});

export const sparkitActivityRatings = pgTable("sparkit_activity_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coupleId: varchar("couple_id").notNull().references(() => sparkitCouples.id),
  activityId: integer("activity_id").notNull(), // References the activity from activities.ts
  activityTitle: text("activity_title").notNull(),
  rating: text("rating").notNull(), // 'loved' or 'meh'
  createdAt: timestamp("created_at").defaultNow(),
});

export const sparkitActivityResults = pgTable("sparkit_activity_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coupleId: varchar("couple_id").notNull().references(() => sparkitCouples.id),
  activityId: integer("activity_id").notNull(),
  activityTitle: text("activity_title").notNull(),
  winner: text("winner").notNull(), // 'partner1', 'partner2', or 'tie'
  createdAt: timestamp("created_at").defaultNow(),
});

export const sparkitTriviaCategories = pgTable("sparkit_trivia_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(), // e.g., "General Knowledge", "Pop Culture", "Science"
  description: text("description"),
  icon: text("icon"), // Icon name from lucide-react
  createdAt: timestamp("created_at").defaultNow(),
});

export const sparkitTriviaQuestions = pgTable("sparkit_trivia_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => sparkitTriviaCategories.id),
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  wrongAnswer1: text("wrong_answer1").notNull(),
  wrongAnswer2: text("wrong_answer2").notNull(),
  wrongAnswer3: text("wrong_answer3").notNull(),
  difficulty: text("difficulty").notNull(), // 'easy', 'medium', 'hard'
  funFact: text("fun_fact"), // Optional fun fact shown after answering
  createdAt: timestamp("created_at").defaultNow(),
});

export const sparkitTriviaContests = pgTable("sparkit_trivia_contests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coupleId: varchar("couple_id").notNull().references(() => sparkitCouples.id),
  categoryId: text("category_id").notNull(), // Changed from varchar to text to match data
  categoryName: text("category_name").notNull(),
  senderName: text("sender_name").notNull(), // Name of partner who created the challenge
  receiverName: text("receiver_name"), // Name of partner who completed the challenge
  questionIds: jsonb("question_ids").$type<string[]>().notNull(), // Array of 5 question IDs
  score: integer("score"), // Score achieved (out of 5)
  status: text("status").default('pending'), // 'pending', 'completed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const sparkitTriviaAnswers = pgTable("sparkit_trivia_answers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contestId: varchar("contest_id").notNull().references(() => sparkitTriviaContests.id),
  coupleId: varchar("couple_id").notNull().references(() => sparkitCouples.id),
  partner: text("partner").notNull(), // 'partner1' or 'partner2'
  questionId: varchar("question_id").notNull().references(() => sparkitTriviaQuestions.id),
  selectedAnswer: text("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sparkitVideoSessions = pgTable("sparkit_video_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  coupleId: varchar("couple_id").notNull().references(() => sparkitCouples.id),
  roomName: text("room_name").notNull().unique(), // Daily.co room name
  roomUrl: text("room_url").notNull(), // Daily.co room URL
  status: text("status").default('active'), // 'active', 'ended'
  expiresAt: timestamp("expires_at").notNull(), // Room expiration time
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVerificationCodeSchema = createInsertSchema(verificationCodes).omit({
  id: true,
  createdAt: true,
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

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertBdsmTestResultsSchema = createInsertSchema(bdsmTestResults).omit({
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
export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertBdsmTestResults = z.infer<typeof insertBdsmTestResultsSchema>;
export type BdsmTestResults = typeof bdsmTestResults.$inferSelect;

// Spark It! Insert Schemas
export const insertSparkitCoupleSchema = createInsertSchema(sparkitCouples).omit({
  id: true,
  createdAt: true,
});

export const insertSparkitActivityRatingSchema = createInsertSchema(sparkitActivityRatings).omit({
  id: true,
  createdAt: true,
});

export const insertSparkitActivityResultSchema = createInsertSchema(sparkitActivityResults).omit({
  id: true,
  createdAt: true,
});

export const insertSparkitTriviaCategorySchema = createInsertSchema(sparkitTriviaCategories).omit({
  id: true,
  createdAt: true,
});

export const insertSparkitTriviaQuestionSchema = createInsertSchema(sparkitTriviaQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertSparkitTriviaContestSchema = createInsertSchema(sparkitTriviaContests).omit({
  id: true,
  createdAt: true,
});

export const insertSparkitTriviaAnswerSchema = createInsertSchema(sparkitTriviaAnswers).omit({
  id: true,
  createdAt: true,
});

export const insertSparkitVideoSessionSchema = createInsertSchema(sparkitVideoSessions).omit({
  id: true,
  createdAt: true,
});

// Update partner names schema (for PATCH /api/sparkit/couples/:id/names)
export const updateCoupleNamesSchema = z.object({
  partner1Name: z.string().min(1).max(50).optional(),
  partner2Name: z.string().min(1).max(50).optional(),
}).refine(
  (data) => data.partner1Name !== undefined || data.partner2Name !== undefined,
  { message: "At least one partner name must be provided" }
);

// Update avatar schema (for PATCH /api/sparkit/couples/:id/avatars)
export const updateAvatarSchema = z.object({
  partner: z.enum(["partner1", "partner2"]),
  avatarUrl: z.string().url(),
});

// Spark It! Types
export type InsertSparkitCouple = z.infer<typeof insertSparkitCoupleSchema>;
export type SparkitCouple = typeof sparkitCouples.$inferSelect;
export type InsertSparkitActivityRating = z.infer<typeof insertSparkitActivityRatingSchema>;
export type SparkitActivityRating = typeof sparkitActivityRatings.$inferSelect;
export type InsertSparkitActivityResult = z.infer<typeof insertSparkitActivityResultSchema>;
export type SparkitActivityResult = typeof sparkitActivityResults.$inferSelect;
export type InsertSparkitTriviaCategory = z.infer<typeof insertSparkitTriviaCategorySchema>;
export type SparkitTriviaCategory = typeof sparkitTriviaCategories.$inferSelect;
export type InsertSparkitTriviaQuestion = z.infer<typeof insertSparkitTriviaQuestionSchema>;
export type SparkitTriviaQuestion = typeof sparkitTriviaQuestions.$inferSelect;
export type InsertSparkitTriviaContest = z.infer<typeof insertSparkitTriviaContestSchema>;
export type SparkitTriviaContest = typeof sparkitTriviaContests.$inferSelect;
export type InsertSparkitTriviaAnswer = z.infer<typeof insertSparkitTriviaAnswerSchema>;
export type SparkitTriviaAnswer = typeof sparkitTriviaAnswers.$inferSelect;
export type InsertSparkitVideoSession = z.infer<typeof insertSparkitVideoSessionSchema>;
export type SparkitVideoSession = typeof sparkitVideoSessions.$inferSelect;
