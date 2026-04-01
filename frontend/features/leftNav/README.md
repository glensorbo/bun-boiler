# ◀️ leftNav

Left-side navigation for the dashboard shell.

| File                     | Purpose                                                                   |
| ------------------------ | ------------------------------------------------------------------------- |
| `components/leftNav.tsx` | Responsive drawer with brand block, primary nav, and footer guidance card |

## Rules

- Must stay shell-level; page-specific filters and metrics belong in page content.
- Must use layout constants for sizing and theme `sidebar`, `border`, and `gradient` tokens for styling.
- Must keep nav items focused on primary app sections.
- Must not fetch data or render dashboard content cards.

See `../../layout/README.md` for shell composition rules.
