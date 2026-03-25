import { describe, test, expect } from 'bun:test';

import {
  createAuthService,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../authService';
import { mockUserRepository } from '@backend/utils/test/mockUserRepository';
import { mockUsers } from '@backend/utils/test/mockUsers';

const authService = createAuthService(mockUserRepository);

describe('AuthService', () => {
  describe('createUser', () => {
    test('should return an object with signupLink', async () => {
      const result = await authService.createUser(
        'new@example.com',
        'New User',
      );
      expect(result).toHaveProperty('signupLink');
    });

    test('signupLink should be a string containing a token query param', async () => {
      const result = await authService.createUser(
        'new@example.com',
        'New User',
      );
      expect(typeof result.signupLink).toBe('string');
      expect(result.signupLink).toContain('token=');
    });

    test('signupLink should contain /set-password path', async () => {
      const result = await authService.createUser(
        'new@example.com',
        'New User',
      );
      expect(result.signupLink).toContain('/set-password');
    });

    test('should throw UserAlreadyExistsError for existing email', async () => {
      const existingUser = mockUsers[0]!;
      expect(
        authService.createUser(existingUser.email, 'Duplicate'),
      ).rejects.toThrow(UserAlreadyExistsError);
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
    test('should return an object with token', async () => {
      const existingUser = mockUsers[0]!;
      const result = await authService.setPassword(
        existingUser.id!,
        'newpassword123',
      );
      expect(result).toHaveProperty('token');
    });

    test('token should be a non-empty string', async () => {
      const existingUser = mockUsers[0]!;
      const result = await authService.setPassword(
        existingUser.id!,
        'newpassword123',
      );
      expect(typeof result.token).toBe('string');
      expect(result.token.length).toBeGreaterThan(0);
    });

    test('should throw UserNotFoundError for non-existent user', async () => {
      expect(
        authService.setPassword('00000000-0000-0000-0000-000000000000', 'pass'),
      ).rejects.toThrow(UserNotFoundError);
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
