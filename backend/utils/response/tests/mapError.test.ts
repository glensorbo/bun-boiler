import { describe, test, expect } from 'bun:test';

import { mapError } from '../mapError';

import type { AppError } from '@backend/types/errorOr';

describe('mapError', () => {
  test('not_found error returns 404', async () => {
    const errors: AppError[] = [{ type: 'not_found', message: 'Not found' }];
    const response = mapError(errors);
    expect(response.status).toBe(404);
  });

  test('conflict error returns 400 with field error', async () => {
    const errors: AppError[] = [
      { type: 'conflict', message: 'Already exists', field: 'email' },
    ];
    const response = mapError(errors);
    expect(response.status).toBe(400);
    const body = (await response.json()) as {
      error: { errors: { field: string }[] };
    };
    expect(body.error.errors[0]?.field).toBe('email');
  });

  test('validation error returns 400 with all field errors', async () => {
    const errors: AppError[] = [
      { type: 'validation', message: 'Invalid', field: 'name' },
      { type: 'validation', message: 'Invalid', field: 'email' },
    ];
    const response = mapError(errors);
    expect(response.status).toBe(400);
    const body = (await response.json()) as {
      error: { errors: { field: string }[] };
    };
    expect(body.error.errors.length).toBe(2);
  });

  test('unauthorized error returns 401', async () => {
    const errors: AppError[] = [
      { type: 'unauthorized', message: 'Unauthorized' },
    ];
    const response = mapError(errors);
    expect(response.status).toBe(401);
  });

  test('errors without field are excluded from field errors list', async () => {
    const errors: AppError[] = [
      { type: 'validation', message: 'General error' },
    ];
    const response = mapError(errors);
    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: { errors: unknown[] } };
    expect(body.error.errors.length).toBe(0);
  });
});
