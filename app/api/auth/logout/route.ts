import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(process.env.WEBSITE_URL as string);
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: new Date(0),
  });
  return response;
}
