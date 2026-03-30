# Running E2E Tests on Coolify

This doc covers your options for running the Docker e2e suite in production-adjacent environments — specifically around Coolify deployments.

---

## What we already have

Every PR against `main` runs the self-contained Docker e2e suite via GitHub Actions (`.github/workflows/e2e.yml`). It spins up its own Postgres + app + Playwright stack in RAM, runs all tests, and tears itself down. **Nothing touches your real infrastructure.**

This is the primary gate. If it passes, the code is safe to merge and deploy.

---

## The Coolify question

Once code lands on `main`, Coolify picks it up via webhook and deploys. The question is: do you also want e2e running against the **live deployed app** — and if so, when?

Two realistic options:

---

## Option A — Nightly run on `main` (Recommended to start)

A scheduled GitHub Actions workflow runs the self-contained Docker suite against the `main` branch every night.

**Why:**

- Zero Coolify configuration — fully self-contained
- Catches regressions that slipped in without a PR (dependency updates, Dependabot merges, etc.)
- Same controlled environment as CI — results are deterministic and easy to debug

**How:**

Add a schedule trigger to `e2e.yml` (or a separate `e2e-nightly.yml`):

```yaml
on:
  schedule:
    - cron: '0 2 * * *' # 02:00 UTC every night
  workflow_dispatch: # also allow manual runs
```

That's it. No secrets, no Coolify changes needed.

---

## Option B — Post-deploy smoke test against the live app

After Coolify deploys, trigger Playwright to run against the real URL (`https://your-app.example.com`). This catches deployment-specific failures that the Docker suite can't — environment config bugs, secrets not set, infrastructure issues, etc.

**The challenge:** Coolify doesn't natively trigger GitHub Actions after a deploy. You need a small bridge.

### Step-by-step

**1. Add a `workflow_dispatch` trigger with an input to `e2e.yml`:**

```yaml
on:
  workflow_dispatch:
    inputs:
      target_url:
        description: 'Base URL to test against (leave empty for self-contained Docker run)'
        required: false
        default: ''
```

**2. Pass `target_url` as `E2E_BASE_URL` when running tests:**

In the workflow step, if `target_url` is set, point Playwright at it directly instead of running the Docker compose stack:

```yaml
- name: 🧪 Run E2E tests
  run: |
    if [ -n "${{ inputs.target_url }}" ]; then
      # Smoke test against live deployment — Playwright only, no Docker compose
      npx playwright test --config playwright.config.ts
    else
      ./scripts/e2e-ci.sh
    fi
  env:
    E2E_BASE_URL: ${{ inputs.target_url }}
    E2E_TEST_EMAIL: ${{ secrets.E2E_TEST_EMAIL }}
    E2E_TEST_PASSWORD: ${{ secrets.E2E_TEST_PASSWORD }}
```

> ⚠️ The live app needs a real e2e test user. You'll need to create one manually (or via a deploy-time seed) and store its credentials as GitHub secrets.

**3. Create a Coolify post-deploy webhook:**

In Coolify, go to your application → **Webhooks** → add a **Post-deploy webhook** pointing at the GitHub API:

```
POST https://api.github.com/repos/{owner}/{repo}/actions/workflows/e2e.yml/dispatches
```

With headers:

```
Authorization: Bearer <GitHub PAT with workflow scope>
Content-Type: application/json
```

And body:

```json
{
  "ref": "main",
  "inputs": {
    "target_url": "https://your-app.example.com"
  }
}
```

Coolify sends this after every successful deploy → GitHub runs the smoke tests → you get a pass/fail in the Actions tab.

---

## Comparison

|                  | Nightly self-contained       | Post-deploy smoke test                  |
| ---------------- | ---------------------------- | --------------------------------------- |
| Effort to set up | Minimal (one cron line)      | Moderate (PAT, webhook, live test user) |
| Tests real infra | ❌                           | ✅                                      |
| Deterministic    | ✅                           | ⚠️ (depends on live data/state)         |
| Blocks deploys   | ❌                           | ❌ (runs after)                         |
| Useful for       | Catching regressions on main | Catching deploy/config failures         |

---

## Recommendation

Start with **Option A** (nightly cron). It's a one-liner change, gives you continuous coverage of `main`, and uses the same controlled environment you trust from CI.

Add **Option B** later when you have a reason to distrust deployments specifically — e.g. if you start using environment-specific secrets, feature flags, or infrastructure that can drift from the Docker stack.
