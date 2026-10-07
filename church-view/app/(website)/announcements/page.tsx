import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { getPublicData, type PublicContent } from "@/lib/api/church-api";

export const metadata: Metadata = { title: "Announcements", description: "Church announcements, community news, ministry updates and notices from the church.", alternates: { canonical: "/announcements" } };

export default async function AnnouncementsPage() {
  const response = await getPublicData<{ items: PublicContent[] }>("/content/announcements?limit=50");
  const announcements = response?.items ?? [];
  return <main><PageHero eyebrow="NEWS & ANNOUNCEMENTS" title="The latest from" emphasis="our community." description="Church announcements, community news, ministry updates and special notices—all in one place." breadcrumbs={[{ label: "Home", href: "/" }]} />
    <section className="page-container section-space">{announcements.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{announcements.map((item) => <article className="surface-card p-4 sm:p-6" key={item.id}><p className="eyebrow text-primary">{item.publishedAt ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "Africa/Kigali" }).format(new Date(item.publishedAt)) : "CHURCH UPDATE"}</p><h2 className="mt-3 text-xl font-semibold"><Link className="hover:text-primary-hover" href={`/announcements/${item.slug}`}>{item.title}</Link></h2>{item.description && <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>}{typeof item.details.category === "string" && <span className="mt-5 inline-flex min-h-8 items-center rounded-full border border-border px-3 text-xs">{item.details.category}</span>}<Link className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-primary" href={`/announcements/${item.slug}`}>Read announcement <span className="ml-2" aria-hidden="true">↗</span></Link></article>)}</div> : <div className="border-y border-border py-12"><p className="eyebrow text-primary">STAY IN THE LOOP</p><h2 className="mt-5 text-3xl font-medium">News, notes &<br /><em className="font-display">good things.</em></h2><p className="mt-4 max-w-lg text-sm leading-7 text-muted">Announcements and ministry updates will appear here when they are published. For an urgent question, please get in touch with the church.</p><Link className="button button-primary mt-5" href="/contact">Contact the church ↗</Link></div>}</section>
  </main>;
}
