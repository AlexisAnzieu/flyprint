import { Client } from "@upstash/qstash";

const client = new Client({ token: process.env.QSTASH_TOKEN as string });

export const queue = client.queue({
  queueName: "send-to-printer",
});
