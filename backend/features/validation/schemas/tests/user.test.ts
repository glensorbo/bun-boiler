import { describe, test, expect } from 'bun:test';

import { updateRoleSchema } from '../updateRoleSchema';
import { uuidSchema } from '../uuidSchema';

describe('uuidSchema', () => {
  test('accepts a valid UUID', () => {
    const result = uuidSchema.safeParse('123e4567-e89b-12d3-a456-426614174000');
    expect(result.success).toBe(true);
  });

  test('rejects a non-UUID string', () => {
    const result = uuidSchema.safeParse('not-a-uuid');
    expect(result.success).toBe(false);
  });

  test('rejects an empty string', () => {
    const result = uuidSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  test('rejects a number', () => {
    const result = uuidSchema.safeParse(12345);
    expect(result.success).toBe(false);
  });

  test('error message describes the constraint', () => {
    const result = uuidSchema.safeParse('bad-value');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toContain('UUID');
    }
  });
});

describe('updateRoleSchema', () => {
  test('accepts role "admin"', () => {
    const result = updateRoleSchema.safeParse({ role: 'admin' });
    expect(result.success).toBe(true);
  });

  test('accepts role "user"', () => {
    const result = updateRoleSchema.safeParse({ role: 'user' });
    expect(result.success).toBe(true);
  });

  test('rejects an invalid role', () => {
    const result = updateRoleSchema.safeParse({ role: 'superadmin' });
    expect(result.success).toBe(false);
  });

  test('rejects missing role field', () => {
    const result = updateRoleSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  test('rejects empty string role', () => {
    const result = updateRoleSchema.safeParse({ role: '' });
    expect(result.success).toBe(false);
  });
});
