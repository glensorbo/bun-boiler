import type { WsData } from './types/WsData';
import type { ServerWebSocket } from 'bun';

export const wsClients = new Set<ServerWebSocket<WsData>>();
