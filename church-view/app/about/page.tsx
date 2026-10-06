import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { mockChurchValues, mockLeaders } from "../../lib/site-content";

export const metadata: Metadata = { title: "About Ingata Church", description: "Learn about Ingata Church, our story, purpose, beliefs and leadership.", alternates: { canonical: "/about" } };

const sections = [
  ["Our story", "Get to know the Ingata community and how our story is growing in Kigali.", "/about/our-story"],
  ["Mission and vision", "The purpose and direction that guide our life and service together.", "/about/mission-vision"],
  ["What we believe", "Explore the beliefs and values at the center of church life.", "/about/beliefs"],
  ["Leadership", "Meet the people who serve and support the Ingata community.", "/about/leadership"],
] as const;

export default function AboutPage() {
  return <main><PageHero eyebrow="WHO WE ARE" title="A community of faith," emphasis="open to all." description="Learn about Ingata Church—our story, purpose, beliefs and the people who serve our community." breadcrumbs={[{ label: "Home", href: "/" }]} />
    <section className="page-container section-space"><div className="grid gap-10 md:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow text-muted">WELCOME TO INGATA</p><h2 className="mt-5 text-4xl font-medium tracking-tight">A story still<br />being <em className="font-display text-clay">written.</em></h2></div><div className="space-y-4 text-base leading-7 text-muted"><p>Ingata is a church community in Kigali, Rwanda. We gather to worship, grow in faith, build relationships and serve our neighbors.</p><p>We are glad you are here. Explore what guides us and find a way to connect with the community.</p></div></div>
      <div className="mt-14 grid gap-3 sm:grid-cols-2">{sections.map(([title, description, href], index) => <Link className="group flex min-h-48 flex-col border border-border surface-card p-6 transition hover:bg-surface-strong sm:p-8" href={href} key={href}><span className="eyebrow text-clay">0{index + 1} / ABOUT</span><h3 className="mt-5 text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted">{description}</p><span className="mt-auto pt-5 text-sm font-bold">Explore <span className="text-clay" aria-hidden="true">↗</span></span></Link>)}</div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2"><article className="bg-surface p-7 sm:p-9"><p className="eyebrow text-clay">OUR MISSION</p><h3 className="mt-4 font-display text-3xl">To proclaim, nurture and serve.</h3><p className="mt-4 text-sm leading-7 text-muted">Our approved mission statement will be published here.</p></article><article className="bg-surface-strong p-7 sm:p-9"><p className="eyebrow text-clay">OUR VISION</p><h3 className="mt-4 font-display text-3xl">A community transformed by hope.</h3><p className="mt-4 text-sm leading-7 text-muted">Our approved vision statement will be published here.</p></article></div>
      <div className="mt-14 grid gap-10 md:grid-cols-2"><section><p className="eyebrow text-muted">WHAT GUIDES US</p><h2 className="mt-4 text-3xl font-medium">Core values</h2><ul className="mt-5 flex flex-wrap gap-2">{mockChurchValues.map((value) => <li className="rounded-full border border-border bg-surface px-4 py-2 text-sm" key={value}>{value}</li>)}</ul></section><section><p className="eyebrow text-muted">WHAT WE BELIEVE</p><h2 className="mt-4 text-3xl font-medium">A shared foundation</h2><p className="mt-4 text-sm leading-7 text-muted">Ingata is a Christian community seeking to follow Jesus, grow through Scripture and serve with compassion. The approved statement of faith will be published here.</p></section></div>
      <section className="mt-14 border-t border-border pt-10"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow text-muted">OUR LEADERSHIP</p><h2 className="mt-4 text-3xl font-medium">People who serve.</h2></div><Link className="button button-outline" href="/about/leadership">Meet the leadership <span aria-hidden="true">↗</span></Link></div>{mockLeaders.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{mockLeaders.map((leader) => <article className="surface-card p-5" key={leader.name}><h3 className="font-semibold">{leader.name}</h3><p className="mt-1 text-sm text-muted">{leader.role}</p></article>)}</div> : <p className="mt-5 max-w-lg text-sm leading-6 text-muted">Approved profiles and ministry roles will be added as church leadership details are confirmed.</p>}</section>
    </section>
  </main>;
}
