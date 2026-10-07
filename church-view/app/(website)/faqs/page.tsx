import type { Metadata } from "next";
import { FaqContentPage } from "@/components/site/faq-content-page";
import { sitePages } from "@/lib/content/site-pages";

const path = "/faqs";
export const metadata: Metadata = { title: "A few helpful answers.", description: sitePages[path].description, alternates: { canonical: path } };
export default function FAQsPage() { return <FaqContentPage page={sitePages[path]} />; }
