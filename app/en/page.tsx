import type { Metadata, Viewport } from "next";
import Landing from "../components/landing/Landing";
import { landingMetadata, landingViewport } from "../components/landing/content";

// A static segment, so it wins over app/[flyboothId] for "/en".
export const metadata: Metadata = landingMetadata("en");
export const viewport: Viewport = landingViewport;

export default function EnglishLandingPage() {
  return <Landing lang="en" />;
}
