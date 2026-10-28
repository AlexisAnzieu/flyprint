import EscPosEncoder from "esc-pos-encoder";
import { NextResponse } from "next/server";
import { GAGES } from "@/lib/gages";

// Called from the public killer-party page, which lives on another domain.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// GS V 66/65 0: feed just enough to bring the last line past the cutter, then
// cut (partial/full). Uses far less paper than a fixed run of newlines.
const FEED_AND_PARTIAL_CUT = [0x1d, 0x56, 66, 0];
const FEED_AND_FULL_CUT = [0x1d, 0x56, 65, 0];
// ESC @: reset the printer once per job. Sent on its own because the encoder
// puts its centering spaces before the reset, which then clears them.
const INITIALIZE = [0x1b, 0x40];

// Utility function to remove accents from a string
function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function pickRandom<T>(items: T[], count: number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  try {
    const { count } = await request.json();

    if (!Number.isInteger(count) || count < 1 || count > GAGES.length) {
      return NextResponse.json(
        { error: `count must be an integer between 1 and ${GAGES.length}` },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const gages = pickRandom(GAGES, count);

    // One slip per gage, partially cut so they stay attached and tear off by hand.
    // Two blank lines under each line of text, nothing more, to save paper. Each
    // slip is encoded on its own so the cut command lands at the start of a
    // line, where the printer accepts it.
    const bytes: number[] = [...INITIALIZE];
    gages.forEach((gage, index) => {
      const isLast = index === gages.length - 1;
      const slip = new EscPosEncoder()
        .align("center")
        .text("KILLER PARTY")
        .newline()
        .text("-".repeat(20))
        .newline()
        .newline()
        .newline()
        .bold(true)
        .text(removeAccents(gage))
        .bold(false)
        .newline()
        .newline()
        .newline()
        .encode();
      bytes.push(...slip, ...(isLast ? FEED_AND_FULL_CUT : FEED_AND_PARTIAL_CUT));
    });

    const printData = Uint8Array.from(bytes);
    const printerResponse = await fetch(
      `${process.env.PRINTER_URL as string}/raw-print`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: new Blob([printData]),
      }
    );

    if (!printerResponse.ok) {
      throw new Error(`Printer error! status: ${printerResponse.status}`);
    }

    return NextResponse.json(
      { success: true, printed: gages.length },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("Printing error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
