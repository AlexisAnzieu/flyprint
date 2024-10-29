import { unstable_noStore as noStore } from "next/cache";
import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN as string });

const queue = client.queue({
  queueName: "send-to-printer",
});

export async function GET(req: Request) {
  noStore();

  try {
    const { searchParams } = new URL(req.url);
    const pictureUrl = searchParams.get("pictureUrl");

    if (!pictureUrl) {
      return Response.json({ error: "pictureUrl is required" });
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
        texts: ["H2Terreur Nocturne", " ", dateString],
      },
      retries: 1,
    });
    return Response.json(res);
  } catch (error) {
    return Response.json({ error: "Flyprint API error" + error });
  }
}
