import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { getPublicData, type PublicContent } from "../../lib/church-api";

export default async function AnnouncementsPage() {
  const response = await getPublicData<{ items: PublicContent[] }>("/content/announcements?limit=50");
  const announcements = response?.items ?? [];
  return <main><PageHero eyebrow="NEWS & ANNOUNCEMENTS" title="The latest from" emphasis="our community." description="Church announcements, community news, ministry updates and special notices—all in one place." />
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">{announcements.length ? <div className="grid gap-4 md:grid-cols-2">{announcements.map((item) => <article className="bg-[#eeeadf] p-6" key={item.id}><p className="text-[10px] font-bold tracking-[.16em] text-clay">{item.publishedAt ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "Africa/Kigali" }).format(new Date(item.publishedAt)) : "CHURCH UPDATE"}</p><h2 className="mt-3 text-2xl font-semibold">{item.title}</h2>{item.description && <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>}{typeof item.details.category === "string" && <span className="mt-5 inline-block border border-ink/15 px-3 py-1 text-xs">{item.details.category}</span>}</article>)}</div> : <div className="border-y border-ink/15 py-12"><p className="text-[10px] font-bold tracking-[.2em] text-clay">STAY IN THE LOOP</p><h2 className="mt-5 text-3xl font-medium">News, notes &<br /><em className="font-display">good things.</em></h2><p className="mt-4 max-w-lg text-sm leading-7 text-muted">Announcements and ministry updates will appear here when they’re published. For an urgent question, please get in touch with the church.</p><Link className="mt-5 inline-flex bg-forest px-5 py-3.5 text-sm font-bold text-paper" href="/contact">Contact the church ↗</Link></div>}</section>
  </main>;
}
