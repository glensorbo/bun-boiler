import { describe, test, expect, afterEach } from 'bun:test';
import { createIntegrationsController } from '@backend/controllers/integrationsController';
import type { MailOptions } from '@backend/features/mail/types/mailOptions';

const makeDeps = (overrides?: {
  mailHealthCheck?: () => Promise<boolean>;
  sendMail?: (options: MailOptions) => Promise<void>;
  userRepository?: {
    getById: (id: string) => Promise<{ email: string } | undefined>;
  };
  getConnectedClientCount?: () => number;
}) => ({
  mailHealthCheck: overrides?.mailHealthCheck ?? (async () => false),
  sendMail: overrides?.sendMail ?? (async () => {}),
  userRepository: overrides?.userRepository ?? {
    getById: async () => undefined,
  },
  getConnectedClientCount: overrides?.getConnectedClientCount ?? (() => 0),
});

const originalSmtp = Bun.env.SMTP_HOST;
const originalOtel = Bun.env.OTEL_ENDPOINT;
const originalOpenpanel = Bun.env.BUN_PUBLIC_OPENPANEL_CLIENT_ID;

afterEach(() => {
  if (originalSmtp !== undefined) {
    Bun.env.SMTP_HOST = originalSmtp;
  } else {
    delete Bun.env.SMTP_HOST;
  }
  if (originalOtel !== undefined) {
    Bun.env.OTEL_ENDPOINT = originalOtel;
  } else {
    delete Bun.env.OTEL_ENDPOINT;
  }
  if (originalOpenpanel !== undefined) {
    Bun.env.BUN_PUBLIC_OPENPANEL_CLIENT_ID = originalOpenpanel;
  } else {
    delete Bun.env.BUN_PUBLIC_OPENPANEL_CLIENT_ID;
  }
});

describe('IntegrationsController', () => {
  describe('getStatus', () => {
    test('returns 200', async () => {
      delete Bun.env.SMTP_HOST;
      delete Bun.env.OTEL_ENDPOINT;
      delete Bun.env.BUN_PUBLIC_OPENPANEL_CLIENT_ID;

      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      expect(response.status).toBe(200);
    });

    test('returns JSON content type', async () => {
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      expect(response.headers.get('content-type')).toContain(
        'application/json',
      );
    });

    test('response body contains an integrations array', async () => {
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: { integrations: unknown[] };
      };
      expect(Array.isArray(body.data.integrations)).toBe(true);
    });

    test('returns exactly 4 integrations', async () => {
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: { integrations: { id: string }[] };
      };
      expect(body.data.integrations.length).toBe(4);
    });

    test('includes smtp, otel, openpanel and websocket integrations', async () => {
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: { integrations: { id: string }[] };
      };
      const ids = body.data.integrations.map((i) => i.id);
      expect(ids).toContain('smtp');
      expect(ids).toContain('otel');
      expect(ids).toContain('openpanel');
      expect(ids).toContain('websocket');
    });

    test('smtp status is "disabled" when SMTP_HOST is not set', async () => {
      delete Bun.env.SMTP_HOST;
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: { integrations: { id: string; status: string }[] };
      };
      const smtp = body.data.integrations.find((i) => i.id === 'smtp');
      expect(smtp?.status).toBe('disabled');
    });

    test('smtp config is null when disabled', async () => {
      delete Bun.env.SMTP_HOST;
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: { integrations: { id: string; config: unknown }[] };
      };
      const smtp = body.data.integrations.find((i) => i.id === 'smtp');
      expect(smtp?.config).toBeNull();
    });

    test('smtp is "healthy" when SMTP_HOST is set and mailHealthCheck returns true', async () => {
      Bun.env.SMTP_HOST = 'smtp.example.com';
      const ctrl = createIntegrationsController(
        makeDeps({ mailHealthCheck: async () => true }),
      );
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: { integrations: { id: string; status: string }[] };
      };
      const smtp = body.data.integrations.find((i) => i.id === 'smtp');
      expect(smtp?.status).toBe('healthy');
    });

    test('smtp is "degraded" when SMTP_HOST is set but mailHealthCheck returns false', async () => {
      Bun.env.SMTP_HOST = 'smtp.example.com';
      const ctrl = createIntegrationsController(
        makeDeps({ mailHealthCheck: async () => false }),
      );
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: { integrations: { id: string; status: string }[] };
      };
      const smtp = body.data.integrations.find((i) => i.id === 'smtp');
      expect(smtp?.status).toBe('degraded');
    });

    test('otel status is "disabled" when OTEL_ENDPOINT is not set', async () => {
      delete Bun.env.OTEL_ENDPOINT;
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: { integrations: { id: string; status: string }[] };
      };
      const otel = body.data.integrations.find((i) => i.id === 'otel');
      expect(otel?.status).toBe('disabled');
    });

    test('openpanel status is "disabled" when BUN_PUBLIC_OPENPANEL_CLIENT_ID is not set', async () => {
      delete Bun.env.BUN_PUBLIC_OPENPANEL_CLIENT_ID;
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: { integrations: { id: string; status: string }[] };
      };
      const op = body.data.integrations.find((i) => i.id === 'openpanel');
      expect(op?.status).toBe('disabled');
    });

    test('websocket is always healthy', async () => {
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: { integrations: { id: string; status: string }[] };
      };
      const ws = body.data.integrations.find((i) => i.id === 'websocket');
      expect(ws?.status).toBe('healthy');
    });

    test('websocket config reflects injected connectedClients count', async () => {
      const ctrl = createIntegrationsController(
        makeDeps({ getConnectedClientCount: () => 7 }),
      );
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: {
          integrations: { id: string; config: Record<string, string> | null }[];
        };
      };
      const ws = body.data.integrations.find((i) => i.id === 'websocket');
      expect(ws?.config?.connectedClients).toBe('7');
    });

    test('each integration has id, name, description, status and config fields', async () => {
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.getStatus();
      const body = (await response.json()) as {
        data: {
          integrations: {
            id: string;
            name: string;
            description: string;
            status: string;
            config: unknown;
          }[];
        };
      };
      for (const integration of body.data.integrations) {
        expect(integration).toHaveProperty('id');
        expect(integration).toHaveProperty('name');
        expect(integration).toHaveProperty('description');
        expect(integration).toHaveProperty('status');
        expect(integration).toHaveProperty('config');
      }
    });
  });

  describe('sendTestEmail', () => {
    test('returns 400 when SMTP_HOST is not set', async () => {
      delete Bun.env.SMTP_HOST;
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.sendTestEmail('any-user-id');
      expect(response.status).toBe(400);
    });

    test('400 body message indicates mail is not enabled', async () => {
      delete Bun.env.SMTP_HOST;
      const ctrl = createIntegrationsController(makeDeps());
      const response = await ctrl.sendTestEmail('any-user-id');
      const body = (await response.json()) as { message: string };
      expect(body.message).toContain('not enabled');
    });

    test('returns 404 when SMTP_HOST is set but user does not exist', async () => {
      Bun.env.SMTP_HOST = 'smtp.example.com';
      const ctrl = createIntegrationsController(
        makeDeps({ userRepository: { getById: async () => undefined } }),
      );
      const response = await ctrl.sendTestEmail(
        '00000000-0000-0000-0000-000000000000',
      );
      expect(response.status).toBe(404);
    });

    test('returns 200 when SMTP_HOST is set, user exists, and sendMail succeeds', async () => {
      Bun.env.SMTP_HOST = 'smtp.example.com';
      const ctrl = createIntegrationsController(
        makeDeps({
          userRepository: {
            getById: async () => ({ email: 'test@example.com' }),
          },
          sendMail: async () => {},
        }),
      );
      const response = await ctrl.sendTestEmail('some-user-id');
      expect(response.status).toBe(200);
    });

    test('returns 500 when sendMail throws', async () => {
      Bun.env.SMTP_HOST = 'smtp.example.com';
      const ctrl = createIntegrationsController(
        makeDeps({
          userRepository: {
            getById: async () => ({ email: 'test@example.com' }),
          },
          sendMail: async () => {
            throw new Error('SMTP connection refused');
          },
        }),
      );
      const response = await ctrl.sendTestEmail('some-user-id');
      expect(response.status).toBe(500);
    });
  });
});
