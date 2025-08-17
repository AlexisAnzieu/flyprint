import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_WEBSITE_ID = "UrOy6TyGKtoiVnXE3ktOw";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Match /admin and /[flyboothId]/admin paths
  if (pathname.startsWith("/admin") || /^\/[^/]+\/admin/.test(pathname)) {
    const token = req.cookies.get("auth_token")?.value;
    const redirectTo = encodeURIComponent(
      `${process.env.WEBSITE_URL}/api/auth/callback?redirectUrl=${req.nextUrl.pathname + req.nextUrl.search}`
    );
    const authUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}/login?id=${AUTH_WEBSITE_ID}&callbackUrl=${redirectTo}`;
    if (!token) {
      return NextResponse.redirect(authUrl);
    }
    try {
      // Verify JWT
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      await jwtVerify(token, secret);
      // Token is valid, allow access
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(authUrl);
    }
  }
  // Allow other paths
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/:flyboothId/admin/:path*"],
};
