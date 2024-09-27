import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: Request) {
  noStore();

  try {
    const { searchParams } = new URL(req.url);
    const pictureUrl = searchParams.get("pictureUrl");

    if (!pictureUrl) {
      return Response.json({ error: "pictureUrl is required" });
    }

    const res = await fetch(
      `https://printer.h2t.club/print?pictureUrl=${pictureUrl}`
    );

    if (res.status === 502) {
      return Response.json({ error: "Printer server offline" });
    }

    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: data.message });
    }

    return Response.json(data.message);
  } catch (error) {
    return Response.json({ error: "Flyprint API error" });
  }
}
