# 📝 signup

Self-service account creation feature. Only active when `config.enableSignup` is `true`.

## Structure

| File                          | Purpose                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| `components/signupForm.tsx`   | Name, email, password, confirmPassword form — includes honeypot |
| `hooks/useSignup.ts`          | Wraps `useSignupMutation`, dispatches token on success          |
| `logic/signupSchema.ts`       | Client-side Zod schema (mirrors the backend `signupSchema`)     |
| `logic/validateSignupForm.ts` | Runs the schema and returns field-level errors                  |
| `state/signupFormSlice.ts`    | Ephemeral form state (field values, submission status)          |

## Rules

- Must not import from `frontend/features/login/` — no cross-feature imports.
- Must redirect to `/login` on successful signup (token issued immediately).
- Must keep the honeypot field (`website`) hidden via CSS, never via `display:none` or `hidden` attributes — bots skip those.

## Honeypot

`signupForm.tsx` renders a hidden `website` field. If filled, the backend silently returns a fake `200` without creating the account. The frontend handles this response identically to a real success.

## Feature flag

The `/signup` route and the "Create account" link in `loginForm.tsx` are both gated on `config.enableSignup`. Set `BUN_PUBLIC_ENABLE_SIGNUP=true` to enable. Defaults to off (invite-only).
