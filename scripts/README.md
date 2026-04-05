# 🛠️ scripts/

Shell scripts for CI and operational tasks.

| File         | Command                         | Purpose                                                                                           |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------------------------- |
| `e2e-ci.sh`  | `bun run e2e:docker`            | Tears down → builds → runs Docker E2E stack → always cleans up; exits with Playwright's exit code |
| `tag.ts`     | `bun tag <patch\|minor\|major>` | Bumps the version from the latest stable tag, pushes a `v*-rc*` tag → triggers test deploy        |
| `release.ts` | `bun run release`               | Promotes the latest RC tag to a stable GitHub Release → triggers prod deploy                      |

## `e2e-ci.sh`

Wraps `docker compose -f docker-compose.e2e.yml`:

1. Tear down any leftover containers from a previous interrupted run
2. `docker compose up --build --exit-code-from e2e`
3. Tear down containers, volumes, and orphans regardless of outcome
4. Exit with Playwright's exit code (so cron / GitHub Actions picks it up correctly)

All compose env vars have safe defaults — the script works without a `.env` file:

```bash
./scripts/e2e-ci.sh
# or override inline:
POSTGRES_PASSWORD=secret JWT_SECRET=s3cr3t ./scripts/e2e-ci.sh
```

See `e2e/README.md` for full Docker E2E documentation.

## `tag.ts`

Reads the latest stable git tag (`vX.Y.Z`), computes the next version, then creates and pushes a `vX.Y.Z-rcN` tag.

```bash
bun tag patch    # v1.2.3 → v1.2.4-rc1
bun tag minor    # v1.2.3 → v1.3.0-rc1
bun tag major    # v1.2.3 → v2.0.0-rc1
```

If an RC already exists for the target version, the counter increments (`-rc2`, `-rc3`, …).

Pushing an RC tag triggers `.github/workflows/deploy-test.yml`, which deploys to the test environment via Coolify.

## `release.ts`

Finds the latest RC tag, promotes it to a stable GitHub Release, and triggers a prod deploy.

```bash
bun run release   # v1.2.0-rc3 → GitHub Release v1.2.0 → prod deploys
```

The script errors if no RC tags exist or if a release for that version already exists. Requires `gh` CLI authenticated with repo write access.

The published GitHub Release triggers `.github/workflows/deploy-prod.yml`, which deploys to the prod environment via Coolify.

## Release workflow

```
bun tag patch       # → v1.2.0-rc1 pushed → test deploys
# iterate as needed:
bun tag patch       # → v1.2.0-rc2 pushed → test deploys again
bun run release     # → GitHub Release v1.2.0 → prod deploys
```
