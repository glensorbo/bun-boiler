/**
 * Generates a <script> block that writes BUN_PUBLIC_* env vars into
 * window.__APP_CONFIG__ at page load time.
 *
 * Injected into every HTML response by serveProdBuild.ts so that
 * frontend/config.ts can read runtime values regardless of when the Docker
 * image was built. See frontend/config.ts for the read side.
 *
 * In dev mode, BUN_PUBLIC_* vars are available via import.meta.env through
 * the [serve.static] env = "BUN_PUBLIC_*" setting in bunfig.toml — no
 * injection needed.
 */
export const buildRuntimeConfigScript = (): string => {
  const cfg = {
    BUN_PUBLIC_OPENPANEL_CLIENT_ID:
      Bun.env.BUN_PUBLIC_OPENPANEL_CLIENT_ID ?? '',
    BUN_PUBLIC_OPENPANEL_API_URL: Bun.env.BUN_PUBLIC_OPENPANEL_API_URL ?? '',
    BUN_PUBLIC_OTEL_SERVICE_NAME: Bun.env.BUN_PUBLIC_OTEL_SERVICE_NAME ?? '',
    BUN_PUBLIC_ENABLE_SIGNUP: Bun.env.BUN_PUBLIC_ENABLE_SIGNUP ?? '',
  };
  return `<script>window.__APP_CONFIG__=${JSON.stringify(cfg)};</script>`;
};
