import { wsClients } from './wsClients';

export const getConnectedClientCount = (): number => wsClients.size;
