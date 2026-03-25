import { serve } from 'bun';

import index from '../public/index.html';
import { userRoutes } from './routes/userRoutes';
import { serveProdBuild } from './serveProdBuild.ts';

const isProduction = process.env.NODE_ENV === 'production';

const server = serve({
  routes: {
    '/healthcheck': {
      GET: () => new Response('OK'),
    },

    ...userRoutes,

    '/*': isProduction
      ? async (req) => serveProdBuild(new URL(req.url).pathname)
      : index,
  },

  development: !isProduction && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
