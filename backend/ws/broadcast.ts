import { wsClients } from './wsClients';
import { logger } from '@backend/features/telemetry/logger';
import type { WsMessage } from './types/WsMessage';

export function broadcast<T = unknown>(message: WsMessage<T>): void {
  const msg = JSON.stringify(message);
  for (const client of wsClients) {
    client.send(msg);
  }
  logger.debug('WS broadcast dispatched', { clientCount: wsClients.size });
}
