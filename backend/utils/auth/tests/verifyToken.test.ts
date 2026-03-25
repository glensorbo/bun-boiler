import { describe, test, expect } from 'bun:test';

import { signAuthToken } from '../signAuthToken';
import { signSignupToken } from '../signSignupToken';
import { verifyToken } from '../verifyToken';

process.env.JWT_SECRET = 'test-secret-for-jwt-utils';

describe('verifyToken', () => {
  test('returns null for an invalid token string', async () => {
    const result = await verifyToken('not.a.valid.token');
    expect(result).toBeNull();
  });

  test('returns null for empty string', async () => {
    const result = await verifyToken('');
    expect(result).toBeNull();
  });

  test('returns typed payload for a valid signup token', async () => {
    const token = await signSignupToken('user-1', 'test@example.com');
    const payload = await verifyToken(token);
    expect(payload).not.toBeNull();
  });

  test('returns typed payload for a valid auth token', async () => {
    const token = await signAuthToken('user-1', 'test@example.com');
    const payload = await verifyToken(token);
    expect(payload).not.toBeNull();
  });

  test('returned payload has correct sub, email, tokenType for signup', async () => {
    const token = await signSignupToken('user-7', 'verify@example.com');
    const payload = await verifyToken(token);
    expect(payload?.sub).toBe('user-7');
    expect(payload?.email).toBe('verify@example.com');
    expect(payload?.tokenType).toBe('signup');
  });

  test('returned payload has correct sub, email, tokenType for auth', async () => {
    const token = await signAuthToken('user-8', 'auth-verify@example.com');
    const payload = await verifyToken(token);
    expect(payload?.sub).toBe('user-8');
    expect(payload?.email).toBe('auth-verify@example.com');
    expect(payload?.tokenType).toBe('auth');
  });
});
