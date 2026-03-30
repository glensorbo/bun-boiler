# 🛠️ scripts/

Shell scripts for CI and operational tasks.

| File        | npm script           | Purpose                                                                                           |
| ----------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `e2e-ci.sh` | `bun run e2e:docker` | Tears down → builds → runs Docker E2E stack → always cleans up; exits with Playwright's exit code |

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
