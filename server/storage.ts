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
  users, 
  matches,
  personalityAnswers,
  relationshipAnswers,
  messages
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
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
      .set(updates)
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
}

export const storage = new DatabaseStorage();
