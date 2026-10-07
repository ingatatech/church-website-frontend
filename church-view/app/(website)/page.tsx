import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublicData, type ChurchEvent, type PublicContent, type Sermon } from "@/lib/api/church-api";
import { mockMinistries, mockSocialLinks } from "@/lib/content/church-defaults";

export const metadata: Metadata = {
  title: "Welcome to Our Church",
  description: "A welcoming community committed to faith, worship, fellowship, service and sharing the message of Christ.",
  alternates: { canonical: "/" }
};

export default async function HomeView() {
  const [events, sermons, announcements, serviceContent] = await Promise.all([
    getPublicData<ChurchEvent[]>("/events"),
    getPublicData<Sermon[]>("/sermons"),
    getPublicData<{ items: PublicContent[] }>("/content/announcements?limit=3"),
    getPublicData<{ items: PublicContent[] }>("/content/services?limit=2"),
  ]);
  const serviceSchedule = serviceContent?.items?.length
    ? serviceContent.items.map((service) => ({
        title: service.title,
        time: [service.details.day, service.details.time].filter((value): value is string => typeof value === "string" && value.length > 0).join(" · ") || "Time to be confirmed",
        description: service.description || "Contact us for details",
      }))
    : [
        { title: "Service Schedule", time: "Times to be confirmed", description: "Contact us for current details" },
        { title: "Gather With Us", time: "Everyone is welcome", description: "Ask about worship and gatherings" },
      ];

  return (
    <main className="flex min-h-screen flex-col bg-stone-50 text-stone-900 selection:bg-amber-200 selection:text-stone-900">

      {/* HERO SECTION */}
      <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-stone-900 sm:min-h-[82vh]">
        <Image
          alt=""
          className="object-cover opacity-50 mix-blend-overlay"
          fill
          priority
          sizes="100vw"
          src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=2200&q=88"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />

        <div className="relative z-10 flex max-w-4xl flex-col items-center px-6 text-center sm:px-12">
          <h1 className="font-serif text-5xl font-medium tracking-tight text-white sm:text-7xl">
            Welcome to Our Church
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-200 sm:text-xl">
            A welcoming community committed to faith, worship, fellowship, service and sharing the message of Christ.
          </p>
          <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row">
            <Link className="rounded-sm bg-amber-700 px-8 py-4 text-sm font-bold tracking-wide text-white uppercase shadow-lg transition-colors hover:bg-amber-600" href="/plan-your-visit">
              Plan Your Visit
            </Link>
            <Link className="rounded-sm border-2 border-white px-8 py-4 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-white hover:text-stone-900" href="/sermons">
              Watch Sermons
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICE SCHEDULE HIGHLIGHT - Overlapping Hero */}
      <section className="relative z-20 -mt-16 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-sm border-t-4 border-amber-700 bg-white shadow-xl">
          <div className="grid divide-y divide-stone-100 md:grid-cols-3 md:divide-x md:divide-y-0">
            {serviceSchedule.map((service) => <div className="p-8 text-center md:text-left" key={service.title}>
              <h3 className="font-serif text-xl font-bold text-stone-900">{service.title}</h3>
              <p className="mt-2 font-medium text-amber-700">{service.time}</p>
              <p className="mt-1 text-sm text-stone-500">{service.description}</p>
            </div>)}
            <div className="flex flex-col items-center justify-center p-8 bg-stone-50 transition-colors hover:bg-stone-100">
              <Link className="group inline-flex items-center text-sm font-bold tracking-wide text-stone-900 uppercase" href="/services">
                View All Services
                <span className="ml-2 text-amber-700 transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT THE CHURCH */}
      <section className="px-6 py-24 sm:px-12 lg:px-24" id="about">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">Our Identity</span>
          <h2 className="mt-4 font-serif text-4xl font-medium text-stone-900 sm:text-5xl">We Are a Community of Faith</h2>
          <div className="mx-auto mt-6 h-1 w-12 bg-amber-700" />
          <p className="mx-auto mt-8 text-lg leading-8 text-stone-600">
            Our church is a community committed to worship, spiritual growth, fellowship, service and sharing the message of Christ with individuals, families and the wider community.
          </p>
          <Link className="mt-10 inline-flex items-center text-sm font-bold tracking-wide text-stone-900 uppercase hover:text-amber-700" href="/about">
            Learn About Our Mission <span className="ml-2">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* MINISTRIES */}
      <section className="bg-white px-6 py-24 sm:px-12 lg:px-24" id="ministries">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">Connect With Us</span>
              <h2 className="mt-3 font-serif text-4xl font-medium text-stone-900">Explore Our Ministries</h2>
            </div>
            <Link className="text-sm font-bold tracking-wide text-stone-900 uppercase hover:text-amber-700" href="/ministries">
              All Ministries &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {mockMinistries.slice(0, 6).map((ministry, index) => (
              <Link className="group flex min-h-56 flex-col justify-between border border-stone-200 bg-stone-50 p-7 transition-colors hover:border-amber-700 hover:bg-white" href={`/ministries/${ministry.slug}`} key={ministry.slug}>
                <span className="flex size-12 items-center justify-center border border-amber-700/40 font-serif text-xl text-amber-800">0{index + 1}</span>
                <div>
                  <h3 className="font-serif text-2xl font-medium text-stone-900">{ministry.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{ministry.description}</p>
                  <span className="mt-5 inline-flex items-center text-xs font-bold tracking-wide text-amber-800 uppercase group-hover:underline">Explore ministry <span className="ml-2" aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS & ANNOUNCEMENTS SECTION */}
      <section className="bg-stone-50 px-6 py-24 sm:px-12 lg:px-24" id="updates">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">

          {/* Upcoming Events */}
          <div className="lg:col-span-7">
            <div className="mb-10 flex items-end justify-between border-b border-stone-200 pb-4">
              <h2 className="font-serif text-3xl font-medium text-stone-900">Upcoming Events</h2>
              <Link className="text-xs font-bold tracking-widest text-amber-700 uppercase hover:text-stone-900" href="/events">View Calendar</Link>
            </div>
            <div className="flex flex-col">
              {events?.length ? events.slice(0, 3).map((event) => (
                <Link className="group flex flex-col gap-4 border-b border-stone-200 py-6 transition-colors hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:px-4" href={`/events/${event.id}`} key={event.id}>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-700">{event.name}</h3>
                    <p className="mt-2 text-sm text-stone-500">{event.date} · {event.time}{event.location ? ` · ${event.location}` : ""}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-900 transition-colors group-hover:bg-amber-700 group-hover:text-white">
                    &rarr;
                  </span>
                </Link>
              )) : (
                <p className="py-8 text-stone-500">Upcoming events will appear here when they are published.</p>
              )}
            </div>
          </div>

          {/* Announcements Card */}
          <div className="lg:col-span-5">
            <div className="flex h-full flex-col justify-center rounded-sm bg-stone-900 p-10 text-center text-white shadow-xl">
              <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">Church News</span>
              <h2 className="mt-4 font-serif text-3xl font-medium">Latest Announcements</h2>
              <div className="mx-auto mt-6 h-px w-16 bg-white/20" />
              {announcements?.items?.length ? <ul className="mt-6 divide-y divide-white/15 text-left">
                {announcements.items.slice(0, 3).map((item) => <li className="py-4" key={item.id}>
                  <Link className="font-serif text-lg text-white hover:text-amber-300" href={`/announcements/${item.slug}`}>{item.title}</Link>
                  {item.description && <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-300">{item.description}</p>}
                </li>)}
              </ul> : <p className="mt-6 text-stone-300">Church news and ministry updates will appear here when they are published.</p>}
              <Link className="mx-auto mt-8 inline-block rounded-sm bg-white px-8 py-3 text-sm font-bold tracking-wide text-stone-900 uppercase transition-colors hover:bg-stone-200" href="/announcements">
                All Announcements
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SERMONS LIBRARY */}
      <section className="bg-stone-900 px-6 py-24 sm:px-12 lg:px-24" id="sermons">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col items-center text-center">
            <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">Latest Messages</span>
            <h2 className="mt-3 font-serif text-4xl font-medium text-white sm:text-5xl">Watch & Listen</h2>
            <div className="mt-6 h-1 w-12 bg-amber-700" />
          </div>

          {sermons?.length ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sermons.slice(0, 3).map((sermon) => (
                <article className="group relative flex flex-col rounded-sm bg-stone-800 p-8 transition-colors hover:bg-stone-800/80" key={sermon.id}>
                  <p className="text-xs font-bold tracking-widest text-amber-500 uppercase">{sermon.category} · {sermon.date}</p>
                  <h3 className="mt-4 font-serif text-2xl font-medium text-white">
                    <Link className="before:absolute before:inset-0" href={`/sermons/${sermon.id}`}>
                      {sermon.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-stone-400">{sermon.speaker}{sermon.scripture ? ` · ${sermon.scripture}` : ""}</p>

                  {sermon.audioUrl && (
                    <div className="relative z-10 mt-auto pt-8">
                      <audio className="w-full h-10 rounded-sm" controls preload="none" src={sermon.audioUrl}>
                        Audio playback is not supported.
                      </audio>
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-stone-400">Published messages will appear here.</p>
          )}

          <div className="mt-12 text-center">
            <Link className="inline-flex items-center text-sm font-bold tracking-wide text-white uppercase hover:text-amber-500" href="/sermons">
              Browse Sermon Library &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER CTA & LOCATION */}
      <section className="bg-white px-6 py-24 sm:px-12 lg:px-24" id="visit">
        <div className="mx-auto grid max-w-7xl gap-0 overflow-hidden rounded-sm border border-stone-200 bg-stone-50 shadow-sm lg:grid-cols-2">
          <div className="flex flex-col justify-center p-12 sm:p-16 lg:p-20">
            <h2 className="font-serif text-4xl font-medium text-stone-900">Plan Your Visit</h2>
            <div className="mt-6 h-1 w-12 bg-amber-700" />
            <p className="mt-6 text-lg text-stone-600">
              We will save you a seat, show you around and help you feel at home.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link className="inline-flex items-center justify-center rounded-sm bg-amber-700 px-8 py-4 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-amber-600" href="/plan-your-visit">
                Plan Your Visit
              </Link>
              <Link className="inline-flex items-center justify-center rounded-sm border-2 border-stone-900 px-8 py-4 text-sm font-bold tracking-wide text-stone-900 uppercase transition-colors hover:bg-stone-900 hover:text-white" href="/prayer-request">
                Share a Prayer Request
              </Link>
            </div>
          </div>
          <div className="relative min-h-[300px] w-full lg:h-auto">
            <iframe
              title="Map of Kigali, Rwanda"
              className="absolute inset-0 h-full w-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
              loading="lazy"
              src="https://maps.google.com/maps?q=Kigali%2C%20Rwanda&output=embed"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 px-5 py-3 text-sm text-stone-700">Kigali, Rwanda <span className="text-stone-400">·</span> Exact meeting location to be confirmed</div>
          </div>
        </div>
      </section>

      {/* SOCIAL LINKS */}
      <section className="border-t border-stone-200 bg-stone-50 px-6 py-14 sm:px-12 lg:px-24" aria-labelledby="social-heading">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-amber-800 uppercase">Stay connected</p>
            <h2 className="mt-2 font-serif text-2xl text-stone-900" id="social-heading">Connect with our church</h2>
          </div>
          {mockSocialLinks.length ? <nav aria-label="Church social media" className="flex flex-wrap gap-3">
            {mockSocialLinks.map((social) => <a className="border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-800 hover:border-amber-700 hover:text-amber-800" href={social.href} key={social.label} rel="noreferrer" target="_blank">{social.label}</a>)}
          </nav> : <div className="flex flex-col gap-3 sm:items-end">
            <p className="text-sm text-stone-600">Social media links will be added when the church channels are confirmed.</p>
            <Link className="text-sm font-bold text-amber-800 hover:underline" href="/contact">Contact the church <span aria-hidden="true">→</span></Link>
          </div>}
        </div>
      </section>
    </main>
  );
}
