import { serve } from 'bun';

import index from '../public/index.html';
import { userController } from './controllers/userController';
import { serveProdBuild } from './serveProdBuild.ts';

const isProduction = process.env.NODE_ENV === 'production';

const server = serve({
  routes: {
    '/healthcheck': {
      async GET(_req) {
        return new Response('OK');
      },
    },

    '/api/user': {
      GET: () => userController.getUsers(),
    },

    '/api/user/:id': {
      GET: (req) => userController.getUserById(req.params.id),
    },

    '/*': isProduction
      ? async (req) => serveProdBuild(new URL(req.url).pathname)
      : index,
  },

  development: !isProduction && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
