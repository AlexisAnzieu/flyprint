import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "auth_token";

export type UnifiedTokenPayload = TokenPayload & {
  cid: string;
};

export type InternalTokenPayload = TokenPayload & {
  id: string;
};

type TokenPayload = {
  email: string;
  name: string;
};

export async function getUserFromToken<T>(token: string): Promise<T> {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const verified = await jwtVerify(token, secret);
  return verified.payload as T;
}

export async function getUserFromCookie() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get(AUTH_COOKIE_NAME)?.value;
  return token ? getUserFromToken(token) : null;
}

export async function createToken(payload: InternalTokenPayload) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(secret);
}
