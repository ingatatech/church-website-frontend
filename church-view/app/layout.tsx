import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "A Place to Belong | Church", template: "%s | Church" },
  description: "A community of faith, hope and open doors in Kigali. Join us for worship, find your people, and grow in faith together.",
  openGraph: { type: "website", siteName: "Church", locale: "en_RW" },
  icons: { icon: "/logo-c.png", shortcut: "/logo-c.png", apple: "/logo-c.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
