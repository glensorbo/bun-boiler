import { useEffect, useState } from 'react';
import { wsManager } from '../wsManager';
import type { WsStatus } from '../wsManager';

export const useWsStatus = (): WsStatus => {
  const [status, setStatus] = useState<WsStatus>(wsManager.getStatus());

  useEffect(() => wsManager.onStatusChange(setStatus), []);

  return status;
};
