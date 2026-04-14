import { serve } from 'bun';

import index from '../public/index.html';
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
import { wsHandlers } from './ws/wsHandlers';

initTelemetry();
initMailClient();

validateEnv();
await pingDb();

const isProduction = process.env.NODE_ENV === 'production';
const port = Number(Bun.env.PORT ?? '3210');

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
      : index,
  },

  websocket: wsHandlers,

  development: !isProduction && {
    hmr: true,
    console: true,
  },
});

logger.info(`🚀 Server running at ${server.url}`);
