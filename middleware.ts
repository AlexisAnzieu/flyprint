import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect("https://www.flybooth.app/fr/printer");
  }
  return NextResponse.next();
}
