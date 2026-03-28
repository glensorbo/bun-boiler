import { authController } from '../controllers/authController';
import { withMiddleware } from '../middleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { signupTokenMiddleware } from '../middleware/signupTokenMiddleware';

export const authRoutes = {
  '/api/auth/login': {
    POST: withMiddleware()((req) => authController.login(req)),
  },
  '/api/auth/create-user': {
    POST: withMiddleware(authMiddleware)((req) =>
      authController.createUser(req),
    ),
  },
  '/api/auth/set-password': {
    POST: withMiddleware(signupTokenMiddleware)((req, ctx) =>
      authController.setPassword(req, ctx),
    ),
  },
  '/api/auth/change-password': {
    POST: withMiddleware(authMiddleware)((req, ctx) =>
      authController.changePassword(req, ctx),
    ),
  },
  '/api/auth/refresh': {
    POST: withMiddleware()((req) => authController.refresh(req)),
  },
  '/api/auth/logout': {
    POST: withMiddleware()((req) => authController.logout(req)),
  },
};
