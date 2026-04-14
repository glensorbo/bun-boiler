import { describe, test, expect } from 'bun:test';
import { requireRole } from '@backend/middleware/requireRole';
import type { BunRequest, Ctx } from '@backend/middleware';
import type { AppJwtPayload } from '@backend/types/appJwtPayload';

const makeRequest = (): BunRequest =>
  Object.assign(new Request('http://localhost/api/test'), {
    params: {},
  }) as BunRequest;

const makeCtxWithRole = (role: 'admin' | 'user'): Ctx => ({
  user: {
    sub: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    tokenType: 'auth',
    role,
  } satisfies AppJwtPayload,
});

describe('requireRole', () => {
  test('returns 401 when ctx.user is not set', async () => {
    const middleware = requireRole('admin');
    const result = await middleware(makeRequest(), {});
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  test('returns 403 when user does not have the required role', async () => {
    const middleware = requireRole('admin');
    const ctx = await makeCtxWithRole('user');
    const result = await middleware(makeRequest(), ctx);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(403);
  });

  test('returns null when user has the required role', async () => {
    const middleware = requireRole('admin');
    const ctx = await makeCtxWithRole('admin');
    const result = await middleware(makeRequest(), ctx);
    expect(result).toBeNull();
  });

  test('returns null when user role is one of several accepted roles', async () => {
    const middleware = requireRole('admin', 'user');
    const ctx = await makeCtxWithRole('user');
    const result = await middleware(makeRequest(), ctx);
    expect(result).toBeNull();
  });

  test('user role passes its own required role check', async () => {
    const middleware = requireRole('user');
    const ctx = await makeCtxWithRole('user');
    const result = await middleware(makeRequest(), ctx);
    expect(result).toBeNull();
  });

  test('403 body has error.type forbidden', async () => {
    const middleware = requireRole('admin');
    const ctx = await makeCtxWithRole('user');
    const result = (await middleware(makeRequest(), ctx)) as Response;
    const body = (await result.json()) as { error: { type: string } };
    expect(body.error.type).toBe('forbidden');
  });
});
