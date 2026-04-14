import { describe, test, expect, afterEach } from 'bun:test';
import { applyCorsHeaders } from '../applyCorsHeaders';
import { corsPreflightResponse } from '../corsPreflightResponse';

const originalCorsOrigin = Bun.env.CORS_ORIGIN;

afterEach(() => {
  if (originalCorsOrigin !== undefined) {
    Bun.env.CORS_ORIGIN = originalCorsOrigin;
  } else {
    delete Bun.env.CORS_ORIGIN;
  }
});

// Bun's Request constructor treats 'Origin' as a forbidden header and strips it.
// Both cors utils only call req.headers.get('Origin'), so a minimal stub is enough.
const makeRequest = (origin: string | null) =>
  ({
    headers: {
      get: (name: string) => (name.toLowerCase() === 'origin' ? origin : null),
    },
  }) as unknown as Request;

const baseResponse = new Response('{"data":true}', {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
});

describe('applyCorsHeaders', () => {
  test('returns response unchanged when no Origin header', () => {
    Bun.env.CORS_ORIGIN = '*';
    const req = makeRequest(null);
    const res = applyCorsHeaders(req, baseResponse);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  test('sets Allow-Origin: * when CORS_ORIGIN is wildcard', () => {
    Bun.env.CORS_ORIGIN = '*';
    const req = makeRequest('http://example.com');
    const res = applyCorsHeaders(req, baseResponse);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  test('reflects specific origin when it matches the allowed list', () => {
    Bun.env.CORS_ORIGIN = 'http://allowed.com';
    const req = makeRequest('http://allowed.com');
    const res = applyCorsHeaders(req, baseResponse);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
      'http://allowed.com',
    );
  });

  test('sets Vary: Origin for specific origin matching', () => {
    Bun.env.CORS_ORIGIN = 'http://allowed.com';
    const req = makeRequest('http://allowed.com');
    const res = applyCorsHeaders(req, baseResponse);
    expect(res.headers.get('Vary')).toBe('Origin');
  });

  test('does not set Allow-Origin when origin is not in the allowed list', () => {
    Bun.env.CORS_ORIGIN = 'http://allowed.com';
    const req = makeRequest('http://other.com');
    const res = applyCorsHeaders(req, baseResponse);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  test('allows one of multiple comma-separated origins', () => {
    Bun.env.CORS_ORIGIN = 'http://a.com, http://b.com';
    const req = makeRequest('http://b.com');
    const res = applyCorsHeaders(req, baseResponse);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://b.com');
  });

  test('preserves original status code', () => {
    Bun.env.CORS_ORIGIN = '*';
    const req = makeRequest('http://example.com');
    const res = applyCorsHeaders(req, new Response(null, { status: 201 }));
    expect(res.status).toBe(201);
  });

  test('defaults to wildcard when CORS_ORIGIN is not set', () => {
    delete Bun.env.CORS_ORIGIN;
    const req = makeRequest('http://example.com');
    const res = applyCorsHeaders(req, baseResponse);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});

describe('corsPreflightResponse', () => {
  test('returns 204 status', () => {
    const req = makeRequest('http://example.com');
    const res = corsPreflightResponse(req);
    expect(res.status).toBe(204);
  });

  test('sets Access-Control-Allow-Methods', () => {
    const req = makeRequest('http://example.com');
    const res = corsPreflightResponse(req);
    expect(res.headers.get('Access-Control-Allow-Methods')).not.toBeNull();
  });

  test('includes common HTTP methods', () => {
    const req = makeRequest('http://example.com');
    const res = corsPreflightResponse(req);
    const methods = res.headers.get('Access-Control-Allow-Methods') ?? '';
    expect(methods).toContain('GET');
    expect(methods).toContain('POST');
    expect(methods).toContain('DELETE');
  });

  test('sets Access-Control-Allow-Headers', () => {
    const req = makeRequest('http://example.com');
    const res = corsPreflightResponse(req);
    expect(res.headers.get('Access-Control-Allow-Headers')).not.toBeNull();
  });

  test('includes Authorization in allowed headers', () => {
    const req = makeRequest('http://example.com');
    const res = corsPreflightResponse(req);
    expect(res.headers.get('Access-Control-Allow-Headers')).toContain(
      'Authorization',
    );
  });

  test('sets Access-Control-Max-Age', () => {
    const req = makeRequest('http://example.com');
    const res = corsPreflightResponse(req);
    expect(res.headers.get('Access-Control-Max-Age')).not.toBeNull();
  });

  test('sets Allow-Origin: * when CORS_ORIGIN is wildcard', () => {
    Bun.env.CORS_ORIGIN = '*';
    const req = makeRequest('http://example.com');
    const res = corsPreflightResponse(req);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  test('reflects specific matching origin', () => {
    Bun.env.CORS_ORIGIN = 'http://allowed.com';
    const req = makeRequest('http://allowed.com');
    const res = corsPreflightResponse(req);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
      'http://allowed.com',
    );
  });
});
