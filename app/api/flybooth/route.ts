import { getUserFromCookie } from "@/lib/auth";
import prisma from "@/prisma/db";
import { Flybooth } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

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
  const user = await getUserFromCookie();

  const flybooth = await prisma.flybooth.create({
    data: { name, users: { connect: { id: user.id } } },
  });

  return NextResponse.json(flybooth);
}
