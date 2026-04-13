import { describe, test, expect, afterEach } from 'bun:test';

import { createRateLimitMiddleware } from '@backend/middleware/rateLimitMiddleware';

import type { BunRequest, Ctx } from '@backend/middleware';

const originalDisable = Bun.env.DISABLE_RATE_LIMIT;

afterEach(() => {
  if (originalDisable !== undefined) {
    Bun.env.DISABLE_RATE_LIMIT = originalDisable;
  } else {
    delete Bun.env.DISABLE_RATE_LIMIT;
  }
});

const makeRequest = (ip = '1.2.3.4'): BunRequest => {
  const headers = new Headers({ 'x-forwarded-for': ip });
  return Object.assign(
    new Request('http://localhost/api/auth/login', { method: 'POST', headers }),
    { params: {} },
  ) as BunRequest;
};

const ctx: Ctx = {};

describe('createRateLimitMiddleware', () => {
  test('returns null for the first request (under limit)', async () => {
    const middleware = createRateLimitMiddleware({ max: 5, windowMs: 60_000 });
    const result = await middleware(makeRequest('10.0.0.1'), ctx);
    expect(result).toBeNull();
  });

  test('returns null for requests up to the limit', async () => {
    const middleware = createRateLimitMiddleware({ max: 3, windowMs: 60_000 });
    const req = () => makeRequest('10.0.0.2');
    await middleware(req(), ctx);
    await middleware(req(), ctx);
    const result = await middleware(req(), ctx);
    expect(result).toBeNull();
  });

  test('returns 429 when the limit is exceeded', async () => {
    const middleware = createRateLimitMiddleware({ max: 2, windowMs: 60_000 });
    const req = () => makeRequest('10.0.0.3');
    await middleware(req(), ctx);
    await middleware(req(), ctx);
    const result = await middleware(req(), ctx);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(429);
  });

  test('429 body has error.type rateLimit', async () => {
    const middleware = createRateLimitMiddleware({ max: 1, windowMs: 60_000 });
    const req = () => makeRequest('10.0.0.4');
    await middleware(req(), ctx);
    const result = (await middleware(req(), ctx)) as Response;
    const body = (await result.json()) as { error: { type: string } };
    expect(body.error.type).toBe('rateLimit');
  });

  test('uses custom message in 429 response', async () => {
    const middleware = createRateLimitMiddleware({
      max: 1,
      windowMs: 60_000,
      message: 'Custom rate limit message',
    });
    const req = () => makeRequest('10.0.0.5');
    await middleware(req(), ctx);
    const result = (await middleware(req(), ctx)) as Response;
    const body = (await result.json()) as { message: string };
    expect(body.message).toBe('Custom rate limit message');
  });

  test('tracks limits per IP independently', async () => {
    const middleware = createRateLimitMiddleware({ max: 1, windowMs: 60_000 });
    await middleware(makeRequest('192.168.1.1'), ctx);
    const result = await middleware(makeRequest('192.168.1.2'), ctx);
    expect(result).toBeNull();
  });

  test('returns null for all requests when DISABLE_RATE_LIMIT is true', async () => {
    Bun.env.DISABLE_RATE_LIMIT = 'true';
    const middleware = createRateLimitMiddleware({ max: 1, windowMs: 60_000 });
    const req = () => makeRequest('10.0.0.6');
    await middleware(req(), ctx);
    await middleware(req(), ctx);
    const result = await middleware(req(), ctx);
    expect(result).toBeNull();
  });

  test('falls back to "unknown" IP when no forwarded headers are present', async () => {
    const middleware = createRateLimitMiddleware({ max: 1, windowMs: 60_000 });
    const noIpReq = (): BunRequest =>
      Object.assign(
        new Request('http://localhost/api/auth/login', { method: 'POST' }),
        {
          params: {},
        },
      ) as BunRequest;
    await middleware(noIpReq(), ctx);
    const result = await middleware(noIpReq(), ctx);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(429);
  });
});
