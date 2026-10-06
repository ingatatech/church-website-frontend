import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { getPublicData, type ChurchEvent } from "../../lib/church-api";

function displayDate(date: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "Africa/Kigali" }).format(new Date(`${date}T12:00:00`));
}

export default async function EventsPage() {
  const events = await getPublicData<ChurchEvent[]>("/events");
  return <main><PageHero eyebrow="LIFE AT INGATA" title="Good things are" emphasis="coming up." description="Keep up with worship gatherings, conferences, retreats, community activities, youth programs and special celebrations." />
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
      {events?.length ? <div className="grid gap-4 md:grid-cols-2">{events.map((event) => <article className="overflow-hidden border border-ink/10 bg-[#eeeadf]" key={event.id}>{event.flyerUrl && <div className="h-52 bg-cover bg-center" role="img" aria-label={`Image for ${event.name}`} style={{ backgroundImage: `url(${event.flyerUrl})` }} />}<div className="p-6"><p className="text-[10px] font-bold tracking-[.17em] text-clay">{displayDate(event.date)} · {event.time}</p><h2 className="mt-3 text-2xl font-semibold"><Link className="hover:text-clay" href={`/events/${event.id}`}>{event.name}</Link></h2>{event.description && <p className="mt-3 text-sm leading-6 text-muted">{event.description}</p>}<dl className="mt-5 grid gap-3 border-t border-ink/10 pt-4 text-sm sm:grid-cols-2"><div><dt className="text-[10px] font-bold tracking-wide text-muted">LOCATION</dt><dd className="mt-1">{event.location}</dd></div><div><dt className="text-[10px] font-bold tracking-wide text-muted">REGISTRATION</dt><dd className="mt-1">{event.registrationRequired ? "Contact us to register" : "No registration listed"}</dd></div></dl>{event.registrationRequired && <Link className="mt-5 inline-block text-sm font-bold" href={`/contact?topic=${encodeURIComponent(event.name)}`}>Register interest <span className="ml-2 text-clay">↗</span></Link>}</div></article>)}</div> : <div className="border-y border-ink/15 py-12"><p className="text-[10px] font-bold tracking-[.2em] text-clay">UPCOMING EVENTS</p><h2 className="mt-5 text-3xl font-medium">The calendar is<br />being <em className="font-display">updated.</em></h2><p className="mt-4 max-w-md text-sm leading-7 text-muted">Confirmed event dates, times, venues, images and registration details will appear here. Contact us if you’re looking for an upcoming gathering.</p><Link className="mt-5 inline-flex bg-forest px-5 py-3.5 text-sm font-bold text-paper" href="/contact?topic=events">Ask about an event ↗</Link></div>}
    </section>
  </main>;
}
