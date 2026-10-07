import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/about/our-story";
export const metadata: Metadata = { title: "A story still being written.", description: sitePages[path].description, alternates: { canonical: path } };
export default function OurStoryPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
