import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const metadata: Metadata = {
  title: "Ingata Church | A Place to Belong",
  description:
    "A community of faith, hope and open doors in Kigali. Join us for worship, find your people, and grow in faith together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div id="top"><SiteHeader />{children}<SiteFooter /></div>
      </body>
    </html>
  );
}
