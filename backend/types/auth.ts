export type TokenType = 'signup' | 'auth';

export type AppJwtPayload = {
  sub: string;
  email: string;
  tokenType: TokenType;
};
