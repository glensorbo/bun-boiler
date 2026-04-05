# 📄 Pages

Route files that compose features and shared dashboard primitives.

| File               | Route    | Purpose                                                       |
| ------------------ | -------- | ------------------------------------------------------------- |
| `homePage.tsx`     | `/`      | Showcase dashboard and reference composition for future pages |
| `loginPage.tsx`    | `/login` | Authentication entry route                                    |
| `notFoundPage.tsx` | `*`      | Fallback route for unknown paths                              |

## Rules

- Must keep pages thin; reusable UI and logic belong in `../shared/` or feature folders.
- Must use `homePage.tsx` as the reference for dashboard spacing, card mix, and table composition.
- Must build new dashboard routes with shared primitives before adding bespoke wrappers.
- Must not import one page from another.
- Must keep filenames lowerCamelCase and aligned with route intent.

See `../shared/README.md` for the dashboard building blocks.
