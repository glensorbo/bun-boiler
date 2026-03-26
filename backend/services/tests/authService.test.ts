import { describe, test, expect } from 'bun:test';

process.env.JWT_SECRET = 'test-secret';
process.env.APP_URL = 'http://localhost:3000';

import { createAuthService } from '../authService';
import { mockUserRepository } from '@backend/utils/test/mockUserRepository';
import { mockUsers } from '@backend/utils/test/mockUsers';

const authService = createAuthService(mockUserRepository);

describe('AuthService', () => {
  describe('createUser', () => {
    test('should return data with signupLink on success', async () => {
      const result = await authService.createUser(
        'new@example.com',
        'New User',
      );
      expect(result.error).toBeNull();
      expect(result.data).toHaveProperty('signupLink');
    });

    test('signupLink should contain token query param and /set-password path', async () => {
      const result = await authService.createUser(
        'new@example.com',
        'New User',
      );
      expect(result.error).toBeNull();
      expect(result.data?.signupLink).toContain('token=');
      expect(result.data?.signupLink).toContain('/set-password');
    });

    test('should return conflict error for existing email', async () => {
      const existingUser = mockUsers[0]!;
      const result = await authService.createUser(
        existingUser.email,
        'Duplicate',
      );
      expect(result.data).toBeNull();
      expect(result.error?.[0]?.type).toBe('conflict');
      expect(result.error?.[0]?.field).toBe('email');
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
    test('should return data with token on success', async () => {
      const existingUser = mockUsers[0]!;
      const result = await authService.setPassword(
        existingUser.id!,
        'newpassword123',
      );
      expect(result.error).toBeNull();
      expect(result.data).toHaveProperty('token');
    });

    test('token should be a non-empty string', async () => {
      const existingUser = mockUsers[0]!;
      const result = await authService.setPassword(
        existingUser.id!,
        'newpassword123',
      );
      expect(result.error).toBeNull();
      expect(typeof result.data?.token).toBe('string');
      expect(result.data?.token.length).toBeGreaterThan(0);
    });

    test('should return not_found error for non-existent user', async () => {
      const result = await authService.setPassword(
        '00000000-0000-0000-0000-000000000000',
        'pass',
      );
      expect(result.data).toBeNull();
      expect(result.error?.[0]?.type).toBe('not_found');
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
