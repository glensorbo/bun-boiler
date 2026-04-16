# 🎨 Frontend Code Style

## 📁 Folder structure

```
frontend/
├── features/
│   └── <feature>/                   (e.g. login, topNav, users)
│       ├── components/
│       │   ├── tests/
│       │   └── someComponent.tsx
│       ├── hooks/
│       │   ├── tests/
│       │   └── useSomeHook.ts
│       ├── logic/
│       │   ├── tests/
│       │   └── someFunction.ts
│       ├── state/
│       │   ├── tests/
│       │   └── someSlice.ts
│       ├── types/
│       │   └── SomeType.ts
│       └── README.md
├── layout/                          (shell layout, drawer config)
├── pages/                           (one file per route, wires features together)
├── providers/                       (theme, auth, toast)
├── redux/
│   ├── api/                         (RTK Query endpoints)
│   ├── middleware/
│   ├── slices/                      (global client-side state)
│   └── store.ts
├── shared/                          (no business logic should live here)
│   ├── components/                  (reusable UI primitives)
│   │   └── tests/
│   ├── hooks/
│   │   └── tests/
│   ├── logic/
│   │   └── tests/
│   ├── types/
│   ├── tests/                       (shared test helpers, e.g. renderWithTheme)
├── lib/                             (re-exported 3rd party libraries if needed)
├── config.ts
├── main.tsx
├── router.tsx
└── test-setup.ts
```

## 📦 Files & exports

- One file exports exactly **one** thing — a component, hook, function, or type
- The filename is always the `camelCase` version of the export name

```
loginForm.tsx        → exports LoginForm
useLogin.ts          → exports useLogin
validateLoginForm.ts → exports validateLoginForm
loginSchema.ts       → exports loginSchema
```

- Components use **named exports**; `export default` not to be used in this repo.

```tsx
// ✅ Page file
export const HomePage = () => <main>...</main>;

// ✅ Component file (named export only)
export const UserTable = () => <table>...</table>;

// ❌ No default export for any file
export default UserTable;
```

## ✍️ Functions & arrow functions

Always use arrow functions — never `function` declarations for components or hooks:

```tsx
// ✅ Arrow function component
export const LoginForm = () => {
  return <form>...</form>;
};

// ✅ Arrow function hook
export const useLogin = () => {
  return { submit };
};

// ❌ Never use function declarations
export function LoginForm() { ... }
```

## 🗂️ Imports

- Use **path aliases** when crossing layer boundaries — never `../../` relative imports:
  - `@frontend/*` — anything inside `frontend/`
  - `@backend/*` — anything inside `backend/`
- Relative imports are fine within the same feature or directory
- Group imports: external packages first, then path aliases, then relative
- Use `import type` for type-only imports (`verbatimModuleSyntax` is enabled)

```ts
// ✅
import type { User } from '@frontend/features/users/types/User';
import { userService } from '@frontend/features/users/userService';
import { formatDate } from './formatDate';

// ❌
import { User } from '../../../features/users/types/User';
```

## 🔄 State management

| Need                       | Where                          |
| -------------------------- | ------------------------------ |
| Server data (fetch/mutate) | RTK Query in `redux/api/`      |
| Global client-side state   | Redux slice in `redux/slices/` |
| Component-local state      | `useState` / `useReducer`      |

Features should **not** import from each other. If two features need to share state, lift it to `redux/slices/`.

## ⏳ Loading states

Prefer **skeleton loaders** over spinners for data fetches. Shared skeletons live in `frontend/shared/components/skeleton.tsx`:

```tsx
// ✅ Skeleton while data loads
const { data, isLoading } = useGetUsersQuery();
if (isLoading) return <TableSkeleton rows={5} cols={3} />;

// ✅ Button loading prop for mutations
<Button loading={isSubmitting} type="submit">
  Save
</Button>;

// ❌ Don't use a spinner for data fetches
if (isLoading) return <CircularProgress />;
```

| Component       | Use case       |
| --------------- | -------------- |
| `TableSkeleton` | Data tables    |
| `ListSkeleton`  | Vertical lists |
| `CardSkeleton`  | Card grids     |

## 📅 Date & time

Always use the shared dayjs instance — it has plugins pre-loaded (`relativeTime`, `utc`, `timezone`, etc.):

```ts
// ✅
import { dayjs } from '@frontend/lib/dayjs';

// ❌ Never import directly from the package
import dayjs from 'dayjs';
```

| Use case    | Format             | Example            |
| ----------- | ------------------ | ------------------ |
| Date only   | `YYYY-MM-DD`       | `2024-03-15`       |
| Date + time | `YYYY-MM-DD HH:mm` | `2024-03-15 14:30` |
| Time only   | `HH:mm`            | `14:30`            |
| Relative    | `.fromNow()`       | `2 hours ago`      |

## 🌍 Environment variables

All `BUN_PUBLIC_*` vars are read through `frontend/config.ts` — the single source of truth. Never access `process.env` or `import.meta.env` directly outside that file:

```ts
// ✅
import { config } from '@frontend/config';
const clientId = config.openpanel.clientId;

// ❌
const clientId = process.env.BUN_PUBLIC_OPENPANEL_CLIENT_ID;
```

## ⚛️ React Compiler

All components must be **React Compiler-compliant**. The compiler runs at build time and the ESLint plugin enforces compliance at lint time — violations will fail `bun run cc`:

```sh
bun run lint:compiler   # check for React Compiler violations
```

Follow the Rules of Hooks strictly and avoid patterns that mutate state during render.

## 🛡️ Error boundaries

The app root is wrapped in `<ErrorBoundary>`. For sections that should fail independently without crashing the whole page, add their own boundary:

```tsx
import { ErrorBoundary } from '@frontend/shared/components/errorBoundary';

<ErrorBoundary>
  <RiskyWidget />
</ErrorBoundary>;
```

## 🔧 General rules

- Files should be small, focused, and testable
- No business logic inside `shared/` — only reusable UI primitives and utilities
- Prefer creating code in `features/`, unless a more logical location exists per the folder structure above
- Features must not import from each other

## 🧪 Testing React components

Only test a component when there is **behaviour worth verifying** — for example:

- A form that should block submission when validation fails
- UI that should update visibly in response to a user action

Do **not** test components just to hit a coverage number.

Extract logic and hooks from components and test them directly — they are easier to test in isolation and give you better signal:

```ts
// ✅ Test the extracted hook or logic function directly
test('returns error when email is empty', () => {
  expect(validateLoginForm({ email: '', password: 'x' })).toHaveProperty('email');
});

// ❌ Don't test pure rendering or MUI internals via component tests
test('renders the submit button', () => { ... });
```
