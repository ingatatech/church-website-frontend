import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/about/mission-vision";
export const metadata: Metadata = { title: "A life shaped by faith and hope.", description: sitePages[path].description, alternates: { canonical: path } };
export default function MissionVisionPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
