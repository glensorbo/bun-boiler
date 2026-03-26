import { jwtVerify } from 'jose';

import type { AppJwtPayload, TokenType } from '@backend/types/appJwtPayload';

const getSecret = () => new TextEncoder().encode(Bun.env.JWT_SECRET ?? '');

export const verifyToken = async (
  token: string,
): Promise<AppJwtPayload | null> => {
  const [result, err] = await jwtVerify(token, getSecret())
    .then((r) => [r, null] as const)
    .catch((e: unknown) => [null, e] as const);

  if (err !== null || result === null) {
    return null;
  }

  const { payload } = result;
  if (
    !payload.sub ||
    typeof payload.email !== 'string' ||
    typeof payload.tokenType !== 'string'
  ) {
    return null;
  }

  return {
    sub: payload.sub,
    email: payload.email,
    tokenType: payload.tokenType as TokenType,
  };
};
