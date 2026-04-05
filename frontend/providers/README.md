# 🎨 Providers

App-wide providers and theme infrastructure for the dashboard UI.

| File                     | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `authProvider.tsx`       | Authentication context                                    |
| `theme.ts`               | Token-based MUI theme and component overrides             |
| `themeAugmentation.d.ts` | TypeScript support for custom palette tokens              |
| `themeProvider.tsx`      | Resolved light/dark mode, MUI provider, and `CssBaseline` |
| `toastProvider.tsx`      | Global toast host                                         |

> **Note:** `AnalyticsProvider` (OpenPanel) lives in `frontend/features/analytics/` and is mounted inside `<BrowserRouter>` in `router.tsx` rather than here, because it needs access to React Router's `useLocation` hook.

## Rules

- Must add new palette tokens in both `theme.ts` and `themeAugmentation.d.ts`.
- Must use `theme.palette.surface`, `border`, `sidebar`, `gradient`, and `chart` for dashboard UI.
- Must not create parallel color systems inside features or pages.
- Must keep providers cross-cutting; feature-specific providers belong in their feature folder.
- Must mount new providers in `main.tsx` and update this table.

See `../README.md` for the frontend overview.
