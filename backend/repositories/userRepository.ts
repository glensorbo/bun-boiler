import { eq } from 'drizzle-orm';

import { getDb } from '../db/client';
import { users } from '../db/schemas/users';

import type { User } from '../types/user';

/**
 * User Repository
 * Handles all database operations for users
 * Pure data access layer - no business logic
 */
export const userRepository = {
  /**
   * Get all users from the database
   * @returns Promise<User[]> - Array of all users including password field
   */
  async getAll(): Promise<User[]> {
    const db = getDb();
    return await db.select().from(users);
  },

  /**
   * Get a single user by ID
   * @param id - User ID (UUID)
   * @returns Promise<User | undefined> - User if found, undefined otherwise
   */
  async getById(id: string): Promise<User | undefined> {
    const db = getDb();
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  },

  /**
   * Get a user by email
   * @param email - User email address
   * @returns Promise<User | undefined> - User if found, undefined otherwise
   */
  async getByEmail(email: string): Promise<User | undefined> {
    const db = getDb();
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  },
};
