import { userService } from '../services/userService';
import { successResponse, notFoundError } from '../utils/errorHelpers';

import type { userService as UserServiceType } from '../services/userService';

/**
 * User Controller Factory
 * Accepts service as dependency for testability
 */
export const createUserController = (service: typeof UserServiceType) => ({
  /**
   * Handle GET /api/user - Get all users
   * @returns Response with array of safe users (no passwords)
   */
  async getUsers(): Promise<Response> {
    const users = await service.getAllUsers();
    return successResponse(users);
  },

  /**
   * Handle GET /api/user/:id - Get user by ID
   * @param id - User ID from route params
   * @returns Response with safe user data or 404 if not found
   */
  async getUserById(id: string): Promise<Response> {
    const user = await service.getUserById(id);

    if (!user) {
      return notFoundError('User not found', `No user found with ID: ${id}`);
    }

    return successResponse(user);
  },
});

/**
 * User Controller
 * HTTP request controllers for user routes
 * Thin layer that calls services and returns responses
 */
export const userController = createUserController(userService);
