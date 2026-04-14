import { handleWsUpgrade } from '@backend/ws/handleWsUpgrade';

export const wsRoutes = {
  '/api/ws': {
    GET: handleWsUpgrade,
  },
};
