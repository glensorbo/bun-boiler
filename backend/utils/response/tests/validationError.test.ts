import { describe, test, expect } from 'bun:test';

import { validationError } from '../validationError';

import type { ApiErrorResponse } from '@backend/types/errors';

describe('validationError', () => {
  test('returns a Response with status 400', () => {
    const res = validationError('Bad input', []);
    expect(res.status).toBe(400);
  });

  test('body has error.type === validation', async () => {
    const res = validationError('Bad input', []);
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.error.type).toBe('validation');
  });

  test('body includes the provided message', async () => {
    const res = validationError('Name is required', []);
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.message).toBe('Name is required');
  });

  test('body includes the provided field errors', async () => {
    const errors = [{ field: 'email', message: 'Invalid email' }];
    const res = validationError('Validation failed', errors);
    const body = (await res.json()) as ApiErrorResponse;
    expect(body.error.errors).toEqual(errors);
  });

  test('content-type is application/json', () => {
    const res = validationError('Bad input', []);
    expect(res.headers.get('content-type')).toContain('application/json');
  });
});
