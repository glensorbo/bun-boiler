# 🔌 WebSocket Server

Bun-native WebSocket server. All clients authenticate via JWT before upgrade; connected clients are tracked in a module-level `Set`.

| File          | Purpose                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| `wsServer.ts` | `handleWsUpgrade`, `wsHandlers`, `broadcast()`, `getConnectedClientCount()`, and exported `WsMessage<T>` type |

## Authentication flow

Clients pass a valid auth JWT as a query param:

```
ws://host/api/ws?token=<jwt>
```

`handleWsUpgrade` verifies the token with `verifyToken` and rejects with `401` if it is missing or invalid. On success, `server.upgrade()` stores `userId` (decoded `sub`) in `ws.data` for the lifetime of the connection.

## Message type

`WsMessage<T>` is exported from `wsServer.ts` and matches the shape the frontend `wsManager` expects:

```ts
type WsMessage<T = unknown> = {
  type: string;
  payload?: T;
};
```

Import it when typing broadcast calls or constructing messages in service code.

## Broadcasting messages

Call `broadcast<T>(message)` from anywhere in the backend to push JSON to all connected clients:

```ts
import { broadcast } from '@backend/ws/wsServer';

broadcast<{ orderId: string }>({ type: 'order.updated', payload: { orderId } });
```

`broadcast` serialises with `JSON.stringify` before sending. Clients receive the raw JSON string.

## Push-only pattern

The server is **push-only**. `wsHandlers.message` intentionally ignores incoming client messages. Add routing logic there only if bidirectional messaging is required.

## Rules

- Must use `broadcast()` for all server-push events — must not access `clients` directly from outside this module.
- Must use `getConnectedClientCount()` to read the live client count — must not read `clients.size` from outside this module.
- Must not add auth logic outside `handleWsUpgrade` — upgrading without a valid token must remain a hard `401`.
- Must keep `wsHandlers` registered as the `websocket` property in `server.ts`; Bun requires exactly one handler object per server instance.
- Must pass a typed object to `broadcast()` — must not pass raw strings.
- Must add a matching entry in `rest/` if a new WS-related HTTP endpoint is introduced.
