import prisma from "@/prisma/db";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  noStore();

  const searchParams = req.nextUrl.searchParams;
  const flyboothId = searchParams.get("flyboothId");

  if (!flyboothId) {
    return NextResponse.json(
      { message: "flyboothId is required" },
      { status: 400 }
    );
  }

  const texts = await prisma.text.findMany({
    where: {
      flyboothId: flyboothId,
    },
  });
  return NextResponse.json(texts);
}

export async function POST(req: Request) {
  const data = await req.json();

  // Ensure the flybooth exists or create it
  const flybooth = prisma.flybooth.upsert({
    where: { id: data.flyboothId },
    update: {},
    create: { id: data.flyboothId },
  });

  // Delete existing texts and create new texts in a transaction
  const newText = await prisma.$transaction([
    prisma.text.deleteMany({
      where: { flyboothId: data.flyboothId },
    }),
    prisma.text.createMany({
      data: data.texts.map((text: string) => ({
        content: text,
        flyboothId: data.flyboothId,
      })),
    }),
  ]);

  await flybooth;

  return NextResponse.json(newText);
}
