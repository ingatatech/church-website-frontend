import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteChrome } from "../components/site-chrome";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ingata.church"),
  title: { default: "Ingata Church | A Place to Belong", template: "%s | Ingata Church" },
  description: "A community of faith, hope and open doors in Kigali. Join us for worship, find your people, and grow in faith together.",
  openGraph: { type: "website", siteName: "Ingata Church", locale: "en_RW" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body className="antialiased"><SiteChrome>{children}</SiteChrome></body></html>;
}
