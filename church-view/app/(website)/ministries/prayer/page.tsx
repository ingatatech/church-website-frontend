import type { Metadata } from "next";
import { SiteContentPage } from "@/components/site/site-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/ministries/prayer";
export const metadata: Metadata = { title: "There is room to pray together.", description: sitePages[path].description, alternates: { canonical: path } };
export default function PrayerMinistryPage() { return <SiteContentPage page={sitePages[path]} path={path} />; }
