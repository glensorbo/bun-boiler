import { userRepository } from '../repositories/userRepository';
import { generatePassphrase } from '../utils/auth/passphrase';
import { signAuthToken } from '../utils/auth/signAuthToken';
import { signSignupToken } from '../utils/auth/signSignupToken';

import type { userRepository as UserRepositoryType } from '../repositories/userRepository';

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`A user with email "${email}" already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`No user found with ID: ${id}`);
    this.name = 'UserNotFoundError';
  }
}

/**
 * Auth Service Factory
 * Accepts repository as dependency for testability
 */
export const createAuthService = (repo: typeof UserRepositoryType) => ({
  /**
   * Create a new user and return a signup link containing a short-lived JWT.
   * The caller (an authenticated user) provides email + name.
   * A passphrase is auto-generated and hashed as the initial password.
   *
   * @param email - New user's email address
   * @param name - New user's display name
   * @returns Object containing the signup link
   */
  async createUser(
    email: string,
    name: string,
  ): Promise<{ signupLink: string }> {
    const existing = await repo.getByEmail(email);
    if (existing) throw new UserAlreadyExistsError(email);

    const passphrase = generatePassphrase();
    const hashedPassword = await Bun.password.hash(passphrase);

    const user = await repo.create(email, name, hashedPassword);
    const token = await signSignupToken(user.id!, email);
    const appUrl = Bun.env.APP_URL ?? 'http://localhost:3000';

    return { signupLink: `${appUrl}/set-password?token=${token}` };
  },

  /**
   * Set a new password for a user (used during onboarding via signup link).
   * Hashes the password and issues a full-length auth JWT on success.
   *
   * @param userId - ID of the user setting their password
   * @param password - Plain-text password chosen by the user
   * @returns Object containing the signed auth token
   */
  async setPassword(
    userId: string,
    password: string,
  ): Promise<{ token: string }> {
    const user = await repo.getById(userId);
    if (!user) throw new UserNotFoundError(userId);

    const hashedPassword = await Bun.password.hash(password);
    await repo.updatePassword(userId, hashedPassword);

    const token = await signAuthToken(userId, user.email);
    return { token };
  },
});

export const authService = createAuthService(userRepository);
