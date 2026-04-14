import { mailHealthCheck } from '@backend/features/mail/mailHealthCheck';
import { sendMail } from '@backend/features/mail/sendMail';
import { userRepository } from '@backend/repositories/userRepository';
import { notFoundError, successResponse } from '@backend/utils/response';
import { getConnectedClientCount } from '@backend/ws/getConnectedClientCount';

import type { MailOptions } from '@backend/features/mail/types/mailOptions';
import type { ApiErrorResponse } from '@backend/types/apiErrorResponse';

type IntegrationStatus = 'disabled' | 'healthy' | 'degraded';

type Integration = {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  config: Record<string, string> | null;
};

type Deps = {
  mailHealthCheck: () => Promise<boolean>;
  sendMail: (options: MailOptions) => Promise<void>;
  userRepository: {
    getById: (id: string) => Promise<{ email: string } | undefined>;
  };
  getConnectedClientCount: () => number;
};

const checkOtel = async (): Promise<IntegrationStatus> => {
  if (!Bun.env.OTEL_ENDPOINT) {
    return 'disabled';
  }
  try {
    const res = await fetch(Bun.env.OTEL_ENDPOINT, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    return typeof res.status === 'number' ? 'healthy' : 'degraded';
  } catch {
    return 'degraded';
  }
};

const checkOpenpanel = async (): Promise<IntegrationStatus> => {
  if (!Bun.env.BUN_PUBLIC_OPENPANEL_CLIENT_ID) {
    return 'disabled';
  }
  const apiUrl =
    Bun.env.BUN_PUBLIC_OPENPANEL_API_URL ?? 'https://api.openpanel.dev';
  try {
    await fetch(apiUrl, { method: 'GET', signal: AbortSignal.timeout(3000) });
    return 'healthy';
  } catch {
    return 'degraded';
  }
};

export const createIntegrationsController = (deps: Deps) => {
  const checkSmtp = async (): Promise<IntegrationStatus> => {
    if (!Bun.env.SMTP_HOST) {
      return 'disabled';
    }
    const ok = await deps.mailHealthCheck();
    return ok ? 'healthy' : 'degraded';
  };

  return {
    async getStatus(): Promise<Response> {
      const [smtpHealth, otelHealth, openpanelHealth] = await Promise.all([
        checkSmtp(),
        checkOtel(),
        checkOpenpanel(),
      ]);

      const integrations: Integration[] = [
        {
          id: 'smtp',
          name: 'SMTP Email',
          description: 'Transactional email via SMTP.',
          status: smtpHealth,
          config:
            smtpHealth !== 'disabled'
              ? {
                  host: Bun.env.SMTP_HOST ?? '',
                  port: Bun.env.SMTP_PORT ?? '587',
                  secure: Bun.env.SMTP_SECURE ?? 'false',
                  from: Bun.env.SMTP_FROM ?? 'no-reply@localhost',
                }
              : null,
        },
        {
          id: 'otel',
          name: 'OpenTelemetry',
          description:
            'Distributed tracing, metrics, and structured logs via OTLP.',
          status: otelHealth,
          config:
            otelHealth !== 'disabled'
              ? {
                  endpoint: Bun.env.OTEL_ENDPOINT ?? '',
                  serviceName: Bun.env.OTEL_SERVICE_NAME ?? 'bun-boiler',
                }
              : null,
        },
        {
          id: 'openpanel',
          name: 'OpenPanel',
          description: 'Privacy-friendly product analytics for the frontend.',
          status: openpanelHealth,
          config:
            openpanelHealth !== 'disabled'
              ? {
                  apiUrl:
                    Bun.env.BUN_PUBLIC_OPENPANEL_API_URL ??
                    'https://api.openpanel.dev',
                }
              : null,
        },
        {
          id: 'websocket',
          name: 'WebSocket',
          description:
            'Real-time server-push over WebSocket. Auth token required on connect.',
          status: 'healthy',
          config: {
            endpoint: '/api/ws',
            connectedClients: String(deps.getConnectedClientCount()),
          },
        },
      ];

      return successResponse({ integrations });
    },

    async sendTestEmail(userId: string): Promise<Response> {
      if (!Bun.env.SMTP_HOST) {
        const body: ApiErrorResponse = {
          message: 'Mail integration is not enabled',
          status: 400,
          error: { type: 'validation', errors: [] },
        };
        return Response.json(body, { status: 400 });
      }

      const user = await deps.userRepository.getById(userId);
      if (!user) {
        return notFoundError('User not found');
      }

      try {
        await deps.sendMail({
          to: user.email,
          subject: '📧 Test email from bun-boiler',
          html: '<p>This is a test email confirming your SMTP integration is working.</p>',
          text: 'This is a test email confirming your SMTP integration is working.',
        });
      } catch {
        const body: ApiErrorResponse = {
          message: 'Failed to send test email',
          status: 500,
          error: { type: 'validation', errors: [] },
        };
        return Response.json(body, { status: 500 });
      }

      return successResponse({ message: 'Test email sent' }, 200);
    },
  };
};

export const integrationsController = createIntegrationsController({
  mailHealthCheck: mailHealthCheck,
  sendMail,
  userRepository,
  getConnectedClientCount,
});
