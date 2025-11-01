import { 
  type User, 
  type InsertUser, 
  type Match,
  type InsertMatch,
  type PersonalityAnswers,
  type InsertPersonalityAnswers,
  type RelationshipAnswers,
  type InsertRelationshipAnswers,
  type Message,
  type InsertMessage,
  type PushSubscription,
  type InsertPushSubscription,
  type BdsmTestResults,
  type InsertBdsmTestResults,
  type SparkitCouple,
  type InsertSparkitCouple,
  type SparkitActivityRating,
  type InsertSparkitActivityRating,
  type SparkitActivityResult,
  type InsertSparkitActivityResult,
  type SparkitTriviaContest,
  type InsertSparkitTriviaContest,
  type SparkitTriviaAnswer,
  type InsertSparkitTriviaAnswer,
  type SparkitVideoSession,
  type InsertSparkitVideoSession,
  type SparkitActivityLog,
  type InsertSparkitActivityLog,
  users, 
  matches,
  personalityAnswers,
  relationshipAnswers,
  messages,
  pushSubscriptions,
  bdsmTestResults,
  verificationCodes,
  sparkitCouples,
  sparkitActivityRatings,
  sparkitActivityResults,
  sparkitTriviaCategories,
  sparkitTriviaQuestions,
  sparkitTriviaContests,
  sparkitTriviaAnswers,
  sparkitVideoSessions,
  sparkitActivityLogs
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getMatch(matchId: string): Promise<Match | undefined>;
  getMatches(userId: string): Promise<Match[]>;
  getMutualMatches(userId: string): Promise<Match[]>;
  checkMutualMatch(userId: string, targetUserId: string): Promise<Match | undefined>;
  
  // Personality answers operations
  createPersonalityAnswers(answers: InsertPersonalityAnswers): Promise<PersonalityAnswers>;
  getPersonalityAnswers(userId: string): Promise<PersonalityAnswers | undefined>;
  
  // Relationship answers operations
  createRelationshipAnswers(answers: InsertRelationshipAnswers): Promise<RelationshipAnswers>;
  getRelationshipAnswers(userId: string): Promise<RelationshipAnswers | undefined>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(matchId: string): Promise<Message[]>;
  getConversations(userId: string): Promise<Message[]>;
  markMessageAsRead(id: string): Promise<void>;
  
  // Push subscription operations
  createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  getPushSubscriptions(userId: string): Promise<PushSubscription[]>;
  deletePushSubscription(endpoint: string): Promise<void>;
  
  // BDSM test results operations
  createBdsmTestResults(results: InsertBdsmTestResults): Promise<BdsmTestResults>;
  getBdsmTestResults(userId: string): Promise<BdsmTestResults | undefined>;
  updateBdsmTestResults(userId: string, updates: Partial<InsertBdsmTestResults>): Promise<BdsmTestResults | undefined>;
  
  // Verification code operations
  createVerificationCode(emailOrPhone: string, code: string, type: 'email' | 'phone'): Promise<void>;
  verifyCode(emailOrPhone: string, code: string, type: 'email' | 'phone'): Promise<boolean>;
  
  // Spark It! Couple operations
  createCouple(couple: InsertSparkitCouple): Promise<SparkitCouple>;
  getCoupleByCode(coupleCode: string): Promise<SparkitCouple | undefined>;
  getCoupleById(id: string): Promise<SparkitCouple | undefined>;
  getCoupleByPartnerEmail(email: string): Promise<SparkitCouple | undefined>;
  updateCouple(id: string, updates: Partial<InsertSparkitCouple>): Promise<SparkitCouple | undefined>;
  updateCouplePressTimestamp(id: string, field: 'partner1LastPressed' | 'partner2LastPressed'): Promise<void>;
  useSpark(id: string): Promise<SparkitCouple | undefined>;
  resetDailySparks(id: string): Promise<SparkitCouple | undefined>;
  
  // Spark It! Activity Rating operations
  createActivityRating(rating: InsertSparkitActivityRating): Promise<SparkitActivityRating>;
  getActivityRatingsByCoupleId(coupleId: string): Promise<SparkitActivityRating[]>;
  
  // Spark It! Activity Result operations
  createActivityResult(result: InsertSparkitActivityResult): Promise<SparkitActivityResult>;
  getActivityResultsByCoupleId(coupleId: string, limit?: number): Promise<SparkitActivityResult[]>;
  getScoreboardStats(coupleId: string): Promise<{
    partner1Wins: number;
    partner2Wins: number;
    ties: number;
    totalActivities: number;
  }>;
  
  // Spark It! Trivia operations
  getTriviaQuestionsByCategoryId(categoryId: string): Promise<SparkitTriviaQuestion[]>;
  getTriviaQuestionsByCategoryName(categoryName: string): Promise<SparkitTriviaQuestion[]>;
  createTriviaContest(contest: InsertSparkitTriviaContest): Promise<SparkitTriviaContest>;
  getTriviaContestById(id: string): Promise<SparkitTriviaContest | undefined>;
  getTriviaContestsByCoupleId(coupleId: string): Promise<SparkitTriviaContest[]>;
  createTriviaAnswer(answer: InsertSparkitTriviaAnswer): Promise<SparkitTriviaAnswer>;
  getTriviaAnswersByContestId(contestId: string): Promise<SparkitTriviaAnswer[]>;
  updateTriviaContest(id: string, updates: Partial<InsertSparkitTriviaContest>): Promise<SparkitTriviaContest | undefined>;
  
  // Spark It! Video Session operations
  createVideoSession(session: InsertSparkitVideoSession): Promise<SparkitVideoSession>;
  getVideoSessionById(id: string): Promise<SparkitVideoSession | undefined>;
  getActiveVideoSessionByCoupleId(coupleId: string): Promise<SparkitVideoSession | undefined>;
  updateVideoSession(id: string, updates: Partial<InsertSparkitVideoSession>): Promise<SparkitVideoSession | undefined>;
  
  // Spark It! Activity Logging for Demo Users
  logDemoActivity(log: InsertSparkitActivityLog): Promise<SparkitActivityLog | null>;
  getDemoActivityLogs(filters: {
    window?: '24h' | '7d' | '30d';
    severity?: string;
    eventType?: string;
    coupleCode?: string;
    limit?: number;
    offset?: number;
  }): Promise<SparkitActivityLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(updates as any)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Get Spark It couple by Stripe customer ID
  async getCoupleByStripeCustomerId(stripeCustomerId: string): Promise<SparkitCouple | undefined> {
    const result = await db.select()
      .from(sparkitCouples)
      .where(eq(sparkitCouples.stripeCustomerId, stripeCustomerId));
    return result[0];
  }

  // Get all Spark It couples (use with caution - for admin only, add pagination in production)
  async getAllCouples(): Promise<SparkitCouple[]> {
    return await db.select().from(sparkitCouples);
  }

  // Match operations
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    // Check if there's a reciprocal like
    const reciprocalMatch = await this.checkMutualMatch(insertMatch.userId, insertMatch.targetUserId);
    
    // If both users liked each other, set mutualMatch to true
    const mutualMatch = insertMatch.action === 'like' && reciprocalMatch !== undefined;
    
    // Create the new match
    const result = await db.insert(matches).values({
      ...insertMatch,
      mutualMatch
    }).returning();
    
    // If it's a mutual match, update the reciprocal match as well
    if (mutualMatch && reciprocalMatch) {
      await db.update(matches)
        .set({ mutualMatch: true })
        .where(eq(matches.id, reciprocalMatch.id));
    }
    
    return result[0];
  }

  async getMatch(matchId: string): Promise<Match | undefined> {
    const result = await db.select().from(matches).where(eq(matches.id, matchId));
    return result[0];
  }

  async getMatches(userId: string): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.userId, userId));
  }

  async getMutualMatches(userId: string): Promise<Match[]> {
    return await db.select().from(matches).where(
      and(eq(matches.userId, userId), eq(matches.mutualMatch, true))
    );
  }

  async checkMutualMatch(userId: string, targetUserId: string): Promise<Match | undefined> {
    const result = await db.select().from(matches).where(
      and(
        eq(matches.userId, targetUserId),
        eq(matches.targetUserId, userId),
        eq(matches.action, 'like')
      )
    );
    return result[0];
  }

  // Personality answers operations
  async createPersonalityAnswers(insertAnswers: InsertPersonalityAnswers): Promise<PersonalityAnswers> {
    const result = await db.insert(personalityAnswers).values(insertAnswers).returning();
    return result[0];
  }

  async getPersonalityAnswers(userId: string): Promise<PersonalityAnswers | undefined> {
    const result = await db.select().from(personalityAnswers).where(eq(personalityAnswers.userId, userId));
    return result[0];
  }

  // Relationship answers operations
  async createRelationshipAnswers(insertAnswers: InsertRelationshipAnswers): Promise<RelationshipAnswers> {
    const result = await db.insert(relationshipAnswers).values(insertAnswers).returning();
    return result[0];
  }

  async getRelationshipAnswers(userId: string): Promise<RelationshipAnswers | undefined> {
    const result = await db.select().from(relationshipAnswers).where(eq(relationshipAnswers.userId, userId));
    return result[0];
  }

  // Message operations
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(insertMessage).returning();
    return result[0];
  }

  async getMessages(matchId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.matchId, matchId));
  }

  async getConversations(userId: string): Promise<Message[]> {
    const { or } = await import("drizzle-orm");
    return await db.select().from(messages).where(
      or(
        eq(messages.senderId, userId),
        eq(messages.receiverId, userId)
      )
    );
  }

  async markMessageAsRead(id: string): Promise<void> {
    await db.update(messages).set({ read: true }).where(eq(messages.id, id));
  }

  // Push subscription operations
  async createPushSubscription(insertSubscription: InsertPushSubscription): Promise<PushSubscription> {
    const result = await db.insert(pushSubscriptions).values(insertSubscription).returning();
    return result[0];
  }

  async getPushSubscriptions(userId: string): Promise<PushSubscription[]> {
    return await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
  }

  async deletePushSubscription(endpoint: string): Promise<void> {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
  }

  // BDSM test results operations
  async createBdsmTestResults(insertResults: InsertBdsmTestResults): Promise<BdsmTestResults> {
    const result = await db.insert(bdsmTestResults).values(insertResults).returning();
    return result[0];
  }

  async getBdsmTestResults(userId: string): Promise<BdsmTestResults | undefined> {
    const result = await db.select().from(bdsmTestResults).where(eq(bdsmTestResults.userId, userId));
    return result[0];
  }

  async updateBdsmTestResults(userId: string, updates: Partial<InsertBdsmTestResults>): Promise<BdsmTestResults | undefined> {
    const result = await db
      .update(bdsmTestResults)
      .set(updates as any)
      .where(eq(bdsmTestResults.userId, userId))
      .returning();
    return result[0];
  }

  // Verification code operations
  async createVerificationCode(emailOrPhone: string, code: string, type: 'email' | 'phone'): Promise<void> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await db.insert(verificationCodes).values({
      emailOrPhone,
      code,
      type,
      expiresAt,
      verified: false
    });
  }

  async verifyCode(emailOrPhone: string, code: string, type: 'email' | 'phone'): Promise<boolean> {
    const { gt } = await import("drizzle-orm");
    const result = await db.select().from(verificationCodes).where(
      and(
        eq(verificationCodes.emailOrPhone, emailOrPhone),
        eq(verificationCodes.code, code),
        eq(verificationCodes.type, type),
        eq(verificationCodes.verified, false),
        gt(verificationCodes.expiresAt, new Date()) // Code hasn't expired
      )
    );

    if (result.length > 0) {
      // Mark code as verified
      await db.update(verificationCodes)
        .set({ verified: true })
        .where(eq(verificationCodes.id, result[0].id));
      return true;
    }

    return false;
  }

  // Spark It! Couple operations
  async createCouple(insertCouple: InsertSparkitCouple): Promise<SparkitCouple> {
    const result = await db.insert(sparkitCouples).values(insertCouple).returning();
    return result[0];
  }

  async getCoupleByCode(coupleCode: string): Promise<SparkitCouple | undefined> {
    const result = await db.select().from(sparkitCouples).where(eq(sparkitCouples.coupleCode, coupleCode));
    return result[0];
  }

  async getCoupleById(id: string): Promise<SparkitCouple | undefined> {
    const result = await db.select().from(sparkitCouples).where(eq(sparkitCouples.id, id));
    return result[0];
  }

  async getCoupleByPartnerEmail(email: string): Promise<SparkitCouple | undefined> {
    const result = await db.select().from(sparkitCouples).where(
      or(
        eq(sparkitCouples.partner1Email, email),
        eq(sparkitCouples.partner2Email, email)
      )
    );
    return result[0];
  }

  async updateCouple(id: string, updates: Partial<InsertSparkitCouple>): Promise<SparkitCouple | undefined> {
    const result = await db
      .update(sparkitCouples)
      .set(updates as any)
      .where(eq(sparkitCouples.id, id))
      .returning();
    return result[0];
  }

  async updateCouplePressTimestamp(id: string, field: 'partner1LastPressed' | 'partner2LastPressed'): Promise<void> {
    const updateData = field === 'partner1LastPressed' 
      ? { partner1LastPressed: new Date() }
      : { partner2LastPressed: new Date() };
    
    await db
      .update(sparkitCouples)
      .set(updateData as any)
      .where(eq(sparkitCouples.id, id));
  }

  async useSpark(id: string): Promise<SparkitCouple | undefined> {
    const { gt, sql } = await import("drizzle-orm");
    
    // Fetch couple data first
    const couple = await this.getCoupleById(id);
    if (!couple) return undefined;

    // STEP 1: Check trial limits FIRST (before any resets or consumption)
    if (couple.subscriptionPlan === 'trial') {
      const totalUsed = couple.totalSparksUsed || 0;
      const daysOnTrial = couple.partner2JoinedAt 
        ? Math.floor((Date.now() - new Date(couple.partner2JoinedAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Check if trial has expired (10 sparks OR 7 days)
      if (totalUsed >= 20 || daysOnTrial >= 7) {
        // Trial expired - set sparks to 0 and return
        const result = await db
          .update(sparkitCouples)
          .set({ sparksRemaining: 0 })
          .where(eq(sparkitCouples.id, id))
          .returning();
        return result[0];
      }
    }

    // STEP 2: Handle premium plans (unlimited sparks) - ATOMIC UPDATE
    if (couple.subscriptionPlan === 'monthly' || couple.subscriptionPlan === 'yearly') {
      // Premium users always have sparks available
      const result = await db
        .update(sparkitCouples)
        .set({ 
          totalSparksUsed: sql`COALESCE(${sparkitCouples.totalSparksUsed}, 0) + 1`,
          sparksRemaining: 999 // Keep at 999 for premium
        })
        .where(eq(sparkitCouples.id, id))
        .returning();
      return result[0];
    }

    // STEP 3: For trial plan, consume a spark if available - ATOMIC UPDATE
    if (couple.subscriptionPlan === 'trial') {
      // Use atomic UPDATE with WHERE clause to prevent race conditions
      const result = await db
        .update(sparkitCouples)
        .set({ 
          sparksRemaining: sql`${sparkitCouples.sparksRemaining} - 1`,
          totalSparksUsed: sql`COALESCE(${sparkitCouples.totalSparksUsed}, 0) + 1`
        })
        .where(
          and(
            eq(sparkitCouples.id, id),
            gt(sparkitCouples.sparksRemaining, 0) // Only update if sparks > 0
          )
        )
        .returning();
      
      // If no rows updated, fetch current state to return
      if (result.length === 0) {
        return await this.getCoupleById(id);
      }
      return result[0];
    }

    // STEP 4: Check if we need to reset daily sparks (for free plans only)
    const today = new Date().toDateString();
    const lastReset = couple.lastSparkReset ? new Date(couple.lastSparkReset).toDateString() : null;
    
    if (lastReset !== today) {
      // Reset daily sparks AND consume one spark atomically
      const result = await db
        .update(sparkitCouples)
        .set({ 
          sparksRemaining: 2, // 3 - 1 (reset to 3, then immediately use 1)
          lastSparkReset: new Date(),
          totalSparksUsed: sql`COALESCE(${sparkitCouples.totalSparksUsed}, 0) + 1`
        })
        .where(eq(sparkitCouples.id, id))
        .returning();
      return result[0];
    }

    // STEP 5: For free plans, use a spark if available - ATOMIC UPDATE
    const result = await db
      .update(sparkitCouples)
      .set({ 
        sparksRemaining: sql`${sparkitCouples.sparksRemaining} - 1`,
        totalSparksUsed: sql`COALESCE(${sparkitCouples.totalSparksUsed}, 0) + 1`
      })
      .where(
        and(
          eq(sparkitCouples.id, id),
          gt(sparkitCouples.sparksRemaining, 0) // Only update if sparks > 0
        )
      )
      .returning();
    
    // If no rows updated, fetch current state to return
    if (result.length === 0) {
      return await this.getCoupleById(id);
    }
    return result[0];
  }

  async resetDailySparks(id: string): Promise<SparkitCouple | undefined> {
    const result = await db
      .update(sparkitCouples)
      .set({ 
        sparksRemaining: 3,
        lastSparkReset: new Date()
      })
      .where(eq(sparkitCouples.id, id))
      .returning();
    return result[0];
  }

  // Spark It! Activity Rating operations
  async createActivityRating(insertRating: InsertSparkitActivityRating): Promise<SparkitActivityRating> {
    const result = await db.insert(sparkitActivityRatings).values(insertRating).returning();
    return result[0];
  }

  async getActivityRatingsByCoupleId(coupleId: string): Promise<SparkitActivityRating[]> {
    return await db.select()
      .from(sparkitActivityRatings)
      .where(eq(sparkitActivityRatings.coupleId, coupleId))
      .orderBy(desc(sparkitActivityRatings.createdAt));
  }

  // Spark It! Activity Result operations
  async createActivityResult(insertResult: InsertSparkitActivityResult): Promise<SparkitActivityResult> {
    const result = await db.insert(sparkitActivityResults).values(insertResult).returning();
    return result[0];
  }

  async getActivityResultsByCoupleId(coupleId: string, limit: number = 10): Promise<SparkitActivityResult[]> {
    return await db.select()
      .from(sparkitActivityResults)
      .where(eq(sparkitActivityResults.coupleId, coupleId))
      .orderBy(desc(sparkitActivityResults.createdAt))
      .limit(limit);
  }

  async getScoreboardStats(coupleId: string): Promise<{
    partner1Wins: number;
    partner2Wins: number;
    ties: number;
    totalActivities: number;
  }> {
    const { sql } = await import("drizzle-orm");
    
    // Use SQL aggregation for better performance - single query instead of fetch + filter
    const result = await db.select({
      partner1Wins: sql<number>`COUNT(CASE WHEN ${sparkitActivityResults.winner} = 'partner1' THEN 1 END)`,
      partner2Wins: sql<number>`COUNT(CASE WHEN ${sparkitActivityResults.winner} = 'partner2' THEN 1 END)`,
      ties: sql<number>`COUNT(CASE WHEN ${sparkitActivityResults.winner} = 'tie' THEN 1 END)`,
      totalActivities: sql<number>`COUNT(*)`
    })
    .from(sparkitActivityResults)
    .where(eq(sparkitActivityResults.coupleId, coupleId));

    return {
      partner1Wins: Number(result[0].partner1Wins) || 0,
      partner2Wins: Number(result[0].partner2Wins) || 0,
      ties: Number(result[0].ties) || 0,
      totalActivities: Number(result[0].totalActivities) || 0
    };
  }

  // Spark It! Trivia operations
  async getTriviaQuestionsByCategoryId(categoryId: string): Promise<SparkitTriviaQuestion[]> {
    const result = await db.select()
      .from(sparkitTriviaQuestions)
      .where(eq(sparkitTriviaQuestions.categoryId, categoryId));
    return result;
  }

  async getTriviaQuestionsByCategoryName(categoryName: string): Promise<SparkitTriviaQuestion[]> {
    // First get the category ID by name
    const category = await db.select()
      .from(sparkitTriviaCategories)
      .where(eq(sparkitTriviaCategories.name, categoryName))
      .limit(1);
    
    if (category.length === 0) {
      return [];
    }
    
    // Then get all questions for this category ID
    const result = await db.select()
      .from(sparkitTriviaQuestions)
      .where(eq(sparkitTriviaQuestions.categoryId, category[0].id));
    return result;
  }

  async createTriviaContest(insertContest: InsertSparkitTriviaContest): Promise<SparkitTriviaContest> {
    const result = await db.insert(sparkitTriviaContests).values(insertContest).returning();
    return result[0];
  }

  async getTriviaContestById(id: string): Promise<SparkitTriviaContest | undefined> {
    const result = await db.select()
      .from(sparkitTriviaContests)
      .where(eq(sparkitTriviaContests.id, id));
    return result[0];
  }

  async getTriviaContestsByCoupleId(coupleId: string): Promise<SparkitTriviaContest[]> {
    return await db.select()
      .from(sparkitTriviaContests)
      .where(eq(sparkitTriviaContests.coupleId, coupleId))
      .orderBy(desc(sparkitTriviaContests.createdAt));
  }

  async createTriviaAnswer(insertAnswer: InsertSparkitTriviaAnswer): Promise<SparkitTriviaAnswer> {
    const result = await db.insert(sparkitTriviaAnswers).values(insertAnswer).returning();
    return result[0];
  }

  async getTriviaAnswersByContestId(contestId: string): Promise<SparkitTriviaAnswer[]> {
    return await db.select()
      .from(sparkitTriviaAnswers)
      .where(eq(sparkitTriviaAnswers.contestId, contestId))
      .orderBy(sparkitTriviaAnswers.questionId);
  }

  async updateTriviaContest(id: string, updates: Partial<InsertSparkitTriviaContest>): Promise<SparkitTriviaContest | undefined> {
    const result = await db
      .update(sparkitTriviaContests)
      .set(updates as any)
      .where(eq(sparkitTriviaContests.id, id))
      .returning();
    return result[0];
  }

  // Spark It! Video Session operations
  async createVideoSession(insertSession: InsertSparkitVideoSession): Promise<SparkitVideoSession> {
    const result = await db.insert(sparkitVideoSessions).values(insertSession).returning();
    return result[0];
  }

  async getVideoSessionById(id: string): Promise<SparkitVideoSession | undefined> {
    const result = await db.select()
      .from(sparkitVideoSessions)
      .where(eq(sparkitVideoSessions.id, id));
    return result[0];
  }

  async getActiveVideoSessionByCoupleId(coupleId: string): Promise<SparkitVideoSession | undefined> {
    const result = await db.select()
      .from(sparkitVideoSessions)
      .where(and(
        eq(sparkitVideoSessions.coupleId, coupleId),
        eq(sparkitVideoSessions.status, 'active')
      ))
      .orderBy(desc(sparkitVideoSessions.createdAt));
    return result[0];
  }

  async updateVideoSession(id: string, updates: Partial<InsertSparkitVideoSession>): Promise<SparkitVideoSession | undefined> {
    const result = await db
      .update(sparkitVideoSessions)
      .set(updates as any)
      .where(eq(sparkitVideoSessions.id, id))
      .returning();
    return result[0];
  }

  // Spark It! Activity Logging for Demo Users
  async logDemoActivity(log: InsertSparkitActivityLog): Promise<SparkitActivityLog | null> {
    const demoCodes = ['DEVST1', 'PREMM1', 'PREM02', 'PREM03', 'DREW01', 'DEMO01', 'DEMO02', 'DEMO03', 'DEMO04'];
    
    // Normalize email to lowercase for consistent demo detection
    const normalizedEmail = log.actorEmail?.toLowerCase();
    
    // Check if this is a demo user (email ends with @demo.com OR couple code is in demo list)
    const isDemoUser = (normalizedEmail && normalizedEmail.endsWith('@demo.com')) || 
                      (log.coupleCode && demoCodes.includes(log.coupleCode));
    
    if (!isDemoUser) {
      return null; // Not a demo user, don't log
    }

    // Insert the activity log
    const result = await db.insert(sparkitActivityLogs).values(log).returning();
    
    // If high or critical error, also log to console for immediate visibility
    if (log.errorSeverity && ['high', 'critical'].includes(log.errorSeverity)) {
      console.error(`🚨 DEMO USER ERROR [${log.errorSeverity.toUpperCase()}]:`, {
        couple: log.coupleCode,
        email: log.actorEmail,
        event: log.eventName,
        error: log.errorMessage,
        payload: log.eventPayload
      });
    }
    
    return result[0];
  }

  async getDemoActivityLogs(filters: {
    window?: '24h' | '7d' | '30d';
    severity?: string;
    eventType?: string;
    coupleCode?: string;
    limit?: number;
    offset?: number;
  }): Promise<SparkitActivityLog[]> {
    const { gt, lte, sql, inArray } = await import("drizzle-orm");
    const demoCodes = ['DEVST1', 'PREMM1', 'PREM02', 'PREM03', 'DREW01', 'DEMO01', 'DEMO02', 'DEMO03', 'DEMO04'];
    
    // Build time window filter
    const now = new Date();
    let timeFilter;
    
    if (filters.window === '24h') {
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      timeFilter = gt(sparkitActivityLogs.createdAt, dayAgo);
    } else if (filters.window === '7d') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeFilter = gt(sparkitActivityLogs.createdAt, weekAgo);
    } else if (filters.window === '30d') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeFilter = gt(sparkitActivityLogs.createdAt, monthAgo);
    }

    // Build conditions array
    const conditions: any[] = [];
    
    // Filter to only demo couple codes
    if (filters.coupleCode) {
      conditions.push(eq(sparkitActivityLogs.coupleCode, filters.coupleCode));
    } else {
      // If no specific couple code, show all demo couples
      conditions.push(inArray(sparkitActivityLogs.coupleCode, demoCodes));
    }
    
    if (timeFilter) {
      conditions.push(timeFilter);
    }
    
    if (filters.severity) {
      conditions.push(eq(sparkitActivityLogs.errorSeverity, filters.severity));
    }
    
    if (filters.eventType) {
      conditions.push(eq(sparkitActivityLogs.eventType, filters.eventType));
    }

    // Build query
    let query = db.select()
      .from(sparkitActivityLogs)
      .orderBy(desc(sparkitActivityLogs.createdAt));

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit) as any;
    }
    
    if (filters.offset) {
      query = query.offset(filters.offset) as any;
    }

    return await query;
  }
}

export const storage = new DatabaseStorage();
