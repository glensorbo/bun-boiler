import { handleWsUpgrade } from '@backend/ws/wsServer';

export const wsRoutes = {
  '/api/ws': {
    GET: handleWsUpgrade,
  },
};
