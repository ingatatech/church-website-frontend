import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "../../../components/page-hero";
import { getPublicData, type ChurchEvent } from "../../../lib/church-api";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getPublicData<ChurchEvent>(`/events/${encodeURIComponent(id)}`);
  if (!event) notFound();
  return <main><PageHero eyebrow="EVENT DETAILS" title={event.name} description={event.description ?? "Join us for this gathering at Ingata Church."} />
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_.65fr] lg:px-10 lg:py-20"><div>{event.flyerUrl && <div className="mb-8 min-h-72 bg-cover bg-center" role="img" aria-label={`Image for ${event.name}`} style={{ backgroundImage: `url(${event.flyerUrl})` }} />}<p className="text-[10px] font-bold tracking-[.2em] text-clay">ABOUT THIS EVENT</p><h2 className="mt-4 text-3xl font-medium">Come be part of it.</h2><p className="mt-4 text-sm leading-7 text-muted">{event.description || "More information about this event will be shared soon."}</p></div><aside className="h-fit bg-[#eeeadf] p-6 sm:p-8"><p className="text-[10px] font-bold tracking-[.2em] text-muted">PLAN AHEAD</p><dl className="mt-5 divide-y divide-ink/10">{[["DATE", event.date], ["TIME", event.time], ["LOCATION", event.location], ["REGISTRATION", event.registrationRequired ? "Registration required" : "No registration listed"]].map(([label, value]) => <div className="py-4" key={label}><dt className="text-[10px] font-bold tracking-wide text-muted">{label}</dt><dd className="mt-1 text-sm">{value}</dd></div>)}</dl>{event.registrationRequired && <Link className="mt-5 inline-flex bg-forest px-5 py-3.5 text-sm font-bold text-paper" href={`/contact?topic=${encodeURIComponent(event.name)}`}>Register interest ↗</Link>}</aside></section>
  </main>;
}
