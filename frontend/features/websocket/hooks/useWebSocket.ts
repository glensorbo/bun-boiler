import { useEffect, useRef } from 'react';
import { wsManager } from '../wsManager';

export const useWebSocket = (
  type: string,
  handler: (payload: unknown) => void,
): void => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    return wsManager.on(type, (payload) => handlerRef.current(payload));
  }, [type]);
};
