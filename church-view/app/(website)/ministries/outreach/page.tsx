import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/ministries/outreach";
export const metadata: Metadata = { title: "Care beyond our own doors.", description: sitePages[path].description, alternates: { canonical: path } };
export default function OutreachMinistryPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
