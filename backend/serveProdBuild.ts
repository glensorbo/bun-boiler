import { join } from 'path';

export const serveProdBuild = async (pathname: string): Promise<Response> => {
  let filePath = pathname === '/' ? 'index.html' : pathname.slice(1);

  // For client-side routing, serve index.html for non-file requests
  if (!filePath.includes('.')) {
    filePath = 'index.html';
  }

  const fullPath = join(process.cwd(), 'dist', filePath);
  const file = Bun.file(fullPath);

  const exists = await file.exists();
  if (!exists) {
    return new Response(Bun.file(join(process.cwd(), 'dist', 'index.html')));
  }

  return new Response(file);
};
