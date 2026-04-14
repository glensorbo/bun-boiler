import { join } from 'path';
import { buildRuntimeConfigScript } from './utils/runtimeConfig';

// BUN_PUBLIC_* vars are inlined by Bun's bundler at build time, which means
// they're empty when the image is built without them (e.g. Coolify supplies
// env vars at runtime, not build time).  To fix this, we inject a small
// <script> block into every HTML response that writes the live values from
// Bun.env into window.__APP_CONFIG__.  frontend/config.ts prefers this object
// over import.meta.env, so runtime values always win.
const runtimeConfigScript = buildRuntimeConfigScript();

const serveHtml = async (
  file: ReturnType<typeof Bun.file>,
): Promise<Response> => {
  const html = (await file.text()).replace(
    '</head>',
    `${runtimeConfigScript}</head>`,
  );
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
};

export const serveProdBuild = async (pathname: string): Promise<Response> => {
  // Remove leading slash and handle root
  let filePath = pathname === '/' ? 'index.html' : pathname.slice(1);

  // For client-side routing, serve index.html for non-file requests
  if (!filePath.includes('.')) {
    filePath = 'index.html';
  }

  const fullPath = join(process.cwd(), 'dist', filePath);
  const file = Bun.file(fullPath);

  const exists = await file.exists();
  if (!exists) {
    // Serve index.html for 404s (client-side routing)
    return serveHtml(Bun.file(join(process.cwd(), 'dist', 'index.html')));
  }

  if (filePath.endsWith('.html')) {
    return serveHtml(file);
  }

  return new Response(file);
};
