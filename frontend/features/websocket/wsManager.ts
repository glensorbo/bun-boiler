export type WsStatus = 'connected' | 'connecting' | 'disconnected';
type MessageHandler = (payload: unknown) => void;
type StatusHandler = (status: WsStatus) => void;

let _ws: WebSocket | null = null;
let _token: string | null = null;
let _status: WsStatus = 'disconnected';
let _reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let _reconnectAttempts = 0;
const _handlers = new Map<string, Set<MessageHandler>>();
const _statusHandlers = new Set<StatusHandler>();

const setStatus = (status: WsStatus): void => {
  _status = status;
  for (const handler of _statusHandlers) {
    handler(status);
  }
};

const getWsUrl = (token: string): string => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/api/ws?token=${encodeURIComponent(token)}`;
};

const scheduleReconnect = (): void => {
  const delay = Math.min(1000 * 2 ** _reconnectAttempts, 30_000);
  _reconnectAttempts++;
  _reconnectTimer = setTimeout(() => {
    if (_token) {
      connect(_token);
    }
  }, delay);
};

const connect = (token: string): void => {
  _token = token;

  if (_reconnectTimer !== null) {
    clearTimeout(_reconnectTimer);
    _reconnectTimer = null;
  }

  if (_ws) {
    _ws.onclose = null;
    _ws.close();
    _ws = null;
  }

  setStatus('connecting');

  const ws = new WebSocket(getWsUrl(token));
  _ws = ws;

  ws.onopen = (): void => {
    _reconnectAttempts = 0;
    setStatus('connected');
  };

  ws.onmessage = (event: MessageEvent): void => {
    try {
      const msg = JSON.parse(event.data as string) as {
        type: string;
        payload?: unknown;
      };
      const typeHandlers = _handlers.get(msg.type);
      if (typeHandlers) {
        for (const handler of typeHandlers) {
          handler(msg.payload);
        }
      }
    } catch {
      // ignore malformed messages
    }
  };

  ws.onclose = (): void => {
    setStatus('disconnected');
    if (_token === null) {
      return;
    }
    scheduleReconnect();
  };

  ws.onerror = (): void => {
    ws.close();
  };
};

const disconnect = (): void => {
  _token = null;

  if (_reconnectTimer !== null) {
    clearTimeout(_reconnectTimer);
    _reconnectTimer = null;
  }

  if (_ws) {
    _ws.onclose = null;
    _ws.close();
    _ws = null;
  }

  setStatus('disconnected');
};

const on = (type: string, handler: MessageHandler): (() => void) => {
  if (!_handlers.has(type)) {
    _handlers.set(type, new Set());
  }
  _handlers.get(type)!.add(handler);
  return () => {
    _handlers.get(type)?.delete(handler);
  };
};

const onStatusChange = (handler: StatusHandler): (() => void) => {
  _statusHandlers.add(handler);
  return () => {
    _statusHandlers.delete(handler);
  };
};

const getStatus = (): WsStatus => _status;

export const wsManager = { connect, disconnect, on, onStatusChange, getStatus };
