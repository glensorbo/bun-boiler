# 📊 Analytics

Rybbit analytics integration for the frontend. Opt-in via environment variables — fully inactive for developers who don't set them.

## Enabling Analytics

1. Start the local Rybbit stack:
   ```sh
   docker compose -f docker-compose.rybbit.yml up -d
   ```
2. Open the dashboard at `http://localhost:8090`, create an account, and add a new site.
3. Note the **Site ID** assigned to your site.
4. Add to your `.env`:
   ```env
   BUN_PUBLIC_RYBBIT_HOST=http://localhost:8090
   BUN_PUBLIC_RYBBIT_SITE_ID=<your-site-id>
   ```
5. Restart `bun dev`.

## Tracking Custom Events

Use the `useAnalytics` hook — never import `@rybbit/js` directly in components:

```tsx
import { useAnalytics } from '@frontend/features/analytics/useAnalytics';

const { trackEvent } = useAnalytics();

// In a click handler:
trackEvent('button_clicked', { label: 'Save' });
```

## Files

| File                    | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| `analyticsProvider.tsx` | Initialises Rybbit; tracks route changes automatically |
| `useAnalytics.ts`       | Hook exposing `trackEvent` and `trackPageview`         |
