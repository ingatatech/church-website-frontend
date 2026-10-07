import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/about/leadership";
export const metadata: Metadata = { title: "People who serve.", description: sitePages[path].description, alternates: { canonical: path } };
export default function LeadershipPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
