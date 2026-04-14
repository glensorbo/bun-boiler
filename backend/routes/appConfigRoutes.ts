import { buildRuntimeConfigJs } from '@backend/utils/runtimeConfig';

/**
 * Serves the runtime config as a plain JavaScript file that sets
 * window.__APP_CONFIG__.  Loaded by <script src="/api/app-config.js"> in
 * public/index.html before the module bundle, so BUN_PUBLIC_* env vars are
 * available at runtime in both dev and production without a rebuild.
 */
export const appConfigRoutes = {
  '/api/app-config.js': {
    GET: () =>
      new Response(buildRuntimeConfigJs(), {
        headers: { 'Content-Type': 'application/javascript' },
      }),
  },
};
