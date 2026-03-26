import { userRepository } from '../repositories/userRepository';
import { success, failure } from '../types/errorOr';
import { generatePassphrase } from '../utils/auth/passphrase';
import { signAuthToken } from '../utils/auth/signAuthToken';
import { signSignupToken } from '../utils/auth/signSignupToken';

import type { userRepository as UserRepositoryType } from '../repositories/userRepository';
import type { ErrorOr } from '../types/errorOr';

/**
 * Auth Service Factory
 * Accepts repository as dependency for testability
 */
export const createAuthService = (repo: typeof UserRepositoryType) => ({
  /**
   * Create a new user and return a signup link containing a short-lived JWT.
   * The caller (an authenticated user) provides email + name.
   * A passphrase is auto-generated and hashed as the initial password.
   */
  async createUser(
    email: string,
    name: string,
  ): Promise<ErrorOr<{ signupLink: string }>> {
    const existing = await repo.getByEmail(email);

    if (existing) {
      return failure([
        {
          type: 'conflict',
          message: 'A user with this email already exists',
          field: 'email',
        },
      ]);
    }

    const passphrase = generatePassphrase();
    const hashedPassword = await Bun.password.hash(passphrase);
    const user = await repo.create(email, name, hashedPassword);
    const token = await signSignupToken(user.id!, email);
    const appUrl = Bun.env.APP_URL ?? 'http://localhost:3000';

    return success({ signupLink: `${appUrl}/set-password?token=${token}` });
  },

  /**
   * Set a new password for a user (used during onboarding via signup link).
   * Hashes the password and issues a full-length auth JWT on success.
   */
  async setPassword(
    userId: string,
    password: string,
  ): Promise<ErrorOr<{ token: string }>> {
    const user = await repo.getById(userId);
    if (!user) {
      return failure([
        { type: 'not_found', message: 'No user found with this ID' },
      ]);
    }

    const hashedPassword = await Bun.password.hash(password);
    await repo.updatePassword(userId, hashedPassword);

    const token = await signAuthToken(userId, user.email);
    return success({ token });
  },
});

export const authService = createAuthService(userRepository);
