import prisma from "@/prisma/db";
import { unstable_noStore as noStore } from "next/cache";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  noStore();

  const searchParams = req.nextUrl.searchParams;
  const flyboothId = searchParams.get("flyboothId");

  const texts = await prisma.text.findMany({
    where: {
      flyboothId: flyboothId,
    },
  });
  return Response.json(texts);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newText = await prisma.text.create({
    data: {
      content: data.text,
      flybooth: {
        connectOrCreate: {
          where: {
            id: data.flyboothId,
          },
          create: {
            id: data.flyboothId,
          },
        },
      },
    },
  });

  return Response.json(newText);
}
