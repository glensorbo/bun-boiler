# 📊 Analytics

OpenPanel analytics integration for the frontend. Opt-in via environment variables — fully inactive for developers who don't set them. Includes automatic SPA pageview tracking and session replay.

## Enabling Analytics

1. Start the local OpenPanel stack:
   ```sh
   docker compose -f docker-compose.openpanel.yml up -d
   ```
2. Open the dashboard at `http://localhost:8091`, create an account, and add a new project.
3. Lock registration — set `OP_ALLOW_REGISTRATION=false` in `.env` and restart the API:
   ```sh
   docker compose -f docker-compose.openpanel.yml restart op-api
   ```
4. Note the **Client ID** assigned to your project.
5. Add to your `.env`:

   ```env
   BUN_PUBLIC_OPENPANEL_CLIENT_ID=your-client-id-here
   BUN_PUBLIC_OPENPANEL_API_URL=http://localhost:3001
   ```

   **Use port `3001` (the API directly), not `8091` (the Caddy proxy).**
   The Caddy proxy only forwards `/api/*` to the API service; the SDK's
   tracking endpoints are at the root and would route to the dashboard UI
   instead. The dashboard remains accessible at `http://localhost:8091`.

   These vars are read by `frontend/config.ts`. In production, `serveProdBuild.ts`
   also injects them into every HTML response via `window.__APP_CONFIG__`, so they
   work in Coolify and similar platforms that supply env vars at runtime — no image
   rebuild required. `config.ts` prefers `window.__APP_CONFIG__` over
   `import.meta.env`, so runtime values always win.

6. Restart `bun dev`.

## Tracking Custom Events

Use the `useAnalytics` hook — never import `@openpanel/web` directly in components:

```tsx
import { useAnalytics } from '@frontend/features/analytics/useAnalytics';

const { trackEvent } = useAnalytics();

// In a click handler:
trackEvent('button_clicked', { label: 'Save' });
```

## Session Replay

Session replay is enabled automatically when `BUN_PUBLIC_OPENPANEL_CLIENT_ID` is set. All input fields are masked by default (`maskAllInputs: true`). To exclude specific elements from recording, add the `data-openpanel-replay-mask` attribute.

## Files

| File                    | Purpose                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| `analyticsProvider.tsx` | Initialises OpenPanel SDK with session replay; exports `AnalyticsProvider` |
| `useAnalytics.ts`       | Hook exposing `trackEvent`, `identify`, and `clear`                        |
| `../../config.ts`       | Shared env-var wrapper — `config.openpanel.clientId/apiUrl` read from here |
