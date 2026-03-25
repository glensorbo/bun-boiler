import { describe, test, expect } from 'bun:test';

process.env.JWT_SECRET = 'test-secret';
process.env.APP_URL = 'http://localhost:3000';

import { createAuthService } from '../../services/authService';
import { createAuthController } from '../authController';
import { mockUserRepository } from '@backend/utils/test/mockUserRepository';
import { mockUsers } from '@backend/utils/test/mockUsers';

import type { ApiErrorResponse } from '@backend/types/errors';

const mockAuthService = createAuthService(mockUserRepository);
const authController = createAuthController(mockAuthService);

const makeRequest = (body: unknown): Request =>
  new Request('http://localhost/api/auth/create-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

const makeSetPasswordRequest = (body: unknown): Request =>
  new Request('http://localhost/api/auth/set-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('AuthController', () => {
  describe('createUser', () => {
    test('should return 201 with signupLink on valid input', async () => {
      const req = makeRequest({
        email: 'new@example.com',
        name: 'New User',
      }) as never;
      const response = await authController.createUser(req);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty('signupLink');
    });

    test('should return JSON content type', async () => {
      const req = makeRequest({
        email: 'new@example.com',
        name: 'New User',
      }) as never;
      const response = await authController.createUser(req);
      expect(response.headers.get('content-type')).toContain(
        'application/json',
      );
    });

    test('should return 400 with only email error when email is missing', async () => {
      const req = makeRequest({ name: 'No Email' }) as never;
      const response = await authController.createUser(req);

      expect(response.status).toBe(400);
      const data = (await response.json()) as ApiErrorResponse;
      expect(data.error.type).toBe('validation');
      expect(data.error.errors.some((e) => e.field === 'email')).toBe(true);
      expect(data.error.errors.some((e) => e.field === 'name')).toBe(false);
    });

    test('should return 400 with only email error when email is invalid', async () => {
      const req = makeRequest({ email: 'not-an-email', name: 'User' }) as never;
      const response = await authController.createUser(req);

      expect(response.status).toBe(400);
      const data = (await response.json()) as ApiErrorResponse;
      expect(data.error.errors.some((e) => e.field === 'email')).toBe(true);
      expect(data.error.errors.some((e) => e.field === 'name')).toBe(false);
    });

    test('should return 400 with only name error when name is missing', async () => {
      const req = makeRequest({ email: 'valid@example.com' }) as never;
      const response = await authController.createUser(req);

      expect(response.status).toBe(400);
      const data = (await response.json()) as ApiErrorResponse;
      expect(data.error.errors.some((e) => e.field === 'name')).toBe(true);
      expect(data.error.errors.some((e) => e.field === 'email')).toBe(false);
    });

    test('should return errors for both fields when both are missing', async () => {
      const req = makeRequest({}) as never;
      const response = await authController.createUser(req);

      expect(response.status).toBe(400);
      const data = (await response.json()) as ApiErrorResponse;
      expect(data.error.errors.some((e) => e.field === 'email')).toBe(true);
      expect(data.error.errors.some((e) => e.field === 'name')).toBe(true);
    });

    test('should return 400 when email already exists', async () => {
      const existingUser = mockUsers[0]!;
      const req = makeRequest({
        email: existingUser.email,
        name: 'Duplicate',
      }) as never;
      const response = await authController.createUser(req);

      expect(response.status).toBe(400);
      const data = (await response.json()) as ApiErrorResponse;
      expect(data.error.errors.some((e) => e.field === 'email')).toBe(true);
    });

    test('should return 400 on invalid JSON body', async () => {
      const req = new Request('http://localhost/api/auth/create-user', {
        method: 'POST',
        body: 'not json',
      }) as never;
      const response = await authController.createUser(req);
      expect(response.status).toBe(400);
    });
  });

  describe('setPassword', () => {
    test('should return 200 with token on valid input', async () => {
      const existingUser = mockUsers[0]!;
      const req = makeSetPasswordRequest({
        password: 'strongpass123',
        confirmPassword: 'strongpass123',
      }) as never;
      const ctx = {
        user: {
          sub: existingUser.id,
          email: existingUser.email,
          tokenType: 'signup',
        },
      };

      const response = await authController.setPassword(req, ctx);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('token');
    });

    test('token should be a non-empty string', async () => {
      const existingUser = mockUsers[0]!;
      const req = makeSetPasswordRequest({
        password: 'strongpass123',
        confirmPassword: 'strongpass123',
      }) as never;
      const ctx = {
        user: {
          sub: existingUser.id,
          email: existingUser.email,
          tokenType: 'signup',
        },
      };

      const response = await authController.setPassword(req, ctx);
      const data = (await response.json()) as { token: string };
      expect(typeof data.token).toBe('string');
      expect(data.token.length).toBeGreaterThan(0);
    });

    test('should return 400 with password error when password is missing', async () => {
      const req = makeSetPasswordRequest({}) as never;
      const ctx = {
        user: { sub: 'some-id', email: 'a@b.com', tokenType: 'signup' },
      };

      const response = await authController.setPassword(req, ctx);

      expect(response.status).toBe(400);
      const data = (await response.json()) as ApiErrorResponse;
      expect(data.error.errors.some((e) => e.field === 'password')).toBe(true);
    });

    test('should return 400 with password error when password is too short', async () => {
      const req = makeSetPasswordRequest({
        password: 'short',
        confirmPassword: 'short',
      }) as never;
      const ctx = {
        user: { sub: 'some-id', email: 'a@b.com', tokenType: 'signup' },
      };

      const response = await authController.setPassword(req, ctx);

      expect(response.status).toBe(400);
      const data = (await response.json()) as ApiErrorResponse;
      expect(data.error.errors.some((e) => e.field === 'password')).toBe(true);
    });

    test('should return 400 with confirmPassword error when passwords do not match', async () => {
      const req = makeSetPasswordRequest({
        password: 'strongpass123',
        confirmPassword: 'differentpass456',
      }) as never;
      const ctx = {
        user: { sub: 'some-id', email: 'a@b.com', tokenType: 'signup' },
      };

      const response = await authController.setPassword(req, ctx);

      expect(response.status).toBe(400);
      const data = (await response.json()) as ApiErrorResponse;
      expect(data.error.errors.some((e) => e.field === 'confirmPassword')).toBe(
        true,
      );
    });
  });
});
