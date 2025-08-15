import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Match /admin and /[flyboothId]/admin paths
  if (pathname.startsWith("/admin") || /^\/[^/]+\/admin/.test(pathname)) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const redirectTo = encodeURIComponent(
        req.nextUrl.pathname + req.nextUrl.search
      );
      return NextResponse.redirect(
        `${req.nextUrl.origin}/login?redirectUrl=${redirectTo}`
      );
    }
    try {
      // Verify JWT
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      await jwtVerify(token, secret);
      // Token is valid, allow access
      return NextResponse.next();
    } catch {
      // Invalid token, redirect to login
      const redirectTo = encodeURIComponent(
        req.nextUrl.pathname + req.nextUrl.search
      );
      return NextResponse.redirect(
        `${req.nextUrl.origin}/login?redirectUrl=${redirectTo}`
      );
    }
  }
  // Allow other paths
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/:flyboothId/admin/:path*"],
};
