import { describe, test, expect } from 'bun:test';

import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
  setPasswordSchema,
} from '../auth';

describe('createUserSchema', () => {
  test('accepts valid email and name', () => {
    const result = createUserSchema.safeParse({
      email: 'user@example.com',
      name: 'Alice',
    });
    expect(result.success).toBe(true);
  });

  test('rejects missing email', () => {
    const result = createUserSchema.safeParse({ name: 'Alice' });
    expect(result.success).toBe(false);
  });

  test('rejects invalid email format', () => {
    const result = createUserSchema.safeParse({
      email: 'not-an-email',
      name: 'Alice',
    });
    expect(result.success).toBe(false);
  });

  test('rejects missing name', () => {
    const result = createUserSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(false);
  });

  test('rejects empty name', () => {
    const result = createUserSchema.safeParse({
      email: 'user@example.com',
      name: '',
    });
    expect(result.success).toBe(false);
  });

  test('rejects both fields missing', () => {
    const result = createUserSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  test('accepts valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'mypassword',
    });
    expect(result.success).toBe(true);
  });

  test('rejects missing email', () => {
    const result = loginSchema.safeParse({ password: 'mypassword' });
    expect(result.success).toBe(false);
  });

  test('rejects invalid email format', () => {
    const result = loginSchema.safeParse({
      email: 'bad',
      password: 'mypassword',
    });
    expect(result.success).toBe(false);
  });

  test('rejects missing password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(false);
  });

  test('rejects empty password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('setPasswordSchema', () => {
  test('accepts valid matching passwords of sufficient length', () => {
    const result = setPasswordSchema.safeParse({
      password: 'strongpassword1',
      confirmPassword: 'strongpassword1',
    });
    expect(result.success).toBe(true);
  });

  test('rejects password shorter than 12 characters', () => {
    const result = setPasswordSchema.safeParse({
      password: 'short',
      confirmPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  test('rejects mismatched passwords', () => {
    const result = setPasswordSchema.safeParse({
      password: 'strongpassword1',
      confirmPassword: 'differentpassword1',
    });
    expect(result.success).toBe(false);
  });

  test('rejects missing confirmPassword', () => {
    const result = setPasswordSchema.safeParse({ password: 'strongpassword1' });
    expect(result.success).toBe(false);
  });

  test('rejects missing password', () => {
    const result = setPasswordSchema.safeParse({
      confirmPassword: 'strongpassword1',
    });
    expect(result.success).toBe(false);
  });
});

describe('changePasswordSchema', () => {
  test('accepts valid current and matching new passwords', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'newstrongpassword1',
      confirmPassword: 'newstrongpassword1',
    });
    expect(result.success).toBe(true);
  });

  test('rejects missing currentPassword', () => {
    const result = changePasswordSchema.safeParse({
      newPassword: 'newstrongpassword1',
      confirmPassword: 'newstrongpassword1',
    });
    expect(result.success).toBe(false);
  });

  test('rejects new password shorter than 12 characters', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'short',
      confirmPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  test('rejects mismatched new passwords', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'oldpassword',
      newPassword: 'newstrongpassword1',
      confirmPassword: 'differentpassword1',
    });
    expect(result.success).toBe(false);
  });

  test('rejects empty currentPassword', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: '',
      newPassword: 'newstrongpassword1',
      confirmPassword: 'newstrongpassword1',
    });
    expect(result.success).toBe(false);
  });
});
