import { setCorsOriginHeaders } from './setCorsOriginHeaders';

const CORS_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const CORS_HEADERS_ALLOWED = 'Content-Type, Authorization';
const CORS_MAX_AGE = '86400';

/**
 * Returns a 204 No Content response for CORS preflight (OPTIONS) requests,
 * with all required Access-Control headers set.
 */
export const corsPreflightResponse = (req: Request): Response => {
  const origin = req.headers.get('Origin') ?? '';
  const headers = new Headers({
    'Access-Control-Allow-Methods': CORS_METHODS,
    'Access-Control-Allow-Headers': CORS_HEADERS_ALLOWED,
    'Access-Control-Max-Age': CORS_MAX_AGE,
  });

  setCorsOriginHeaders(origin, headers);

  return new Response(null, { status: 204, headers });
};
