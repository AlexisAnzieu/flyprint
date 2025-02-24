import EscPosEncoder from "esc-pos-encoder";
import { NextResponse } from "next/server";

// Helper function to create lines
function createLine(char: string, length: number) {
  return char.repeat(length);
}

interface SaladOrder {
  name: string;
  base: string;
  toppings: string[];
  protein: string;
  dressing: string;
}

export async function POST(request: Request) {
  try {
    const order: SaladOrder = await request.json();
    const printer = new EscPosEncoder();

    // Header
    printer
      .align("center")
      .text("LA FABRIQUE À SALADES")
      .newline()
      .text("Montreal, Quebec")
      .newline()
      .text(createLine("=", 45))
      .newline()
      .align("left")
      .newline()
      .text("VOTRE SALADE PERSONNALISÉE")
      .newline()
      .text(createLine("-", 45))
      .newline()
      .text("Client:")
      .newline()
      .text(`  ${order.name}`)
      .newline()
      .newline()
      .text("Base:")
      .newline()
      .text(`  ${order.base}`)
      .newline()
      .newline()
      .text("Garnitures:")
      .newline();

    order.toppings.forEach((topping) => {
      printer.text(`  ${topping}`).newline();
    });

    printer
      .newline()
      .text("Protéine:")
      .newline()
      .text(`  ${order.protein}`)
      .newline()
      .newline()
      .text("Sauce:")
      .newline()
      .text(`  ${order.dressing}`)
      .newline()
      .text(createLine("-", 45))
      .newline()
      .newline()
      .newline()
      .align("center")
      .text(
        new Date().toLocaleString("fr-CA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      )
      .newline()
      .newline()
      .newline()
      .newline()
      .newline()
      .newline()
      .cut();

    // Generate the ESC/POS commands
    const result = printer.encode();

    const printerResponse = await fetch("https://printer.h2t.club/raw-print", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: result,
    });

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
