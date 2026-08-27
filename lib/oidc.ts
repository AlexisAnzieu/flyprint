import { createHash, randomBytes } from "node:crypto";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function oidcConfig() {
  const authUrl = required("NEXT_PUBLIC_AUTH_URL").replace(/\/$/, "");
  const websiteUrl = required("WEBSITE_URL").replace(/\/$/, "");
  return {
    authUrl,
    websiteUrl,
    authorizationEndpoint: `${authUrl}/api/auth/oauth2/authorize`,
    tokenEndpoint: `${authUrl}/api/auth/oauth2/token`,
    userinfoEndpoint: `${authUrl}/api/auth/oauth2/userinfo`,
    jwksUri: `${authUrl}/api/auth/jwks`,
    clientId: required("OIDC_CLIENT_ID"),
    clientSecret: required("OIDC_CLIENT_SECRET"),
    redirectUri: `${websiteUrl}/api/auth/callback`,
    scope: "openid profile email",
  };
}

export function randomUrlSafe(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function codeChallengeS256(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}
