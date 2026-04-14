import { describe, test, expect } from 'bun:test';
import { withMiddleware } from '../index';
import type { BunRequest, Ctx, MiddlewareFn } from '../index';

const makeRequest = (
  method: string,
  url = 'http://localhost/api/test',
  params: Record<string, string> = {},
  headers?: HeadersInit,
): BunRequest =>
  Object.assign(new Request(url, { method, headers }), {
    params,
  }) as BunRequest;

describe('withMiddleware', () => {
  test('calls the handler when no middleware is provided', async () => {
    const handler = withMiddleware()(
      (_, __) => new Response('ok', { status: 200 }),
    );
    const res = await handler(makeRequest('GET'));
    expect(res.status).toBe(200);
  });

  test('returns 204 for OPTIONS (preflight) requests without calling the handler', async () => {
    let handlerCalled = false;
    const handler = withMiddleware()((_, __) => {
      handlerCalled = true;
      return new Response('ok', { status: 200 });
    });
    const res = await handler(makeRequest('OPTIONS'));
    expect(res.status).toBe(204);
    expect(handlerCalled).toBe(false);
  });

  test('calls middleware in order and passes a shared ctx', async () => {
    const calls: string[] = [];
    const mw1: MiddlewareFn = async (_, ctx) => {
      calls.push('mw1');
      ctx.a = 1;
      return null;
    };
    const mw2: MiddlewareFn = async (_, ctx) => {
      calls.push('mw2');
      ctx.b = 2;
      return null;
    };

    let capturedCtx: Ctx = {};
    const handler = withMiddleware(
      mw1,
      mw2,
    )((_, ctx) => {
      capturedCtx = ctx;
      return new Response('ok', { status: 200 });
    });

    await handler(makeRequest('GET'));

    expect(calls).toEqual(['mw1', 'mw2']);
    expect(capturedCtx.a).toBe(1);
    expect(capturedCtx.b).toBe(2);
  });

  test('short-circuits when middleware returns a Response', async () => {
    const calls: string[] = [];
    const blocking: MiddlewareFn = async () => {
      calls.push('blocking');
      return new Response('Forbidden', { status: 403 });
    };
    const after: MiddlewareFn = async () => {
      calls.push('after');
      return null;
    };

    let handlerCalled = false;
    const handler = withMiddleware(
      blocking,
      after,
    )((_, __) => {
      handlerCalled = true;
      return new Response('ok');
    });

    const res = await handler(makeRequest('GET'));
    expect(res.status).toBe(403);
    expect(calls).toEqual(['blocking']);
    expect(handlerCalled).toBe(false);
  });

  test('applies CORS headers when Origin header is present', async () => {
    const originalCors = Bun.env.CORS_ORIGIN;
    delete Bun.env.CORS_ORIGIN; // defaults to wildcard '*'

    // Bun strips 'Origin' as a forbidden header in new Request(), so use a stub
    const req = {
      method: 'GET',
      url: 'http://localhost/api/test',
      params: {},
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'origin' ? 'http://localhost:5173' : null,
      },
    } as unknown as BunRequest;

    const handler = withMiddleware()(
      (_, __) => new Response('ok', { status: 200 }),
    );
    const res = await handler(req);

    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');

    if (originalCors !== undefined) {
      Bun.env.CORS_ORIGIN = originalCors;
    }
  });

  test('does not add CORS headers when Origin header is absent', async () => {
    const handler = withMiddleware()(
      (_, __) => new Response('ok', { status: 200 }),
    );
    const res = await handler(makeRequest('GET'));
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  test('returns the handler response status unchanged', async () => {
    const handler = withMiddleware()(
      (_, __) => new Response('not found', { status: 404 }),
    );
    const res = await handler(makeRequest('GET'));
    expect(res.status).toBe(404);
  });
});
