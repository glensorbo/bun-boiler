import { describe, test, expect } from 'bun:test';

process.env.JWT_SECRET = 'test-secret';

import { signupTokenMiddleware } from '@backend/middleware/signupTokenMiddleware';
import { signAuthToken, signSignupToken } from '@backend/utils/auth';
import type { BunRequest, Ctx } from '@backend/middleware';

const makeRequest = (authHeader: string | null): BunRequest => {
  const headers = new Headers();
  if (authHeader !== null) {
    headers.set('Authorization', authHeader);
  }
  return Object.assign(
    new Request('http://localhost/api/auth/set-password', { headers }),
    { params: {} },
  ) as BunRequest;
};

describe('signupTokenMiddleware', () => {
  test('returns 401 when Authorization header is absent', async () => {
    const ctx: Ctx = {};
    const result = await signupTokenMiddleware(makeRequest(null), ctx);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  test('returns 401 when Authorization header does not start with Bearer', async () => {
    const ctx: Ctx = {};
    const result = await signupTokenMiddleware(
      makeRequest('Basic abc123'),
      ctx,
    );
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  test('returns 401 for an invalid token', async () => {
    const ctx: Ctx = {};
    const result = await signupTokenMiddleware(
      makeRequest('Bearer not.a.valid.token'),
      ctx,
    );
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  test('returns 401 for a regular auth token (only signup tokens are accepted)', async () => {
    const token = await signAuthToken(
      'user-1',
      'test@example.com',
      'user',
      'Test User',
    );
    const ctx: Ctx = {};
    const result = await signupTokenMiddleware(
      makeRequest(`Bearer ${token}`),
      ctx,
    );
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  test('returns null and sets ctx.user for a valid signup token', async () => {
    const token = await signSignupToken(
      'user-1',
      'test@example.com',
      'Test User',
    );
    const ctx: Ctx = {};
    const result = await signupTokenMiddleware(
      makeRequest(`Bearer ${token}`),
      ctx,
    );
    expect(result).toBeNull();
    expect(ctx.user).toBeDefined();
  });

  test('ctx.user has correct sub after successful signup token verification', async () => {
    const token = await signSignupToken(
      'user-99',
      'signup@example.com',
      'Signup User',
    );
    const ctx: Ctx = {};
    await signupTokenMiddleware(makeRequest(`Bearer ${token}`), ctx);
    expect((ctx.user as { sub: string }).sub).toBe('user-99');
  });

  test('ctx.user has tokenType "signup"', async () => {
    const token = await signSignupToken(
      'user-1',
      'test@example.com',
      'Test User',
    );
    const ctx: Ctx = {};
    await signupTokenMiddleware(makeRequest(`Bearer ${token}`), ctx);
    expect((ctx.user as { tokenType: string }).tokenType).toBe('signup');
  });
});
