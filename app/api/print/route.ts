import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/prisma/db";
import { queue } from "@/lib/queue";
import { NextResponse } from "next/server";
import EscPosEncoder from "esc-pos-encoder";
import { isPrintQueueEnabled } from "@/flags";
import { reportValue } from "flags";

export async function GET(req: Request) {
  noStore();

  try {
    const isPrintQueueEnabledValue = await isPrintQueueEnabled();
    reportValue("is-print-queue-enabled", isPrintQueueEnabledValue);

    const { searchParams } = new URL(req.url);
    const pictureUrl = searchParams.get("pictureUrl");
    const flyboothId = searchParams.get("flyboothId");

    if (!pictureUrl || !flyboothId) {
      return Response.json({ error: "pictureUrl & flyboothId are required" });
    }

    const logoUrl = pictureUrl.replace(
      /\/flybooth\/[^\/]+\/.*/,
      `/flybooth/${flyboothId}/admin/logo`
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

    const printData = {
      pictureUrl,
      logoUrl,
      texts: flybooth?.texts.map((text) => text.content),
    };

    const res = await (isPrintQueueEnabledValue
      ? queue.enqueueJSON({
          url: `${process.env.PRINTER_URL as string}/print`,
          body: printData,
          headers: {
            "Content-Type": "application/json",
          },
          retries: 1,
          transform: (data: any) => JSON.stringify(data),
        })
      : fetch(`${process.env.PRINTER_URL as string}/print`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(printData),
        }).then((r) => r.json()));

    return Response.json(res);
  } catch (error) {
    return Response.json({ error: "Flyprint API error" + error });
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const encoder = new EscPosEncoder();

    encoder
      .initialize()
      .align("center")
      .qrcode(text, 2, 8, "h")
      .newline()
      .newline()
      .text(text)
      .newline()
      .newline()
      .newline()
      .newline()
      .newline()
      .newline()
      .cut();

    const printData = encoder.encode();
    const printerResponse = await fetch(
      `${process.env.PRINTER_URL as string}/raw-print`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: printData,
      }
    );

    if (!printerResponse.ok) {
      throw new Error(`Printer error! status: ${printerResponse.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Printing error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
