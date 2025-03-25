import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { VercelToolbar } from "@vercel/toolbar/next";

export const metadata: Metadata = {
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
    <html lang="en">
      <body>
        {children} <Analytics /> {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
