import { versionController } from '@backend/controllers/versionController';

/**
 * Version Routes
 * Spread into Bun.serve() routes: { ...versionRoutes }
 */
export const versionRoutes = {
  '/api/version': {
    GET: () => versionController.getVersion(),
  },
};
