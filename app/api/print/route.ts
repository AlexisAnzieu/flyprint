import { unstable_noStore as noStore } from "next/cache";
import { printImage } from "./localprint";

const IS_LOCAL = process.env.NODE_ENV === "development";

export async function GET(req: Request) {
  noStore();

  try {
    console.log("Printing");

    const { searchParams } = new URL(req.url);
    const pictureUrl = searchParams.get("pictureUrl");

    if (!pictureUrl) {
      return Response.json({ error: "pictureUrl is required" });
    }

    if (IS_LOCAL) {
      const res = await printImage(pictureUrl);
      return Response.json(res);
    }

    const res = await fetch(
      `http://70.81.36.26:9100/print?pictureUrl=${pictureUrl}`
    );

    const { error } = await res.json();

    if (error) {
      return Response.json({
        error,
      });
    }

    return Response.json(res);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Erreur sur l'API" });
  }
}
