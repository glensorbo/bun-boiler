import { describe, test, expect, afterEach } from 'bun:test';

import { versionController } from '@backend/controllers/versionController';

const originalVersion = Bun.env.BUN_PUBLIC_APP_VERSION;
const originalEnv = Bun.env.BUN_PUBLIC_APP_ENV;

afterEach(() => {
  Bun.env.BUN_PUBLIC_APP_VERSION = originalVersion;
  Bun.env.BUN_PUBLIC_APP_ENV = originalEnv;
});

describe('VersionController', () => {
  describe('getVersion', () => {
    test('should return a Response object', () => {
      const response = versionController.getVersion();
      expect(response).toBeInstanceOf(Response);
    });

    test('should return 200 status code', () => {
      const response = versionController.getVersion();
      expect(response.status).toBe(200);
    });

    test('should return JSON content type', () => {
      const response = versionController.getVersion();
      expect(response.headers.get('content-type')).toContain(
        'application/json',
      );
    });

    test('should return version and environment fields', async () => {
      const response = versionController.getVersion();
      const body = (await response.json()) as {
        data: { version: string; environment: string };
      };
      expect(body.data).toHaveProperty('version');
      expect(body.data).toHaveProperty('environment');
    });

    test('should return version from BUN_PUBLIC_APP_VERSION env var', async () => {
      Bun.env.BUN_PUBLIC_APP_VERSION = '1.2.3';
      const response = versionController.getVersion();
      const body = (await response.json()) as { data: { version: string } };
      expect(body.data.version).toBe('1.2.3');
    });

    test('should default version to "dev" when env var is not set', async () => {
      delete Bun.env.BUN_PUBLIC_APP_VERSION;
      const response = versionController.getVersion();
      const body = (await response.json()) as { data: { version: string } };
      expect(body.data.version).toBe('dev');
    });

    test('should return environment from BUN_PUBLIC_APP_ENV env var', async () => {
      Bun.env.BUN_PUBLIC_APP_ENV = 'production';
      const response = versionController.getVersion();
      const body = (await response.json()) as { data: { environment: string } };
      expect(body.data.environment).toBe('production');
    });

    test('should default environment to "dev" when env var is not set', async () => {
      delete Bun.env.BUN_PUBLIC_APP_ENV;
      const response = versionController.getVersion();
      const body = (await response.json()) as { data: { environment: string } };
      expect(body.data.environment).toBe('dev');
    });
  });
});
