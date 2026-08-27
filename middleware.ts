import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE_NAME } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/admin") ||
    /^\/[^/]+\/admin/.test(pathname)
  ) {
    const loginUrl = new URL("/api/auth/login", req.url);
    loginUrl.searchParams.set("redirectUrl", `${pathname}${search}`);
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(loginUrl);
    }
    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(loginUrl);
    }
  }
  // Allow other paths
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/:flyboothId/admin", "/:flyboothId/admin/:path*"],
};
