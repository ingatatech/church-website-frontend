import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/about/beliefs";
export const metadata: Metadata = { title: "Faith at the center.", description: sitePages[path].description, alternates: { canonical: path } };
export default function BeliefsPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
