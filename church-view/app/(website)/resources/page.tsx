import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/resources";
export const metadata: Metadata = { title: "Tools for your faith journey.", description: sitePages[path].description, alternates: { canonical: path } };
export default function ResourcesPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
