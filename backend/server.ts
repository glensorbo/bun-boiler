import { serve } from 'bun';
import { pingDb } from './db/pingDb';
import { initMailClient } from './features/mail/initMailClient.ts';
import { initTelemetry } from './features/telemetry/initTelemetry.ts';
import { logger } from './features/telemetry/logger.ts';
import { authRoutes } from './routes/authRoutes';
import { integrationsRoutes } from './routes/integrationsRoutes';
import { telemetryRoutes } from './routes/telemetryRoutes';
import { userRoutes } from './routes/userRoutes';
import { versionRoutes } from './routes/versionRoutes';
import { wsRoutes } from './routes/wsRoutes';
import { serveProdBuild } from './serveProdBuild.ts';
import { validateEnv } from './utils/env';
import { buildRuntimeConfigScript } from './utils/runtimeConfig.ts';
import { wsHandlers } from './ws/wsHandlers';

initTelemetry();
initMailClient();

validateEnv();
await pingDb();

const isProduction = process.env.NODE_ENV === 'production';
const port = Number(Bun.env.PORT ?? '3210');

// In dev mode, inject window.__APP_CONFIG__ just like production so
// BUN_PUBLIC_* env vars are available at runtime without a rebuild.
const devIndexHtml = isProduction
  ? null
  : await Bun.file('./public/index.html')
      .text()
      .then((html) =>
        html.replace('</head>', `${buildRuntimeConfigScript()}</head>`),
      );

const server = serve({
  port,
  routes: {
    '/healthcheck': {
      GET: () => new Response('OK'),
    },

    ...userRoutes,
    ...authRoutes,
    ...versionRoutes,
    ...integrationsRoutes,
    ...telemetryRoutes,
    ...wsRoutes,

    '/*': isProduction
      ? async (req) => serveProdBuild(new URL(req.url).pathname)
      : () =>
          new Response(devIndexHtml!, {
            headers: { 'Content-Type': 'text/html' },
          }),
  },

  websocket: wsHandlers,

  development: !isProduction && {
    hmr: true,
    console: true,
  },
});

logger.info(`🚀 Server running at ${server.url}`);
