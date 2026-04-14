import type { TokenType } from './tokenType';
import type { UserRole } from './userRole';

export type AppJwtPayload = {
  sub: string;
  email: string;
  name: string;
  tokenType: TokenType;
  role: UserRole;
};
