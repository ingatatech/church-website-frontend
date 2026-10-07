import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { getPublicData, type Ministry } from "@/lib/api/church-api";
import { mockMinistries } from "@/lib/content/church-defaults";

export const metadata: Metadata = { title: "Ministries", description: "Explore ministries at the church and find a place to connect, grow and serve." };

export default async function MinistriesPage() {
  const published = await getPublicData<Ministry[]>("/ministries");
  const items = published?.length
    ? published.map((ministry) => ({ id: ministry.id, slug: ministry.id, name: ministry.name, description: ministry.description, leader: ministry.leader }))
    : mockMinistries.map((ministry) => ({ ...ministry, id: ministry.slug, leader: null as string | null }));

  return <main><PageHero eyebrow="FIND YOUR PEOPLE" title="There’s more than" emphasis="one way in." description="Explore the ministries and groups that help people of every age connect, grow in faith and serve the community." breadcrumbs={[{ label: "Home", href: "/" }]} />
    <section className="page-container section-space"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((ministry, index) => <article className="flex min-h-56 flex-col border border-border surface-card p-6 transition hover:bg-surface-strong" key={ministry.id}><p className="eyebrow text-muted">{String(index + 1).padStart(2, "0")} / MINISTRY</p><h2 className="mt-7 text-2xl font-semibold tracking-tight">{ministry.name}</h2><p className="mt-3 text-sm leading-6 text-muted">{ministry.description}</p>{ministry.leader && <p className="mt-3 text-xs text-muted">Led by {ministry.leader}</p>}<Link className="mt-auto inline-flex min-h-12 items-end pt-5 text-sm font-bold" href={`/ministries/${ministry.slug}`}>Explore ministry <span className="ml-2 text-clay" aria-hidden="true">↗</span></Link></article>)}</div><p className="mt-8 text-xs leading-6 text-muted">Ministry descriptions are starter content and can be updated with approved schedules, leaders and contact details.</p></section>
  </main>;
}
