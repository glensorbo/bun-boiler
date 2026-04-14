import { setCorsOriginHeaders } from './setCorsOriginHeaders';

/**
 * Clones the response and attaches Access-Control headers based on CORS_ORIGIN env var.
 * No-op if the request has no Origin header (e.g. same-origin or server-to-server).
 */
export const applyCorsHeaders = (
  req: Request,
  response: Response,
): Response => {
  const origin = req.headers.get('Origin');
  if (!origin) {
    return response;
  }

  const headers = new Headers(response.headers);
  setCorsOriginHeaders(origin, headers);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
