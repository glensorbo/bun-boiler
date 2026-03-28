import { test as publicTest } from '@playwright/test';

import { test, expect } from '../fixtures';

/**
 * Auth controller E2E tests
 * Routes: POST /api/auth/login, /refresh, /logout, /create-user, /change-password, /set-password
 */

publicTest.describe('POST /api/auth/login', () => {
  publicTest('returns 400 when body is empty', async ({ request }) => {
    const res = await request.post('/api/auth/login', { data: {} });
    expect(res.status()).toBe(400);
  });

  publicTest('returns 400 when email is invalid', async ({ request }) => {
    const res = await request.post('/api/auth/login', {
      data: { email: 'not-an-email', password: 'hunter2' },
    });
    expect(res.status()).toBe(400);
  });

  publicTest('returns 400 when password is missing', async ({ request }) => {
    const res = await request.post('/api/auth/login', {
      data: { email: 'user@example.com' },
    });
    expect(res.status()).toBe(400);
  });

  publicTest(
    'error body has message, status, error fields',
    async ({ request }) => {
      const res = await request.post('/api/auth/login', { data: {} });
      const body = await res.json();
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('error');
    },
  );

  publicTest('returns 401 for wrong credentials', async ({ request }) => {
    const res = await request.post('/api/auth/login', {
      data: { email: 'nobody@example.com', password: 'wrongpassword' },
    });
    expect(res.status()).toBe(401);
  });

  publicTest(
    'returns 200 with token for valid credentials',
    async ({ request }) => {
      const { E2E_EMAIL, E2E_PASSWORD } = await import('../global-setup');
      const res = await request.post('/api/auth/login', {
        data: { email: E2E_EMAIL, password: E2E_PASSWORD },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(typeof body.data.token).toBe('string');
      expect(body.data.token.length).toBeGreaterThan(0);
    },
  );
});

publicTest.describe('POST /api/auth/refresh', () => {
  publicTest(
    'returns 401 when no refresh cookie is present',
    async ({ request }) => {
      const res = await request.post('/api/auth/refresh');
      expect(res.status()).toBe(401);
    },
  );
});

publicTest.describe('POST /api/auth/logout', () => {
  publicTest(
    'returns 200 even without an active session',
    async ({ request }) => {
      const res = await request.post('/api/auth/logout');
      expect(res.status()).toBe(200);
    },
  );
});

test.describe('POST /api/auth/create-user (authenticated)', () => {
  test('returns 400 when email is missing', async ({ authedRequest }) => {
    const res = await authedRequest.post('/api/auth/create-user', {
      data: { name: 'Missing Email' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(
      body.error.errors.some((e: { field: string }) => e.field === 'email'),
    ).toBe(true);
  });

  test('returns 400 when name is missing', async ({ authedRequest }) => {
    const res = await authedRequest.post('/api/auth/create-user', {
      data: { email: 'valid@example.com' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(
      body.error.errors.some((e: { field: string }) => e.field === 'name'),
    ).toBe(true);
  });

  test('returns 400 when email already exists', async ({
    authedRequest,
    testUser,
  }) => {
    const res = await authedRequest.post('/api/auth/create-user', {
      data: { email: testUser.email, name: 'Duplicate' },
    });
    expect(res.status()).toBe(400);
  });

  test('returns 401 without auth token', async ({ request }) => {
    const res = await request.post('/api/auth/create-user', {
      data: { email: 'new@example.com', name: 'New User' },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe('POST /api/auth/change-password (authenticated)', () => {
  test('returns 400 when currentPassword is missing', async ({
    authedRequest,
  }) => {
    const res = await authedRequest.post('/api/auth/change-password', {
      data: {
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('returns 400 when newPassword is too short', async ({
    authedRequest,
  }) => {
    const res = await authedRequest.post('/api/auth/change-password', {
      data: {
        currentPassword: 'old',
        newPassword: 'short',
        confirmPassword: 'short',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('returns 401 when currentPassword is wrong', async ({
    authedRequest,
  }) => {
    const res = await authedRequest.post('/api/auth/change-password', {
      data: {
        currentPassword: 'definitelywrong',
        newPassword: 'newlongpassword123',
        confirmPassword: 'newlongpassword123',
      },
    });
    expect(res.status()).toBe(401);
  });

  test('returns 401 without auth token', async ({ request }) => {
    const res = await request.post('/api/auth/change-password', {
      data: { currentPassword: 'old', newPassword: 'new' },
    });
    expect(res.status()).toBe(401);
  });
});
