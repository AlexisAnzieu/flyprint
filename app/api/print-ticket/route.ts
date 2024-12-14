import EscPosEncoder from "esc-pos-encoder";
import { NextResponse } from "next/server";

// Helper function to create lines
function createLine(char: string, length: number) {
  return char.repeat(length);
}

export async function GET(request: Request) {
  try {
    const printer = new EscPosEncoder();
    // Header
    printer
      .align("center")
      .text("L'ATHLETE AFFAME")
      .newline()
      .text("123 RUE STANLEY")
      .newline()
      .text("Montreal, Quebec H2T H2T")
      .newline()
      .text("(514) 555-MOVE")
      .newline()
      .newline()
      .text("** RECU D'ENTRAINEMENT SPECIAL **")
      .newline();

    // Server and table info
    printer
      .align("left")
      .text("Entraineur: Le Pro".padEnd(30) + "Zone: Elite")
      .newline()
      .text("Station: Performance".padEnd(30) + "Athletes: Full")
      .newline()
      .text("Fete de Jonathann - Champion du Jour")
      .newline()
      .text(createLine("-", 45))
      .newline();

    // Order items with fitness puns
    printer
      .text("1 Bol du Marathonien".padEnd(35) + "0.00$")
      .newline()
      .text("2 Special du Sprinteur".padEnd(35) + "0.00$")
      .newline()
      .text("1 Burger de la Performance".padEnd(35) + "0.00$")
      .newline()
      .text("3 Shake Energie Pure".padEnd(35) + "0.00$")
      .newline()
      .text("2 Bol de l'Athlete".padEnd(35) + "0.00$")
      .newline()
      .text("1 Power Pack CrossFit".padEnd(35) + "0.00$")
      .newline()
      .newline();

    // Totals
    printer
      .text("Sous-total:".padEnd(35) + "0.00$")
      .newline()
      .text("TPS 5%:".padEnd(35) + "0.00$")
      .newline()
      .text("TVQ 9.975%:".padEnd(35) + "0.00$")
      .newline()
      .text(createLine("-", 45))
      .newline()
      .text("TOTAL:".padEnd(35) + "GRATUIT!")
      .newline()
      .text(createLine("*", 45))
      .newline()
      .newline();

    // Footer
    printer
      .newline()
      .align("center")
      .text("Ceci est un bon pour un resto")
      .newline()
      .text("en ma compagnie")
      .newline()
      .text("A la date de ton choix")
      .newline()
      .newline()
      .newline()
      .text(new Date().toLocaleString("fr-CA"))
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
