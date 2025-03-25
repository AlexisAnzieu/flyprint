import { flag } from "flags/next";

export const isPrintQueueEnabled = flag({
  key: "is-print-queue-enabled",
  decide() {
    return true;
  },
});
