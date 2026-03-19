import { userRepository } from '../repositories/userRepository';

import type { userRepository as UserRepositoryType } from '../repositories/userRepository';
import type { SafeUser } from '../types/user';

/**
 * User Service Factory
 * Accepts repository as dependency for testability
 */
export const createUserService = (repo: typeof UserRepositoryType) => ({
  /**
   * Get all users with safe data (password omitted)
   * @returns Promise<SafeUser[]> - Array of users without password field
   */
  async getAllUsers(): Promise<SafeUser[]> {
    const users = await repo.getAll();

    // Transform User[] to SafeUser[] by omitting password
    return users.map(({ password: _password, ...safeUser }) => safeUser);
  },

  /**
   * Get a single user by ID with safe data (password omitted)
   * @param id - User ID (UUID)
   * @returns Promise<SafeUser | undefined> - Safe user if found, undefined otherwise
   */
  async getUserById(id: string): Promise<SafeUser | undefined> {
    const user = await repo.getById(id);

    if (!user) {
      return undefined;
    }

    // Omit password from response
    const { password: _password, ...safeUser } = user;
    return safeUser;
  },
});

/**
 * User Service
 * Handles business logic for user operations
 * Transforms data between repository and handler layers
 */
export const userService = createUserService(userRepository);
