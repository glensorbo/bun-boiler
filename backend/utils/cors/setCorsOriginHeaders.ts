export const setCorsOriginHeaders = (
  origin: string,
  headers: Headers,
): void => {
  const allowed = Bun.env.CORS_ORIGIN ?? '*';

  if (allowed === '*') {
    headers.set('Access-Control-Allow-Origin', '*');
  } else {
    const origins = allowed.split(',').map((o) => o.trim());
    if (origins.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin);
      headers.set('Vary', 'Origin');
    }
  }
};
