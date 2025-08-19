import prisma from "@/prisma/db";
import { Flybooth } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  noStore();

  const searchParams = req.nextUrl.searchParams;
  const flyboothId = searchParams.get("id");

  if (!flyboothId) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }

  const flybooth = await prisma.flybooth.findUnique({
    where: {
      id: flyboothId,
    },
  });

  return NextResponse.json(flybooth);
}

export async function PUT(req: NextRequest) {
  const payload: Flybooth = await req.json();

  if (!payload.id) {
    return NextResponse.json({ message: "id is required" }, { status: 400 });
  }

  const flybooth = await prisma.flybooth.update({
    where: { id: payload.id },
    data: payload,
  });

  return NextResponse.json(flybooth);
}

export async function POST(req: Request) {
  const { name } = await req.json();

  const flybooth = await prisma.flybooth.create({
    data: { name },
  });

  return NextResponse.json(flybooth);
}
