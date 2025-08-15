import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const redirectUrl = searchParams.get("redirectUrl");

  if (token && redirectUrl) {
    const response = NextResponse.redirect(
      `${process.env.WEBSITE_URL}${redirectUrl}`
    );
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  return new NextResponse(
    "<h1>Auth Callback</h1><p>Missing token or redirectUrl.</p>",
    { status: 400, headers: { "Content-Type": "text/html" } }
  );
}
