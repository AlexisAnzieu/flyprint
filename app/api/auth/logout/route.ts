import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(process.env.WEBSITE_URL as string);
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: new Date(0),
  });
  return response;
}
