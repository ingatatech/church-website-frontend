import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { Header } from "./Header";

export function SiteChrome({ children }: { children: ReactNode }) {
  return <div id="top"><Header />{children}<SiteFooter /></div>;
}
