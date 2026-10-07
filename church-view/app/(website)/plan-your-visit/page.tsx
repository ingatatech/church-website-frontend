import type { Metadata } from "next";
import { PlanYourVisitPage } from "@/components/public-pages/plan-your-visit-page";

export const metadata: Metadata = {
  title: "Plan your visit",
  description: "Everything you need to feel comfortable visiting the church in Kigali.",
  alternates: { canonical: "/plan-your-visit" },
};

export default function PlanYourVisitRoute() {
  return <PlanYourVisitPage />;
}
