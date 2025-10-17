import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      createdAt: now,
      verified: insertUser.verified ?? false,
      escrowBalance: insertUser.escrowBalance ?? 0,
      agreedTerms: insertUser.agreedTerms ?? false,
      agreedConsent: insertUser.agreedConsent ?? false,
      agreedPrivacy: insertUser.agreedPrivacy ?? false,
      agreedGuidelines: insertUser.agreedGuidelines ?? false,
      personalityType: insertUser.personalityType ?? null,
      relationshipStyle: insertUser.relationshipStyle ?? null,
      plan: insertUser.plan ?? null,
      personalityAnswers: insertUser.personalityAnswers ?? null,
      relationshipAnswers: insertUser.relationshipAnswers ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...updates,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

export const storage = new MemStorage();
