import { describe, test, expect } from 'bun:test';
import { getTableName } from 'drizzle-orm';

import { refreshTokens } from '../refreshTokens';

describe('refreshTokens schema', () => {
  test('has correct table name', () => {
    expect(getTableName(refreshTokens)).toBe('refresh_tokens');
  });

  test('has all required columns', () => {
    const columns = Object.keys(refreshTokens);
    expect(columns).toContain('id');
    expect(columns).toContain('userId');
    expect(columns).toContain('tokenHash');
    expect(columns).toContain('expiresAt');
    expect(columns).toContain('createdAt');
  });

  test('id is primary key', () => {
    expect(refreshTokens.id.primary).toBe(true);
  });

  test('tokenHash is unique', () => {
    expect(refreshTokens.tokenHash.isUnique).toBe(true);
  });

  test('notNull constraints on required fields', () => {
    expect(refreshTokens.userId.notNull).toBe(true);
    expect(refreshTokens.tokenHash.notNull).toBe(true);
    expect(refreshTokens.expiresAt.notNull).toBe(true);
    expect(refreshTokens.createdAt.notNull).toBe(true);
  });
});
