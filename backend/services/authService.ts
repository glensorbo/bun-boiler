import { userRepository } from '../repositories/userRepository';
import { generatePassphrase } from '../utils/auth/passphrase';
import { signAuthToken } from '../utils/auth/signAuthToken';
import { signSignupToken } from '../utils/auth/signSignupToken';

import type { userRepository as UserRepositoryType } from '../repositories/userRepository';

type CreateUserResult =
  | { ok: true; signupLink: string }
  | { ok: false; error: 'user_already_exists' };

type SetPasswordResult =
  | { ok: true; token: string }
  | { ok: false; error: 'user_not_found' };

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
   * @returns Discriminated union: ok with signupLink, or error string
   */
  async createUser(email: string, name: string): Promise<CreateUserResult> {
    const existing = await repo.getByEmail(email);
    if (existing) return { ok: false, error: 'user_already_exists' };

    const passphrase = generatePassphrase();
    const hashedPassword = await Bun.password.hash(passphrase);

    const user = await repo.create(email, name, hashedPassword);
    const token = await signSignupToken(user.id!, email);
    const appUrl = Bun.env.APP_URL ?? 'http://localhost:3000';

    return { ok: true, signupLink: `${appUrl}/set-password?token=${token}` };
  },

  /**
   * Set a new password for a user (used during onboarding via signup link).
   * Hashes the password and issues a full-length auth JWT on success.
   *
   * @param userId - ID of the user setting their password
   * @param password - Plain-text password chosen by the user
   * @returns Discriminated union: ok with token, or error string
   */
  async setPassword(
    userId: string,
    password: string,
  ): Promise<SetPasswordResult> {
    const user = await repo.getById(userId);
    if (!user) return { ok: false, error: 'user_not_found' };

    const hashedPassword = await Bun.password.hash(password);
    await repo.updatePassword(userId, hashedPassword);

    const token = await signAuthToken(userId, user.email);
    return { ok: true, token };
  },
});

export const authService = createAuthService(userRepository);
