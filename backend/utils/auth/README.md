# 🔐 Auth Utils

JWT signing/verification and cryptographic passphrase generation. Requires `JWT_SECRET` env var to be set.

> 📦 Types (`AppJwtPayload`, `TokenType`) live in `@backend/types/auth` — not in this folder.

| File                 | Export               | Description                                                   |
| -------------------- | -------------------- | ------------------------------------------------------------- |
| `passphrase.ts`      | `generatePassphrase` | Generates a cryptographically random base64url passphrase     |
| `signSignupToken.ts` | `signSignupToken`    | Signs a short-lived (1h) signup JWT (`tokenType: 'signup'`)   |
| `signAuthToken.ts`   | `signAuthToken`      | Signs a long-lived (7d) auth JWT (`tokenType: 'auth'`)        |
| `verifyToken.ts`     | `verifyToken`        | Verifies and decodes a JWT, returns `AppJwtPayload` or `null` |

> ⚠️ `JWT_SECRET` must be set in the environment or tokens will be signed/verified with an empty secret.
