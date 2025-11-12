import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import {
  AUTH_COOKIE_NAME,
  createToken,
  getUserFromToken,
  UnifiedTokenPayload,
} from "@/lib/auth";

const DEFAULT_REDIRECT_URL = "/dashboard";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const redirectUrl = searchParams.get("redirectUrl") || DEFAULT_REDIRECT_URL;

  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  try {
    const { cid, email, name } = await getUserFromToken<UnifiedTokenPayload>(
      token
    );

    const user = await prisma.user.upsert({
      where: { unifiedId: cid },
      update: {},
      create: {
        unifiedId: cid,
        email,
        name,
      },
    });

    const newToken = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.redirect(
      `${process.env.WEBSITE_URL}${redirectUrl}`
    );
    response.cookies.set(AUTH_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch (err) {
    return new NextResponse("Token verification failed", { status: 401 });
  }
}
