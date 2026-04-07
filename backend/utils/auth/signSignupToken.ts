import { SignJWT } from 'jose';

const getSecret = () => new TextEncoder().encode(Bun.env.JWT_SECRET ?? '');

export const signSignupToken = (
  userId: string,
  email: string,
  name: string,
): Promise<string> =>
  new SignJWT({ email, name, tokenType: 'signup' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(getSecret());
