import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/ministries/men";
export const metadata: Metadata = { title: "Growing through community.", description: sitePages[path].description, alternates: { canonical: path } };
export default function MenMinistryPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
