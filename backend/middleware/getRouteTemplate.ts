import type { BunRequest } from './types/BunRequest';

/**
 * Rebuilds the route template from the actual URL path by replacing dynamic
 * segment *values* with their `:key` placeholder names.
 *
 * @example
 * // req.url = "http://localhost/api/user/42", req.params = { id: "42" }
 * getRouteTemplate(req) // → "/api/user/:id"
 *
 * // req.url = "http://localhost/api/auth/login", req.params = {}
 * getRouteTemplate(req) // → "/api/auth/login"
 */
export const getRouteTemplate = (req: BunRequest): string => {
  const path = new URL(req.url).pathname;
  let template = path;
  for (const [key, value] of Object.entries(req.params)) {
    template = template.replace(value, `:${key}`);
  }
  return template;
};
