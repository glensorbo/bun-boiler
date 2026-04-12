# ◀️ leftNav

Left-side navigation for the dashboard shell.

| File                          | Purpose                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `components/leftNav.tsx`      | Responsive drawer with brand link, collapse toggle, primary nav, and footer `VersionBadge` |
| `components/versionBadge.tsx` | Displays `BUN_PUBLIC_APP_VERSION` and env from `GET /api/version`; hidden when collapsed   |

## Rules

- Must stay shell-level; page-specific filters and metrics belong in page content.
- Must use layout constants (`DRAWER_WIDTH`, `COLLAPSED_DRAWER_WIDTH`) for sizing and theme `sidebar`, `border`, and `gradient` tokens for styling.
- Must keep nav items focused on primary app sections; admin nav items must be gated by role.
- Must not fetch data or render dashboard content cards (exception: `VersionBadge` reads `GET /api/version`).

See `../../layout/README.md` for shell composition rules.
