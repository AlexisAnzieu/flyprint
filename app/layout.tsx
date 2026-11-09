import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { VercelToolbar } from "@vercel/toolbar/next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Flyprint",
  description: "Votre photobooth en vrai!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shouldInjectToolbar = process.env.NODE_ENV === "development";

  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics /> {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
