import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/ministries/women";
export const metadata: Metadata = { title: "Connection and encouragement.", description: sitePages[path].description, alternates: { canonical: path } };
export default function WomenMinistryPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
