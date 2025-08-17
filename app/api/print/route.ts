import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/prisma/db";
import { NextResponse } from "next/server";
import EscPosEncoder from "esc-pos-encoder";
import { createCanvas } from "canvas";

// Utility function to remove accents from a string
function removeAccents(str: string): string {
  if (!str) return str;
  // Remove diacritics using a compatible regex
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

interface PrintParams {
  hasTime: boolean;
  pictureUrl?: string;
  texts?: string[];
  userMessage?: string;
  logoUrl?: string;
  logoWidth: number;
  logoHeight: number;
}

async function getImage({
  pictureUrl,
  width,
  height,
  rotate,
}: {
  pictureUrl: string;
  width: number;
  height: number;
  rotate?: number;
}) {
  const { loadImage } = await import("canvas");

  try {
    const image = await loadImage(pictureUrl);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    if (rotate) {
      // Rotate if needed
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.translate(-height / 2, -width / 2);
      ctx.drawImage(image, 0, 0, height, width);
    } else {
      ctx.drawImage(image, 0, 0, width, height);
    }

    return canvas;
  } catch (error) {
    console.error("Error loading image:", error);
    throw error;
  }
}

async function encodePrintData({
  hasTime,
  pictureUrl,
  texts,
  userMessage,
  logoUrl,
  logoWidth,
  logoHeight,
}: PrintParams) {
  const PICTURE_WIDTH = 528;
  const PICTURE_HEIGHT = 712;

  const date = new Date();
  const dateString = date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Montreal",
  });

  // Remove accents from userMessage and texts
  const printableUserMessage = userMessage
    ? removeAccents(userMessage)
    : undefined;
  const printableTexts = texts ? texts.map((t) => removeAccents(t)) : undefined;

  // @ts-ignore
  let encoder = new EscPosEncoder({
    createCanvas,
  });
  try {
    encoder = encoder.initialize().align("center");

    if (logoUrl) {
      encoder = encoder
        .image(
          await getImage({
            pictureUrl: logoUrl,
            width: logoWidth,
            height: logoHeight,
          }),
          logoWidth,
          logoHeight,
          "atkinson"
        )
        .newline()
        .newline();
    }
    if (pictureUrl) {
      encoder = encoder.image(
        await getImage({
          pictureUrl,
          width: PICTURE_WIDTH,
          height: PICTURE_HEIGHT,
          rotate: 90,
        }),
        PICTURE_WIDTH,
        PICTURE_HEIGHT,
        "atkinson"
      );
    }

    // Print user message first (before admin texts)
    if (printableUserMessage && printableUserMessage.trim()) {
      encoder.newline();
      encoder.line(printableUserMessage.trim());
    }

    if (printableTexts) {
      encoder.newline();
      printableTexts.map((text) => encoder.line(text));
    }

    if (hasTime) {
      encoder.newline();
      encoder.line(dateString);
    }

    return encoder.newline().newline().newline().newline().cut().encode();
  } catch (err: any) {
    console.error("Failed to encode print data:", err.message || err);
    return null;
  }
}

export async function GET(req: Request) {
  noStore();

  try {
    const { searchParams } = new URL(req.url);
    const pictureUrl = searchParams.get("pictureUrl");
    const flyboothId = searchParams.get("flyboothId");
    const userMessage = searchParams.get("userMessage");

    if (!pictureUrl || !flyboothId) {
      return Response.json({ error: "pictureUrl & flyboothId are required" });
    }

    const logoUrl = pictureUrl.replace(
      /\/flybooth\/[^\/]+\/.*/,
      `/flybooth/${flyboothId}/admin/logo`
    );

    const [flybooth, _] = await Promise.all([
      prisma.flybooth.findUnique({
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
      }),
      prisma.print.create({
        data: {
          pictureUrl,
          flyboothId: flyboothId,
          message: userMessage?.trim() || null,
        },
      }),
    ]);

    if (!flybooth) {
      return Response.json({ error: "Flybooth not found" }, { status: 404 });
    }

    const printParams = {
      hasTime: flybooth.hasTime,
      pictureUrl,
      userMessage: userMessage || undefined,
      logoUrl,
      logoWidth: flybooth.logoWidth,
      logoHeight: flybooth.logoHeight,
      texts: flybooth.texts
        .map((text) => text.content)
        .filter((text): text is string => text !== null),
    };

    const encodedData = await encodePrintData(printParams);

    if (!encodedData) {
      return Response.json({ error: "Failed to encode print data" });
    }

    const res = await fetch(`${process.env.PRINTER_URL as string}/raw-print`, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: encodedData,
    });

    if (!res.ok) {
      throw new Error(`Printer error! status: ${res.status}`);
    }

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
