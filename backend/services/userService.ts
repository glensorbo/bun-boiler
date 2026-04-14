import { sendMail } from '@backend/features/mail/sendMail';
import { logger } from '@backend/features/telemetry/logger';
import { userRepository } from '@backend/repositories/userRepository';
import { errorOr } from '@backend/types/errorOr';
import { generatePassphrase, signSignupToken } from '@backend/utils/auth';

import type { userRepository as UserRepositoryType } from '@backend/repositories/userRepository';
import type { ErrorOr } from '@backend/types/errorOrType';
import type { User } from '@backend/types/user';

/**
 * User Service Factory
 * Accepts repository as dependency for testability
 */
export const createUserService = (repo: typeof UserRepositoryType) => ({
  /**
   * Get all users with safe data (password omitted)
   * @returns Promise<User[]> - Array of users without password field
   */
  async getAllUsers(): Promise<User[]> {
    const users = await repo.getAll();

    return users.map(({ password: _password, ...safeUser }) => safeUser);
  },

  /**
   * Get a single user by ID
   * @param id - User ID (UUID)
   * @returns Promise<User | undefined> - User if found, undefined otherwise
   */
  async getUserById(id: string): Promise<User | undefined> {
    const user = await repo.getById(id);

    if (!user) {
      return undefined;
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Delete a user. A user cannot delete themselves.
   */
  async deleteUser(
    requestingUserId: string,
    targetId: string,
  ): Promise<ErrorOr<null>> {
    if (requestingUserId === targetId) {
      return errorOr<null>(null, [
        { type: 'forbidden', message: 'You cannot delete your own account' },
      ]);
    }

    const user = await repo.getById(targetId);
    if (!user) {
      return errorOr<null>(null, [
        { type: 'not_found', message: 'User not found' },
      ]);
    }

    await repo.deleteById(targetId);
    return errorOr(null);
  },

  /**
   * Update a user's role. A user cannot change their own role.
   */
  async updateUserRole(
    requestingUserId: string,
    targetId: string,
    role: 'admin' | 'user',
  ): Promise<ErrorOr<User>> {
    if (requestingUserId === targetId) {
      return errorOr<User>(null, [
        { type: 'forbidden', message: 'You cannot change your own role' },
      ]);
    }

    const user = await repo.getById(targetId);
    if (!user) {
      return errorOr<User>(null, [
        { type: 'not_found', message: 'User not found' },
      ]);
    }

    await repo.updateRole(targetId, role);
    const { password: _password, ...safeUser } = { ...user, role };
    return errorOr(safeUser);
  },

  /**
   * Reset a user's password — generates a new passphrase, hashes it,
   * updates the DB, issues a new signup token, and emails the user.
   * Returns the signup link (in case email is not configured).
   */
  async resetUserPassword(
    targetId: string,
  ): Promise<ErrorOr<{ signupLink: string }>> {
    const user = await repo.getById(targetId);
    if (!user) {
      return errorOr<{ signupLink: string }>(null, [
        { type: 'not_found', message: 'User not found' },
      ]);
    }

    const passphrase = generatePassphrase();
    const hashedPassword = await Bun.password.hash(passphrase);
    await repo.updatePassword(targetId, hashedPassword);

    const token = await signSignupToken(user.id!, user.email, user.name);
    const appUrl = Bun.env.APP_URL ?? 'http://localhost:3210';
    const signupLink = `${appUrl}/set-password?token=${token}`;

    try {
      await sendMail({
        to: user.email,
        subject: 'Your password has been reset',
        html: `<p>Hi ${user.name},</p><p>An admin has reset your password. Click the link below to set a new password:</p><p><a href="${signupLink}">${signupLink}</a></p><p>This link expires in 24 hours.</p>`,
        text: `Hi ${user.name},\n\nAn admin has reset your password. Set a new password at:\n${signupLink}\n\nThis link expires in 24 hours.`,
      });
    } catch (err) {
      logger.warn('📧 Failed to send password reset email', {
        userId: targetId,
        error: String(err),
      });
    }

    return errorOr({ signupLink });
  },
});

/**
 * User Service
 * Handles business logic for user operations
 * Transforms data between repository and handler layers
 */
export const userService = createUserService(userRepository);
