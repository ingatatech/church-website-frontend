import Link from "next/link";
import Image from "next/image";
import { PageHero } from "../../../components/page-hero";
import { getPublicData, type ChurchEvent } from "../../../lib/church-api";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getPublicData<ChurchEvent>(`/events/${encodeURIComponent(id)}`);
  const name = event?.name ?? id.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return <main><PageHero eyebrow="EVENT DETAILS" title={name} description={event?.description ?? "Details for this gathering will be shared when the event is confirmed."} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Events", href: "/events" }]} />
    <section className="page-container section-space grid gap-10 lg:grid-cols-[1fr_.65fr]"><div>{event?.flyerUrl && <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl"><Image alt={`Event: ${name}`} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 60vw" src={event.flyerUrl} unoptimized /></div>}<p className="eyebrow text-primary">ABOUT THIS EVENT</p><h2 className="mt-4 text-3xl font-medium">Come be part of it.</h2><p className="mt-4 text-sm leading-7 text-muted">{event?.description || "Published event information will be shared here when available."}</p></div><aside className="surface-card h-fit p-4 sm:p-8"><p className="eyebrow text-muted">PLAN AHEAD</p><dl className="mt-5 divide-y divide-border">{[["DATE", event?.date ?? "To be confirmed"], ["TIME", event?.time ?? "To be confirmed"], ["LOCATION", event?.location ?? "To be confirmed"], ["REGISTRATION", event?.registrationRequired ? "Registration required" : "Details to be confirmed"]].map(([label, value]) => <div className="py-4" key={label}><dt className="eyebrow text-muted">{label}</dt><dd className="mt-1 text-sm">{value}</dd></div>)}</dl><Link className="button button-primary mt-5" href={`/contact?topic=${encodeURIComponent(name)}`}>Ask about this event ↗</Link></aside></section>
  </main>;
}
