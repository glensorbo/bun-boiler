# 🔌 WebSocket (frontend)

Client-side WebSocket feature: a module-level singleton manager, a React Router layout provider, and two hooks.

| File                    | Purpose                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `wsManager.ts`          | Module-level singleton. Owns the socket, reconnect logic, and event dispatch.                         |
| `wsProvider.tsx`        | React Router layout component. Connects/disconnects on token change; schedules proactive JWT refresh. |
| `hooks/useWebSocket.ts` | Subscribe to a WS message type inside a component.                                                    |
| `hooks/useWsStatus.ts`  | Read the current connection status; re-renders on change.                                             |

## Message format

All messages are JSON-serialised `WsMessage<T>` (matches the backend type):

```ts
{ type: string; payload?: unknown }
```

`wsManager` dispatches by `type` — only handlers registered for that exact string are called.

## `wsManager`

Module-level singleton; import and call directly (no React required).

```ts
import { wsManager } from './wsManager';
```

| Method           | Signature                                                           | Notes                                                                                 |
| ---------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `connect`        | `(token: string) => void`                                           | Opens the socket at `/api/ws?token=<token>`. Replaces any existing connection.        |
| `disconnect`     | `() => void`                                                        | Closes the socket and cancels any pending reconnect. Sets status to `'disconnected'`. |
| `on`             | `(type: string, handler: (payload: unknown) => void) => () => void` | Registers a handler for a message type. Returns an unsubscribe function.              |
| `onStatusChange` | `(handler: (status: WsStatus) => void) => () => void`               | Registers a status change handler. Returns an unsubscribe function.                   |
| `getStatus`      | `() => WsStatus`                                                    | Returns the current status synchronously.                                             |

`WsStatus` is `'connected' | 'connecting' | 'disconnected'`.

Reconnect uses exponential backoff — delay is `min(1000 × 2ⁿ, 30 000) ms`. Reconnect is cancelled on an explicit `disconnect()`.

## `WsProvider`

React Router layout component. Sits between `ProtectedRoute` and `PageLayout` in the route tree:

```
ProtectedRoute
  └─ WsProvider          ← renders <Outlet />
       └─ PageLayout
            └─ page routes
```

**Responsibilities:**

- Calls `wsManager.connect(token)` when `token` enters Redux state; calls `wsManager.disconnect()` when it leaves.
- Decodes `exp` from the JWT (base64 decode of the second segment — no library) and schedules a `setTimeout` to refresh **2 minutes before expiry**. On refresh, dispatches `setToken` with the new token from `useRefreshTokenMutation`.

Do not mount `WsProvider` outside `ProtectedRoute` — it reads `state.auth.token` and assumes authentication is already enforced above it.

## `useWebSocket(type, handler)`

Subscribe to a WS message type inside a component.

```ts
useWebSocket('order.updated', (payload) => {
  // handle payload
});
```

- Subscribes when `type` changes (not on every render). The handler is stored in a `ref` so you can safely pass an inline function without triggering re-subscription.
- Returns `void`. Cleanup is handled automatically on unmount.

## `useWsStatus()`

Returns the current `WsStatus` and re-renders when it changes.

```ts
const status = useWsStatus(); // 'connected' | 'connecting' | 'disconnected'
```

## Rules

- Must call `wsManager.connect` / `disconnect` only through `WsProvider` — do not call them from arbitrary components.
- Must use `useWebSocket` for per-component subscriptions — must not call `wsManager.on` directly inside components.
- Must call the unsubscribe function returned by `wsManager.on` / `onStatusChange` when subscribing outside React (hooks handle this automatically).
- Must not add message-sending logic — the backend is push-only.
