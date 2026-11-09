// Public URL of the landing page (the old flybooth.app/printer redirects here).
// Used for canonical URLs, Open Graph, the sitemap and robots.txt.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://print.flybooth.app"
).replace(/\/$/, "");
