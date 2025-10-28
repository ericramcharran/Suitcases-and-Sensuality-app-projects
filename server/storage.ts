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
  sparkitTriviaContests,
  sparkitTriviaAnswers,
  sparkitVideoSessions
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
    const couple = await this.getCoupleById(id);
    if (!couple) return undefined;

    // STEP 1: Check trial limits FIRST (before any resets or consumption)
    if (couple.subscriptionPlan === 'trial') {
      const totalUsed = couple.totalSparksUsed || 0;
      const daysOnTrial = couple.partner2JoinedAt 
        ? Math.floor((Date.now() - new Date(couple.partner2JoinedAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Check if trial has expired (10 sparks OR 7 days)
      if (totalUsed >= 10 || daysOnTrial >= 7) {
        // Trial expired - set sparks to 0 and return
        const result = await db
          .update(sparkitCouples)
          .set({ sparksRemaining: 0 })
          .where(eq(sparkitCouples.id, id))
          .returning();
        return result[0];
      }
    }

    // STEP 2: Handle premium plans (unlimited sparks)
    if (couple.subscriptionPlan === 'premium_monthly' || couple.subscriptionPlan === 'premium_yearly') {
      // Premium users always have sparks available - set to 999 as sentinel for "unlimited"
      const result = await db
        .update(sparkitCouples)
        .set({ 
          totalSparksUsed: (couple.totalSparksUsed || 0) + 1,
          sparksRemaining: 999 // Sentinel value for unlimited
        })
        .where(eq(sparkitCouples.id, id))
        .returning();
      return result[0];
    }

    // STEP 3: For trial plan, consume a spark if available (NO daily reset for trial)
    if (couple.subscriptionPlan === 'trial') {
      if ((couple.sparksRemaining ?? 0) > 0) {
        const result = await db
          .update(sparkitCouples)
          .set({ 
            sparksRemaining: (couple.sparksRemaining ?? 0) - 1,
            totalSparksUsed: (couple.totalSparksUsed || 0) + 1
          })
          .where(eq(sparkitCouples.id, id))
          .returning();
        return result[0];
      }
      // No sparks remaining
      return couple;
    }

    // STEP 4: Check if we need to reset daily sparks (for free plans only)
    const today = new Date().toDateString();
    const lastReset = couple.lastSparkReset ? new Date(couple.lastSparkReset).toDateString() : null;
    
    let currentSparksRemaining = couple.sparksRemaining ?? 0;
    if (lastReset !== today) {
      // Reset daily sparks AND consume one spark atomically
      const result = await db
        .update(sparkitCouples)
        .set({ 
          sparksRemaining: 2, // 3 - 1 (reset to 3, then immediately use 1)
          lastSparkReset: new Date(),
          totalSparksUsed: (couple.totalSparksUsed || 0) + 1
        })
        .where(eq(sparkitCouples.id, id))
        .returning();
      return result[0];
    }

    // STEP 5: For free plans, use a spark if available
    if (currentSparksRemaining > 0) {
      const result = await db
        .update(sparkitCouples)
        .set({ 
          sparksRemaining: currentSparksRemaining - 1,
          totalSparksUsed: (couple.totalSparksUsed || 0) + 1
        })
        .where(eq(sparkitCouples.id, id))
        .returning();
      return result[0];
    }

    return couple;
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
    const results = await db.select()
      .from(sparkitActivityResults)
      .where(eq(sparkitActivityResults.coupleId, coupleId));

    const partner1Wins = results.filter(r => r.winner === 'partner1').length;
    const partner2Wins = results.filter(r => r.winner === 'partner2').length;
    const ties = results.filter(r => r.winner === 'tie').length;

    return {
      partner1Wins,
      partner2Wins,
      ties,
      totalActivities: results.length
    };
  }

  // Spark It! Trivia operations
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
}

export const storage = new DatabaseStorage();
