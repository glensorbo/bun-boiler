const MIN_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;

type WsListener<TMessage> = (
  message: TMessage | null,
  connected: boolean,
) => void;

class WsManager<TMessage> {
  private ws: WebSocket | null = null;
  private listeners = new Set<WsListener<TMessage>>();
  private connected = false;
  private currentToken: string | null = null;
  private backoff = MIN_BACKOFF_MS;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private alive = false;
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  connect(token: string): void {
    if (this.currentToken === token && (this.connected || this.ws !== null)) {
      return;
    }
    this.teardown();
    this.currentToken = token;
    this.alive = true;
    this.backoff = MIN_BACKOFF_MS;
    this.openSocket();
  }

  disconnect(): void {
    this.teardown();
    this.currentToken = null;
    this.setConnected(false);
  }

  subscribe(listener: WsListener<TMessage>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  isConnected(): boolean {
    return this.connected;
  }

  private teardown(): void {
    this.alive = false;
    if (this.retryTimer !== null) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }

  private openSocket(): void {
    if (!this.alive || !this.currentToken) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const url = `${protocol}//${window.location.host}${this.path}?token=${this.currentToken}`;
    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      if (!this.alive || this.ws !== ws) {
        ws.close();
        return;
      }
      this.backoff = MIN_BACKOFF_MS;
      this.setConnected(true);
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as TMessage;
        this.notifyMessage(msg);
      } catch {
        // malformed message — ignore
      }
    };

    ws.onclose = () => {
      if (!this.alive || this.ws !== ws) {
        return;
      }
      this.ws = null;
      this.setConnected(false);

      const delay = this.backoff;
      this.backoff = Math.min(this.backoff * 2, MAX_BACKOFF_MS);
      this.retryTimer = setTimeout(() => {
        this.openSocket();
      }, delay);
    };
  }

  private setConnected(value: boolean): void {
    if (this.connected === value) {
      return;
    }
    this.connected = value;
    this.notifyConnected();
  }

  private notifyMessage(message: TMessage): void {
    for (const listener of this.listeners) {
      listener(message, this.connected);
    }
  }

  private notifyConnected(): void {
    for (const listener of this.listeners) {
      listener(null, this.connected);
    }
  }
}

export const wsManager = new WsManager<Record<string, unknown>>('/api/ws');
