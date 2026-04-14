/**
 * Generates the runtime config object content from BUN_PUBLIC_* env vars.
 * Used to expose server-side env vars to the frontend at runtime.
 *
 * See frontend/config.ts for the read side.
 */
const buildRuntimeConfig = () => ({
  BUN_PUBLIC_OPENPANEL_CLIENT_ID: Bun.env.BUN_PUBLIC_OPENPANEL_CLIENT_ID ?? '',
  BUN_PUBLIC_OPENPANEL_API_URL: Bun.env.BUN_PUBLIC_OPENPANEL_API_URL ?? '',
  BUN_PUBLIC_OTEL_SERVICE_NAME: Bun.env.BUN_PUBLIC_OTEL_SERVICE_NAME ?? '',
  BUN_PUBLIC_ENABLE_SIGNUP: Bun.env.BUN_PUBLIC_ENABLE_SIGNUP ?? '',
});

/**
 * Returns the config as a JS statement: `window.__APP_CONFIG__={...};`
 * Served by GET /api/app-config.js so the browser can load it before the
 * main module bundle runs.
 */
export const buildRuntimeConfigJs = (): string =>
  `window.__APP_CONFIG__=${JSON.stringify(buildRuntimeConfig())};`;

/**
 * Returns a <script> block that writes the runtime config into
 * window.__APP_CONFIG__.  Injected inline into HTML responses by
 * serveProdBuild.ts so production deployments get zero-RTT config.
 */
export const buildRuntimeConfigScript = (): string =>
  `<script>${buildRuntimeConfigJs()}</script>`;
