import { serve } from 'bun';

import index from '../public/index.html';
import { pingDb } from './db/client';
import { authRoutes } from './routes/authRoutes';
import { integrationsRoutes } from './routes/integrationsRoutes';
import { telemetryRoutes } from './routes/telemetryRoutes';
import { userRoutes } from './routes/userRoutes';
import { wsRoutes } from './routes/wsRoutes';
import { serveProdBuild } from './serveProdBuild.ts';
import { validateEnv } from './utils/env';
import { wsHandlers } from './ws/wsServer';
import { initMail } from '@backend/features/mail';
import { initTelemetry, logger } from '@backend/features/telemetry';

initTelemetry();
initMail();

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
