import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { SermonLibrary } from "@/components/site/sermon-library";
import { getPublicData, type Sermon } from "@/lib/api/church-api";

export const metadata: Metadata = { title: "Sermons", description: "Listen to the church messages and filter teaching by Scripture, speaker and category.", alternates: { canonical: "/sermons" } };

export default async function SermonsPage() {
  const sermons = await getPublicData<Sermon[]>("/sermons");
  return <main><PageHero eyebrow="SERMONS & MEDIA" title="Words for the" emphasis="way ahead." description="Watch or listen to sermons, explore teaching by topic and take a little encouragement with you." breadcrumbs={[{ label: "Home", href: "/" }]} />
    <section className="page-container section-space"><SermonLibrary sermons={sermons ?? []} /></section>
  </main>;
}
