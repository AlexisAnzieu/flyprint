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

  console.log("Printing");

  const { searchParams } = new URL(req.url);
  const pictureUrl = searchParams.get("pictureUrl");

  if (!pictureUrl) {
    return Response.json({ error: "pictureUrl is required" });
  }

  const client = new net.Socket();

  console.log("Created socket");

  await new Promise((resolve, reject) => {
    client.connect(9100, "70.81.36.26", async function () {
      console.log("Connected to the printer");
      let encoder = new EscPosEncoder();
      const image = await getImage(pictureUrl);

      let result = encoder
        .initialize()
        .image(image, 520, 800, "atkinson")
        .newline()
        .cut()
        .encode();

      // Write data to the printer
      const isBufferFull = !client.write(result);

      if (isBufferFull) {
        console.log("Buffer full, waiting for drain event to write more data");
        client.once("drain", doEnd);
      } else {
        doEnd();
      }

      function doEnd() {
        client.end(() => {
          // Close the connection
          console.log("Connection closed");
          resolve("done");
        });
      }
    });
  });

  console.log("Data sent and connection closed");

  return Response.json("Printed");
}
// export async function GET(req: Request) {
//   noStore();

//   console.log("Printing");

//   const { searchParams } = new URL(req.url);
//   const pictureUrl = searchParams.get("pictureUrl");

//   if (!pictureUrl) {
//     return Response.json({ error: "pictureUrl is required" });
//   }

//   const client = new net.Socket();

//   console.log("Created socket");

//   const socket = client.connect(9100, "70.81.36.26", async function () {
//     console.log("Connected to the printer");
//     let encoder = new EscPosEncoder();

//     let result = encoder
//       .initialize()
//       .text("salut")
//       //   .image(
//       //     await getImage(
//       //       "https://res.cloudinary.com/dkbuiehgq/image/upload/v1713647319/samples/logo.jpg"
//       //     ),
//       //     640,
//       //     640,
//       //     "atkinson"
//       //   )
//       .newline()

//       // .newline()
//       // .newline()
//       // .newline()
//       // .newline()
//       // .newline()
//       .cut()
//       .encode();

//     client.write(result); // send data to the printer
//     console.log("Send data to the printer");

//     client.end(); // close the connection
//   });

//   console.log(socket);

//   return Response.json("Printed");
// }
