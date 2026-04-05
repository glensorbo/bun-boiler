import { logger } from '@backend/features/telemetry';
import { verifyToken } from '@backend/utils/auth';

import type { Server, ServerWebSocket } from 'bun';

type WsData = {
  userId: string;
};

const clients = new Set<ServerWebSocket<WsData>>();

export function broadcast(message: unknown): void {
  const msg = JSON.stringify(message);
  for (const client of clients) {
    client.send(msg);
  }
  logger.debug('WS broadcast dispatched', { clientCount: clients.size });
}

export const wsHandlers = {
  open(ws: ServerWebSocket<WsData>): void {
    clients.add(ws);
    logger.debug('WebSocket client connected', {
      userId: ws.data.userId,
      clientCount: clients.size,
    });
  },

  close(ws: ServerWebSocket<WsData>): void {
    clients.delete(ws);
    logger.debug('WebSocket client disconnected', {
      userId: ws.data.userId,
      clientCount: clients.size,
    });
  },

  message(_ws: ServerWebSocket<WsData>, _msg: string | Buffer): void {
    // server-push only — client messages are ignored
  },
};

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
