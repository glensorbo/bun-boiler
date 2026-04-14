import type { BunRequest } from './BunRequest';
import type { Ctx } from './Ctx';

/**
 * A middleware function.
 * Return null to continue the chain, or a Response to short-circuit.
 */
export type MiddlewareFn = (
  req: BunRequest,
  ctx: Ctx,
) => Response | null | Promise<Response | null>;
