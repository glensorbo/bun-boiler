# 🔧 Shared

Reusable dashboard primitives, fallback UI, refreshed skeletons, and cross-cutting services with no business logic.

## Components

| File                            | Purpose                                                   |
| ------------------------------- | --------------------------------------------------------- |
| `components/dashboardPage.tsx`  | Standard dashboard page header and action row             |
| `components/surfaceCard.tsx`    | Base panel for dashboard sections                         |
| `components/statCard.tsx`       | Compact KPI card                                          |
| `components/dashboardTable.tsx` | Table wrapper for dashboard pages                         |
| `components/emptyState.tsx`     | Empty panel state with optional action                    |
| `components/miniTrend.tsx`      | Small bar-trend visual                                    |
| `components/progressList.tsx`   | Labeled progress rows                                     |
| `components/skeleton.tsx`       | Table, list, and card skeletons tuned to the refreshed UI |
| `components/errorBoundary.tsx`  | App-level render fallback                                 |

## Services

| File                    | Purpose                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `services/wsManager.ts` | `WsManager<TMessage>` class with `connect(token)`, `disconnect()`, `subscribe(listener)`, and exponential backoff reconnect. Exports `wsManager` singleton for `/api/ws`. |

## Hooks

| File                    | Purpose                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `hooks/useWebSocket.ts` | Connects/disconnects `wsManager` based on the Redux auth token. Returns `{ lastMessage, connected }`. |

### Typed WebSocket messages

`wsManager` is typed as `WsManager<Record<string, unknown>>`. For a domain-specific message shape, instantiate a dedicated manager:

```ts
import { WsManager } from '@frontend/shared/services/wsManager';

type OrderMessage = { type: 'order.updated'; orderId: string };
export const orderWsManager = new WsManager<OrderMessage>('/api/ws');
```

## Rules

- Must build new dashboard pages from these primitives before creating feature-local shells or cards.
- Must keep shared components small, generic, and composable.
- Must use theme tokens and semantic props; must not hard-code dashboard colors.
- Components must not import feature modules, API clients, or Redux state.
- Must treat `../pages/homePage.tsx` as the reference composition for dashboard spacing and density.
- Must use `useWebSocket` for generic WS status; must create a typed `WsManager` instance for domain-specific message shapes.
- Must not call `wsManager.connect()` or `wsManager.disconnect()` directly in components — use `useWebSocket` instead.

See `../README.md` for the frontend overview.
