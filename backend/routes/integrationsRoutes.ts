import { integrationsController } from '@backend/controllers/integrationsController';
import { withMiddleware } from '@backend/middleware';
import { authMiddleware } from '@backend/middleware/authMiddleware';
import { requireRole } from '@backend/middleware/requireRole';

import type { BunRequest, Ctx } from '@backend/middleware';
import type { AppJwtPayload } from '@backend/types/appJwtPayload';

export const integrationsRoutes = {
  '/api/integrations': {
    GET: withMiddleware(
      authMiddleware,
      requireRole('admin'),
    )(() => integrationsController.getStatus()),
  },

  '/api/integrations/mail/test': {
    POST: withMiddleware(
      authMiddleware,
      requireRole('admin'),
    )((_req: BunRequest, ctx: Ctx) => {
      const user = ctx.user as AppJwtPayload;
      return integrationsController.sendTestEmail(user.sub);
    }),
  },
};
