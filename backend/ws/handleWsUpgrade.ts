import { logger } from '@backend/features/telemetry/logger';
import { verifyToken } from '@backend/utils/auth';

import type { WsData } from './types/WsData';
import type { Server } from 'bun';

export async function handleWsUpgrade(
  req: Request,
  server: Server<WsData>,
): Promise<Response | undefined> {
  const token = new URL(req.url).searchParams.get('token');

  if (!token) {
    logger.warn('WebSocket upgrade rejected: missing token');
    return new Response('Unauthorized', { status: 401 });
  }

  const result = await verifyToken(token);
  if (result.error || result.data.tokenType !== 'auth') {
    logger.warn('WebSocket upgrade rejected: invalid token');
    return new Response('Unauthorized', { status: 401 });
  }

  const upgraded = server.upgrade(req, { data: { userId: result.data.sub } });
  if (!upgraded) {
    logger.error('WebSocket upgrade failed');
    return new Response('WebSocket upgrade failed', { status: 500 });
  }

  return undefined;
}
