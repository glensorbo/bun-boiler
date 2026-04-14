import { describe, test, expect } from 'bun:test';
import { tooManyRequestsError } from '../tooManyRequestsError';
import type { ApiErrorResponse } from '@backend/types/apiErrorResponse';

describe('tooManyRequestsError', () => {
  test('returns a Response with status 429', () => {
    const res = tooManyRequestsError('Too many requests');
    expect(res.status).toBe(429);
  });

  test('body has error.type === rateLimit', async () => {
    const res = tooManyRequestsError('Too many requests');
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.error.type).toBe('rateLimit');
  });

  test('body includes the provided message', async () => {
    const res = tooManyRequestsError(
      'Too many requests — please try again later',
    );
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.message).toBe('Too many requests — please try again later');
  });

  test('body has status 429', async () => {
    const res = tooManyRequestsError('Too many requests');
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.status).toBe(429);
  });

  test('body includes optional details when provided', async () => {
    const res = tooManyRequestsError(
      'Too many requests',
      'Try again in 60 seconds',
    );
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.error.details).toBe('Try again in 60 seconds');
  });

  test('body has empty errors array', async () => {
    const res = tooManyRequestsError('Too many requests');
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.error.errors).toEqual([]);
  });

  test('returns JSON content type', () => {
    const res = tooManyRequestsError('Too many requests');
    expect(res.headers.get('content-type')).toContain('application/json');
  });
});
