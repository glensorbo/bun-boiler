import { describe, test, expect } from 'bun:test';

process.env.JWT_SECRET = 'test-secret';
process.env.APP_URL = 'http://localhost:3000';

import { createAuthService } from '../authService';
import { mockUserRepository } from '@backend/utils/test/mockUserRepository';
import { mockUsers } from '@backend/utils/test/mockUsers';

const authService = createAuthService(mockUserRepository);

describe('AuthService', () => {
  describe('createUser', () => {
    test('should return ok with signupLink', async () => {
      const result = await authService.createUser(
        'new@example.com',
        'New User',
      );
      expect(result.ok).toBe(true);
      if (result.ok) expect(result).toHaveProperty('signupLink');
    });

    test('signupLink should be a string containing a token query param', async () => {
      const result = await authService.createUser(
        'new@example.com',
        'New User',
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(typeof result.signupLink).toBe('string');
        expect(result.signupLink).toContain('token=');
      }
    });

    test('signupLink should contain /set-password path', async () => {
      const result = await authService.createUser(
        'new@example.com',
        'New User',
      );
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.signupLink).toContain('/set-password');
    });

    test('should return user_already_exists for existing email', async () => {
      const existingUser = mockUsers[0]!;
      const result = await authService.createUser(
        existingUser.email,
        'Duplicate',
      );
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('user_already_exists');
    });

    test('should call repo.create with email and name', async () => {
      const calls: { email: string; name: string }[] = [];
      const trackingRepo = {
        ...mockUserRepository,
        getByEmail: async () => undefined,
        create: async (
          email: string,
          name: string,
          _hashedPassword: string,
        ) => {
          calls.push({ email, name });
          return mockUserRepository.create(email, name, _hashedPassword);
        },
      };

      const svc = createAuthService(trackingRepo);
      await svc.createUser('track@example.com', 'Tracked User');

      expect(calls.length).toBe(1);
      expect(calls[0]?.email).toBe('track@example.com');
      expect(calls[0]?.name).toBe('Tracked User');
    });
  });

  describe('setPassword', () => {
    test('should return ok with token', async () => {
      const existingUser = mockUsers[0]!;
      const result = await authService.setPassword(
        existingUser.id!,
        'newpassword123',
      );
      expect(result.ok).toBe(true);
      if (result.ok) expect(result).toHaveProperty('token');
    });

    test('token should be a non-empty string', async () => {
      const existingUser = mockUsers[0]!;
      const result = await authService.setPassword(
        existingUser.id!,
        'newpassword123',
      );
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(typeof result.token).toBe('string');
        expect(result.token.length).toBeGreaterThan(0);
      }
    });

    test('should return user_not_found for non-existent user', async () => {
      const result = await authService.setPassword(
        '00000000-0000-0000-0000-000000000000',
        'pass',
      );
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('user_not_found');
    });

    test('should call repo.updatePassword with userId', async () => {
      const updatedIds: string[] = [];
      const trackingRepo = {
        ...mockUserRepository,
        updatePassword: async (id: string, _hashedPassword: string) => {
          updatedIds.push(id);
        },
      };

      const svc = createAuthService(trackingRepo);
      const existingUser = mockUsers[0]!;
      await svc.setPassword(existingUser.id!, 'newpassword123');

      expect(updatedIds.length).toBe(1);
      expect(updatedIds[0]).toBe(existingUser.id);
    });
  });
});
