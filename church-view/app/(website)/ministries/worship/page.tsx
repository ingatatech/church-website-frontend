import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/ministries/worship";
export const metadata: Metadata = { title: "Make room for worship.", description: sitePages[path].description, alternates: { canonical: path } };
export default function WorshipMinistryPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
