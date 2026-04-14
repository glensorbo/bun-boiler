import { describe, test, expect } from 'bun:test';
import { forbiddenError } from '../forbiddenError';
import type { ApiErrorResponse } from '@backend/types/apiErrorResponse';

describe('forbiddenError', () => {
  test('returns a Response with status 403', () => {
    const res = forbiddenError('Forbidden');
    expect(res.status).toBe(403);
  });

  test('body has error.type === forbidden', async () => {
    const res = forbiddenError('Forbidden');
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.error.type).toBe('forbidden');
  });

  test('body includes the provided message', async () => {
    const res = forbiddenError('You do not have permission');
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.message).toBe('You do not have permission');
  });

  test('body has status 403', async () => {
    const res = forbiddenError('Forbidden');
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.status).toBe(403);
  });

  test('body includes optional details when provided', async () => {
    const res = forbiddenError('Forbidden', 'Admin role required');
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.error.details).toBe('Admin role required');
  });

  test('body has empty errors array', async () => {
    const res = forbiddenError('Forbidden');
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.error.errors).toEqual([]);
  });

  test('returns JSON content type', () => {
    const res = forbiddenError('Forbidden');
    expect(res.headers.get('content-type')).toContain('application/json');
  });
});
