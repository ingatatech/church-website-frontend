"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const isAdmin = usePathname().startsWith("/admin");
  return <div id="top">{!isAdmin && <SiteHeader />}{children}{!isAdmin && <SiteFooter />}</div>;
}
