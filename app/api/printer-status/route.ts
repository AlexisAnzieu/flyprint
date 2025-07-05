import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.PRINTER_URL as string}`, {
      method: "GET",
      cache: "no-store",
    });
    if (res.status === 200) {
      return NextResponse.json({ connected: true });
    } else {
      return NextResponse.json(
        { connected: false, status: res.status },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { connected: false, error: "fetch_failed" },
      { status: 200 }
    );
  }
}
