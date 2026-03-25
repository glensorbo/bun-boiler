import { describe, test, expect } from 'bun:test';

import { signAuthToken } from '../signAuthToken';
import { verifyToken } from '../verifyToken';

process.env.JWT_SECRET = 'test-secret-for-jwt-utils';

describe('signAuthToken', () => {
  test('returns a non-empty string', async () => {
    const token = await signAuthToken('user-1', 'test@example.com');
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  test('returned JWT can be decoded by verifyToken', async () => {
    const token = await signAuthToken('user-1', 'test@example.com');
    const payload = await verifyToken(token);
    expect(payload).not.toBeNull();
  });

  test('decoded payload has tokenType: auth', async () => {
    const token = await signAuthToken('user-1', 'test@example.com');
    const payload = await verifyToken(token);
    expect(payload?.tokenType).toBe('auth');
  });

  test('decoded payload has correct sub and email', async () => {
    const token = await signAuthToken('user-99', 'auth@example.com');
    const payload = await verifyToken(token);
    expect(payload?.sub).toBe('user-99');
    expect(payload?.email).toBe('auth@example.com');
  });
});
