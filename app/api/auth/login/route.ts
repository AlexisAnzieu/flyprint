import { NextRequest, NextResponse } from "next/server";
import { codeChallengeS256, oidcConfig, randomUrlSafe } from "@/lib/oidc";

const TEMP_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 600,
};

export async function GET(req: NextRequest) {
  const oidc = oidcConfig();
  const redirectUrl =
    new URL(req.url).searchParams.get("redirectUrl") || "/dashboard";

  const state = randomUrlSafe(16);
  const verifier = randomUrlSafe(32);
  const challenge = codeChallengeS256(verifier);

  const authUrl = new URL(oidc.authorizationEndpoint);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", oidc.clientId);
  authUrl.searchParams.set("redirect_uri", oidc.redirectUri);
  authUrl.searchParams.set("scope", oidc.scope);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  const res = NextResponse.redirect(authUrl);
  res.cookies.set("oidc_state", state, TEMP_COOKIE_OPTS);
  res.cookies.set("oidc_verifier", verifier, TEMP_COOKIE_OPTS);
  res.cookies.set("oidc_redirect", redirectUrl, TEMP_COOKIE_OPTS);
  return res;
}
