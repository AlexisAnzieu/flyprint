import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/prisma/db";
import { queue } from "@/lib/queue";

export async function GET(req: Request) {
  noStore();

  try {
    const { searchParams } = new URL(req.url);
    const pictureUrl = searchParams.get("pictureUrl");
    const flyboothId = searchParams.get("flyboothId");

    if (!pictureUrl || !flyboothId) {
      return Response.json({ error: "pictureUrl & flyboothId are required" });
    }

    const logoUrl = pictureUrl.replace(
      /\/flybooth\/halloween\/.*/,
      "/flybooth/halloween/admin/logo"
    );

    const date = new Date();
    const dateString = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const flybooth = await prisma.flybooth.findUnique({
      where: {
        id: flyboothId,
      },
      include: {
        texts: {
          select: {
            content: true,
          },
        },
      },
    });

    if (flybooth?.hasTime) {
      flybooth.texts.push({ content: "" });
      flybooth.texts.push({ content: dateString });
    }

    // const res = await fetch("http://printer.local:9100/print", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     pictureUrl,
    //     logoUrl,
    //     texts: ["H2Terreur Nocturne", dateString],
    //   }),
    // });

    const res = await queue.enqueueJSON({
      url: "http://printer.h2t.club/print",
      body: {
        pictureUrl,
        logoUrl,
        texts: flybooth?.texts.map((text) => text.content),
      },
      retries: 1,
    });
    return Response.json(res);
  } catch (error) {
    return Response.json({ error: "Flyprint API error" + error });
  }
}
