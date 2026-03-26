import { SignJWT } from 'jose';

const getSecret = () => new TextEncoder().encode(Bun.env.JWT_SECRET ?? '');

export const signAuthToken = (userId: string, email: string): Promise<string> =>
  new SignJWT({ email, tokenType: 'auth' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
