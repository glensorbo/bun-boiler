import { describe, test, expect } from 'bun:test';

process.env.JWT_SECRET = 'test-secret';

import { authMiddleware } from '@backend/middleware/authMiddleware';
import { signAuthToken, signSignupToken } from '@backend/utils/auth';
import type { BunRequest, Ctx } from '@backend/middleware';

const makeRequest = (authHeader: string | null): BunRequest => {
  const headers = new Headers();
  if (authHeader !== null) {
    headers.set('Authorization', authHeader);
  }
  return Object.assign(new Request('http://localhost/api/test', { headers }), {
    params: {},
  }) as BunRequest;
};

describe('authMiddleware', () => {
  test('returns 401 when Authorization header is absent', async () => {
    const ctx: Ctx = {};
    const result = await authMiddleware(makeRequest(null), ctx);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  test('returns 401 when Authorization header does not start with Bearer', async () => {
    const ctx: Ctx = {};
    const result = await authMiddleware(makeRequest('Basic abc123'), ctx);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  test('returns 401 for an invalid token', async () => {
    const ctx: Ctx = {};
    const result = await authMiddleware(
      makeRequest('Bearer not.a.valid.token'),
      ctx,
    );
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  test('returns 401 for a signup token (rejected on auth-protected routes)', async () => {
    const token = await signSignupToken(
      'user-1',
      'test@example.com',
      'Test User',
    );
    const ctx: Ctx = {};
    const result = await authMiddleware(makeRequest(`Bearer ${token}`), ctx);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  test('returns null and sets ctx.user for a valid auth token', async () => {
    const token = await signAuthToken(
      'user-1',
      'test@example.com',
      'user',
      'Test User',
    );
    const ctx: Ctx = {};
    const result = await authMiddleware(makeRequest(`Bearer ${token}`), ctx);
    expect(result).toBeNull();
    expect(ctx.user).toBeDefined();
  });

  test('ctx.user has correct sub after successful auth', async () => {
    const token = await signAuthToken(
      'user-42',
      'user@example.com',
      'user',
      'User',
    );
    const ctx: Ctx = {};
    await authMiddleware(makeRequest(`Bearer ${token}`), ctx);
    expect((ctx.user as { sub: string }).sub).toBe('user-42');
  });

  test('ctx.user has correct email after successful auth', async () => {
    const token = await signAuthToken(
      'user-1',
      'email@example.com',
      'user',
      'User',
    );
    const ctx: Ctx = {};
    await authMiddleware(makeRequest(`Bearer ${token}`), ctx);
    expect((ctx.user as { email: string }).email).toBe('email@example.com');
  });
});
