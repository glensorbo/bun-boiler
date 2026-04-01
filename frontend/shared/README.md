# 🔧 Shared

Reusable dashboard primitives, fallback UI, and refreshed skeletons with no business logic.

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

## Rules

- Must build new dashboard pages from these primitives before creating feature-local shells or cards.
- Must keep shared components small, generic, and composable.
- Must use theme tokens and semantic props; must not hard-code dashboard colors.
- Must not import feature modules, API clients, or Redux state.
- Must treat `../pages/homePage.tsx` as the reference composition for dashboard spacing and density.

See `../README.md` for the frontend overview.
