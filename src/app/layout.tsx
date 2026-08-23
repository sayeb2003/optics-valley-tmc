import type { Metadata } from "next";
import { club } from "@/config/club";

// Self-hosted fonts (via @fontsource, served from npm — not Google's CDN).
// Chosen deliberately so local dev works without a VPN in mainland China,
// and so production has zero third-party font-loading dependency at all.
import "@fontsource/fraunces/300.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";

import "./globals.css";

const siteUrl = "https://opticsvalleytmc.club"; // update once a domain is chosen

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${club.name} | ${club.tagline}`,
    template: `%s | ${club.shortName}`,
  },
  description:
    "Optics Valley Toastmasters Club (Club #02793285, District 128, Wuhan) helps members build public speaking and leadership skills in a supportive, international community. Meets every Friday, 7:00–9:30 PM.",
  keywords: [
    "Toastmasters",
    "Wuhan Toastmasters",
    "Optics Valley Toastmasters",
    "public speaking club Wuhan",
    "leadership training Wuhan",
    "光谷 演讲俱乐部",
  ],
  openGraph: {
    title: `${club.name} | ${club.tagline}`,
    description:
      "Join a supportive, international community building public speaking and leadership skills — every Friday in Optics Valley, Wuhan.",
    url: siteUrl,
    siteName: club.name,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
