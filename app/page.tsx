import type { Metadata, Viewport } from "next";
import Landing from "./components/landing/Landing";
import { landingMetadata, landingViewport } from "./components/landing/content";

export const metadata: Metadata = landingMetadata("fr");
export const viewport: Viewport = landingViewport;

export default function LandingPage() {
  return <Landing lang="fr" />;
}
