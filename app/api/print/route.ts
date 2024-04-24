import { unstable_noStore as noStore } from "next/cache";
import net from "net";
import EscPosEncoder from "esc-pos-encoder";
import sharp from "sharp";
import { createCanvas, Image } from "canvas";

const getImage = async (url: string) => {
  let response = await fetch(url);
  let imageBuffer = await response.arrayBuffer();

  let processedImageBuffer = await sharp(imageBuffer)
    .resize(640, 640)
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

  const { searchParams } = new URL(req.url);
  const pictureUrl = searchParams.get("pictureUrl");

  if (!pictureUrl) {
    return Response.json({ error: "pictureUrl is required" });
  }

  const client = new net.Socket();
  client.setTimeout(5000); // Timeout after 5 seconds of inactivity

  client.connect(9100, "70.81.36.26", async function () {
    console.log("Connected to the printer");
    let encoder = new EscPosEncoder();

    let result = encoder
      .initialize()
      .text("salut")
      .image(
        await getImage(
          "https://res.cloudinary.com/dkbuiehgq/image/upload/v1713647319/samples/logo.jpg"
        ),
        640,
        640,
        "atkinson"
      )
      .newline()
      // .image(
      //   await getImage(
      //     "https://res.cloudinary.com/dkbuiehgq/image/upload/v1712880847/cockpit/05970730-8b01-4fe8-ae1b-e42fa334175e/image_w3h8xz.jpg"
      //   ),
      //   640,
      //   640,
      //   "atkinson"
      // )
      // .newline()
      // .newline()
      // .newline()
      // .newline()
      // .newline()
      .cut()
      .encode();

    client.write(result); // send data to the printer
    console.log("Send data to the printer");

    client.end(); // close the connection
  });

  return Response.json("Printed");
}
