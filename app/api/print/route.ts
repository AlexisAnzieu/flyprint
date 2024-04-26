import { unstable_noStore as noStore } from "next/cache";
import net from "net";
import EscPosEncoder from "esc-pos-encoder";
import sharp from "sharp";
import { createCanvas, Image } from "canvas";

const getImage = async (url: string) => {
  let response = await fetch(url);
  let imageBuffer = await response.arrayBuffer();

  let processedImageBuffer = await sharp(imageBuffer)
    .resize(520, 800)
    .rotate(90)
    .toBuffer();

  let img = new Image();
  img.src = processedImageBuffer;

  let canvas = createCanvas(img.width, img.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  return canvas;
};

export async function GET(req: Request) {
  noStore();

  try {
    console.log("Printing");

    const { searchParams } = new URL(req.url);
    const pictureUrl = searchParams.get("pictureUrl");

    if (!pictureUrl) {
      return Response.json({ error: "pictureUrl is required" });
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
    return Response.json({ error: "Erreur sur l'API" });
  }

  // const client = new net.Socket();

  // console.log("Created socket");

  // await new Promise((resolve, reject) => {
  //   client.connect(9100, "192.168.0.87", async function () {
  //     console.log("Connected to the printer");
  //     let encoder = new EscPosEncoder();
  //     const image = await getImage(pictureUrl);

  //     let result = encoder
  //       .initialize()
  //       .image(image, 520, 800, "atkinson")
  //       .newline()
  //       .cut()
  //       .encode();

  //     // Write data to the printer
  //     const isBufferFull = !client.write(result);

  //     if (isBufferFull) {
  //       console.log("Buffer full, waiting for drain event to write more data");
  //       client.once("drain", doEnd);
  //     } else {
  //       doEnd();
  //     }

  //     function doEnd() {
  //       client.end(() => {
  //         // Close the connection
  //         console.log("Connection closed");
  //         resolve("done");
  //       });
  //     }
  //   });
  // });

  // console.log("Data sent and connection closed");

  // return Response.json("Printed");
}
