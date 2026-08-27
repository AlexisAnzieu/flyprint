import { NextRequest, NextResponse } from "next/server";
import { createRemoteJWKSet, jwtVerify } from "jose";
import prisma from "@/prisma/db";
import { AUTH_COOKIE_NAME, createToken } from "@/lib/auth";
import { oidcConfig } from "@/lib/oidc";

const DEFAULT_REDIRECT_URL = "/dashboard";
const TEMP_COOKIES = ["oidc_state", "oidc_verifier", "oidc_redirect"];

export async function GET(req: NextRequest) {
  const oidc = oidcConfig();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const authError = searchParams.get("error");

  if (authError) {
    return new NextResponse(`Authorization failed: ${authError}`, {
      status: 400,
    });
  }
  if (!code || !state) {
    return new NextResponse("Missing code or state", { status: 400 });
  }

  const expectedState = req.cookies.get("oidc_state")?.value;
  const verifier = req.cookies.get("oidc_verifier")?.value;
  const redirectUrl =
    req.cookies.get("oidc_redirect")?.value || DEFAULT_REDIRECT_URL;
  if (!expectedState || !verifier || expectedState !== state) {
    return new NextResponse("Invalid state", { status: 400 });
  }

  try {
    const basic = Buffer.from(
      `${oidc.clientId}:${oidc.clientSecret}`
    ).toString("base64");
    const tokenRes = await fetch(oidc.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basic}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: oidc.redirectUri,
        code_verifier: verifier,
      }),
    });
    if (!tokenRes.ok) {
      return new NextResponse("Token exchange failed", { status: 401 });
    }
    const tokens = (await tokenRes.json()) as {
      id_token?: string;
      access_token?: string;
    };
    if (!tokens.id_token) {
      return new NextResponse("Missing id_token", { status: 401 });
    }

    const jwks = createRemoteJWKSet(new URL(oidc.jwksUri));
    const { payload } = await jwtVerify(tokens.id_token, jwks, {
      audience: oidc.clientId,
    });
    if (
      typeof payload.iss !== "string" ||
      !payload.iss.startsWith(oidc.authUrl)
    ) {
      return new NextResponse("Invalid token issuer", { status: 401 });
    }
    const sub = String(payload.sub);

    let email =
      typeof payload.email === "string" ? payload.email : undefined;
    let name = typeof payload.name === "string" ? payload.name : undefined;
    if ((!email || !name) && tokens.access_token) {
      const userinfoRes = await fetch(oidc.userinfoEndpoint, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      if (userinfoRes.ok) {
        const info = (await userinfoRes.json()) as {
          email?: string;
          name?: string;
        };
        email = email ?? info.email;
        name = name ?? info.name;
      }
    }

    const user = await prisma.user.upsert({
      where: { unifiedId: sub },
      update: {},
      create: {
        unifiedId: sub,
        email: email ?? sub,
        name: name ?? "User",
      },
    });

    const sessionToken = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.redirect(`${oidc.websiteUrl}${redirectUrl}`);
    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    for (const cookie of TEMP_COOKIES) {
      response.cookies.delete(cookie);
    }
    return response;
  } catch (err) {
    console.error("Auth callback error", err);
    return new NextResponse("Authentication failed", { status: 401 });
  }
}
