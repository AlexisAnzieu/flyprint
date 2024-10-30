import prisma from "@/prisma/db";
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
    select: {
      hasTime: true,
      texts: {
        select: {
          content: true,
        },
      },
    },
  });

  return NextResponse.json(flybooth);
}

export async function POST(req: Request) {
  const { id, texts, hasTime } = await req.json();

  // Ensure the flybooth exists or create it
  await prisma.flybooth.upsert({
    where: { id },
    update: { hasTime },
    create: { id, hasTime },
  });

  // Use a transaction to ensure atomicity
  const newText = await prisma.$transaction(async (prisma) => {
    // Delete all texts attached to the flybooth
    await prisma.text.deleteMany({
      where: { flyboothId: id },
    });

    // Create new texts
    return prisma.text.createMany({
      data: texts.map((content: string) => ({
        content,
        flyboothId: id,
      })),
    });
  });

  return NextResponse.json(newText);
}
