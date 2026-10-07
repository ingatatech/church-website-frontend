import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/ministries/children";
export const metadata: Metadata = { title: "A place for little ones to grow.", description: sitePages[path].description, alternates: { canonical: path } };
export default function ChildrenMinistryPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
