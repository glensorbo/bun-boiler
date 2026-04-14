import { wsClients } from './wsClients';
import { logger } from '@backend/features/telemetry/logger';
import type { WsData } from './types/WsData';
import type { ServerWebSocket } from 'bun';

export const wsHandlers = {
  open(ws: ServerWebSocket<WsData>): void {
    wsClients.add(ws);
    logger.debug('WebSocket client connected', {
      userId: ws.data.userId,
      clientCount: wsClients.size,
    });
  },

  close(ws: ServerWebSocket<WsData>): void {
    wsClients.delete(ws);
    logger.debug('WebSocket client disconnected', {
      userId: ws.data.userId,
      clientCount: wsClients.size,
    });
  },

  message(_ws: ServerWebSocket<WsData>, _msg: string | Buffer): void {
    // server-push only — client messages are ignored
  },
};
