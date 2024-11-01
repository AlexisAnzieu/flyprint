import { unstable_noStore as noStore } from "next/cache";
import { queue } from "@/lib/queue";

export async function GET(req: Request) {
  noStore();

  try {
    const texts: string[] = [];
    texts.push("Cadeaux à glisser sous le sapin:");
    texts.push("");

    const books = await fetch("https://h2t.club/api/books?limit=3");
    const booksJson = await books.json();
    booksJson.forEach((book: any) => {
      texts.push(`${book.title}, par ${book.author}`);
      texts.push(book.summary);
      texts.push("");
    });

    const res = await queue.enqueueJSON({
      url: "http://printer.h2t.club/print",
      body: {
        logoUrl:
          "https://res.cloudinary.com/dkbuiehgq/image/upload/v1730497441/frame_uxift3.png",
        texts,
      },
      retries: 1,
    });

    // const books = await fetch("https://h2t.club/api/books?limit=3");
    // const booksJson = await books.json();

    // const markdown = "^^Hello";

    // const res = await queue.enqueueJSON({
    //   url: "http://printer.h2t.club/print",
    //   body: {
    //     data: markdown,
    //   },
    //   retries: 1,
    // });
    return Response.json(res);
  } catch (error) {
    return Response.json({ error: "Flyprint API error" + error });
  }
}
