import { createUserController } from '@backend/controllers/userController';
import { withMiddleware } from '@backend/middleware';
import { authMiddleware } from '@backend/middleware/authMiddleware';
import { requireRole } from '@backend/middleware/requireRole';
import { userService } from '@backend/services/userService';

import type { AppJwtPayload } from '@backend/types/appJwtPayload';

const userController = createUserController(userService);

/**
 * User Routes
 * All /api/user routes. Protected by authMiddleware.
 * Spread into Bun.serve() routes: { ...userRoutes }
 */
export const userRoutes = {
  '/api/user': {
    GET: withMiddleware(authMiddleware)(() => userController.getUsers()),
  },

  '/api/user/:id': {
    GET: withMiddleware(authMiddleware)((req) => {
      const id = req.params['id'] ?? '';
      return userController.getUserById(id);
    }),
    DELETE: withMiddleware(
      authMiddleware,
      requireRole('admin'),
    )((req, ctx) => {
      const id = req.params['id'] ?? '';
      const requestingUser = ctx.user as AppJwtPayload;
      return userController.deleteUser(requestingUser.sub, id);
    }),
  },

  '/api/user/:id/role': {
    PATCH: withMiddleware(
      authMiddleware,
      requireRole('admin'),
    )((req, ctx) => {
      const id = req.params['id'] ?? '';
      const requestingUser = ctx.user as AppJwtPayload;
      return userController.updateUserRole(requestingUser.sub, id, req);
    }),
  },

  '/api/user/:id/reset-password': {
    POST: withMiddleware(
      authMiddleware,
      requireRole('admin'),
    )((req) => {
      const id = req.params['id'] ?? '';
      return userController.resetUserPassword(id);
    }),
  },
};
