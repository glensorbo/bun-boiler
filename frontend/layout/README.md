# 🏗️ Layout

Dashboard shell that composes the persistent nav chrome and route outlet.

| File             | Purpose                                                          |
| ---------------- | ---------------------------------------------------------------- |
| `pageLayout.tsx` | Responsive shell with left nav, top nav, and padded page content |
| `constants.ts`   | Shared shell constants such as `DRAWER_WIDTH`                    |

## Rules

- Must keep layout structural; must not add page metrics, API calls, or feature state here.
- Must compose `leftNav` and `topNav` here instead of building page-specific shells.
- Must change shell-wide spacing and drawer sizing here, not inside pages.
- Must use shared dashboard components inside pages before introducing new layout variants.

See `../README.md` for the frontend overview.
