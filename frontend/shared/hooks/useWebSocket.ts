import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { wsManager } from '@frontend/shared/services/wsManager';
import type { RootState } from '@frontend/redux/store';

type UseWebSocketResult = {
  lastMessage: Record<string, unknown> | null;
  connected: boolean;
};

/**
 * Manages the WebSocket lifecycle tied to the auth token.
 *
 * - Connects automatically when the user is authenticated.
 * - Disconnects and stops reconnecting when the token is cleared.
 * - Returns the most recent message and connection status.
 *
 * For domain-specific messages, create a dedicated WsManager instance
 * (with WsManager from wsManager.ts) and build a matching hook.
 */
export const useWebSocket = (): UseWebSocketResult => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [lastMessage, setLastMessage] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [connected, setConnected] = useState<boolean>(() =>
    wsManager.isConnected(),
  );

  useEffect(() => {
    if (!token) {
      wsManager.disconnect();
      return;
    }

    wsManager.connect(token);
  }, [token]);

  useEffect(() => {
    const unsubscribe = wsManager.subscribe((message, isConnected) => {
      if (message !== null) {
        setLastMessage(message);
      }
      setConnected(isConnected);
    });
    return unsubscribe;
  }, []);

  return { lastMessage, connected };
};
