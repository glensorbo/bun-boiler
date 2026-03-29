import { serve } from 'bun';

import index from '../public/index.html';
import { pingDb } from './db/client';
import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';
import { serveProdBuild } from './serveProdBuild.ts';
import { validateEnv } from './utils/env';
import { initTelemetry, logger } from '@backend/telemetry';

initTelemetry();

validateEnv();
await pingDb();

const isProduction = process.env.NODE_ENV === 'production';

const server = serve({
  routes: {
    '/healthcheck': {
      GET: () => new Response('OK'),
    },

    ...userRoutes,
    ...authRoutes,

    '/*': isProduction
      ? async (req) => serveProdBuild(new URL(req.url).pathname)
      : index,
  },

  development: !isProduction && {
    hmr: true,
    console: true,
  },
});

logger.info(`🚀 Server running at ${server.url}`);
