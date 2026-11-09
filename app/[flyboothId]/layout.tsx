import type { Metadata } from "next";

// Guest pages belong to private events: keep them out of search results.
export const metadata: Metadata = {
  title: "Flybooth",
  robots: { index: false, follow: false },
};

export default function FlyboothLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
