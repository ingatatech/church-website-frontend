import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "../../components/page-hero";
import { SubmissionForm } from "../../components/submission-form";
import { sitePages } from "../../lib/site-content";
import { getPublicData, type PublicContent } from "../../lib/church-api";

type Params = { segments: string[] };
const pathFor = (segments: string[]) => `/${segments.join("/")}`;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const path = pathFor((await params).segments);
  const page = sitePages[path];
  if (page) return { title: `${page.title} ${page.emphasis}`, description: page.description, alternates: { canonical: path } };
  if (path.startsWith("/announcements/")) {
    const title = path.split("/").at(-1)?.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? "Announcement";
    return { title, description: `Church update from Ingata Church in Kigali.`, alternates: { canonical: path } };
  }
  const title = path === "/plan-your-visit" ? "Plan your visit" : path === "/prayer-request" ? "Prayer request" : "Contact";
  return { title, alternates: { canonical: path } };
}

export default async function AdditionalPublicPage({ params }: { params: Promise<Params> }) {
  const path = pathFor((await params).segments);
  const page = sitePages[path];
  if (path.startsWith("/announcements/")) {
    const slug = path.split("/").at(-1) ?? "";
    const item = await getPublicData<PublicContent>(`/content/announcements/${encodeURIComponent(slug)}`);
    const title = item?.title ?? slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    return <main><PageHero eyebrow="CHURCH ANNOUNCEMENT" title={title} description={item?.description ?? "More details about this church update will be shared when it is published."} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Announcements", href: "/announcements" }]} /><article className="reading-container section-space"><p className="eyebrow text-clay">FROM THE INGATA COMMUNITY</p><h2 className="mt-4 text-3xl font-medium">Stay connected.</h2><p className="mt-5 text-sm leading-7 text-muted">{item?.description ?? "This announcement is part of the website content structure. Published details will be shown here when available."}</p><Link className="button button-primary mt-7" href="/announcements">Back to announcements <span aria-hidden="true">↗</span></Link></article></main>;
  }
  if (page) return <main><PageHero eyebrow={page.eyebrow} title={page.title} emphasis={page.emphasis} description={page.description} breadcrumbs={[{ label: "Home", href: "/" }, { label: path.split("/")[1].replaceAll("-", " "), href: `/${path.split("/")[1]}` }]} />
    <section className="page-container section-space"><div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16"><div><p className="eyebrow text-clay">INGATA CHURCH · KIGALI</p><h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">{page.heading}</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-muted">{page.body}</p>{page.bullets && (path === "/faqs" ? <div className="mt-7 divide-y divide-border border-y border-border">{page.bullets.map((item) => { const [question, answer] = item.split("?"); return <details className="group py-4" key={item}><summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">{question}?<span aria-hidden="true" className="text-clay">+</span></summary><p className="pt-2 text-sm leading-6 text-muted">{answer?.trim()}</p></details>; })}</div> : <ul className="mt-7 divide-y divide-border border-y border-border">{page.bullets.map((item) => <li className="py-4 text-sm leading-6" key={item}>{item}</li>)}</ul>)}</div><aside className="surface-card h-fit p-6 sm:p-8"><p className="eyebrow text-muted">EXPLORE MORE</p><nav className="mt-4 grid divide-y divide-border">{(page.links ?? [{ label: "Plan your visit", href: "/plan-your-visit" }, { label: "Get in touch", href: "/contact" }]).map((link) => <Link className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm font-semibold hover:text-clay" href={link.href} key={link.href}>{link.label}<span aria-hidden="true">↗</span></Link>)}</nav></aside></div></section>
  </main>;
  if (path === "/plan-your-visit") return <main><PageHero eyebrow="YOUR FIRST VISIT" title="Come as you are." emphasis="We’ll save you a seat." description="Everything you need to feel comfortable visiting Ingata Church in Kigali." breadcrumbs={[{ label: "Home", href: "/" }]} /><section className="page-container section-space grid gap-10 lg:grid-cols-2"><div><p className="eyebrow text-clay">WHAT TO EXPECT</p><h2 className="mt-4 text-3xl font-medium">A warm welcome, from the start.</h2><p className="mt-4 text-sm leading-7 text-muted">Come as you are. Our team can help you find the gathering, meet people and get settled. Service times and the exact street address are being confirmed, so contact us before you travel.</p><ul className="mt-6 divide-y divide-border border-y border-border text-sm"><li className="py-4">Family friendly and open to all</li><li className="py-4">Ask us about accessibility and children’s ministry</li><li className="py-4">Current service schedule: please confirm with the church</li></ul><Link className="button button-primary mt-6" href="/contact">Ask us about your visit <span aria-hidden="true">↗</span></Link></div><div className="surface-card p-6 sm:p-8"><p className="eyebrow text-muted">LET US KNOW YOU’RE COMING</p><h2 className="mt-3 text-2xl font-semibold">Plan a visit</h2><p className="mb-6 mt-2 text-sm text-muted">Share a little information and the team can help you prepare.</p><SubmissionForm type="visitor" compact /></div></section></main>;
  if (path === "/prayer-request") return <main><PageHero eyebrow="PRAYER & CARE" title="You don’t have to" emphasis="carry it alone." description="Share a prayer request with the Ingata Church prayer team." breadcrumbs={[{ label: "Home", href: "/" }]} /><section className="page-container section-space grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow text-clay">WE’RE HERE WITH YOU</p><h2 className="mt-4 text-3xl font-medium">A moment to share.</h2><p className="mt-4 text-sm leading-7 text-muted">Share only what you feel comfortable sending. This request will be prepared for the church team once the website is connected to its submission service.</p></div><div className="surface-card p-6 sm:p-8"><SubmissionForm type="prayer" /></div></section></main>;
  if (path === "/contact") return <main><PageHero eyebrow="VISIT · CONNECT · PRAY" title="We’d love to" emphasis="hear from you." description="Planning your first visit, asking about a ministry or carrying something you’d like prayer for? Reach out." breadcrumbs={[{ label: "Home", href: "/" }]} /><section className="page-container section-space grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><aside><p className="eyebrow text-muted">GET IN TOUCH</p><h2 className="mt-4 text-3xl font-medium">The door is open.</h2><p className="mt-4 text-sm leading-7 text-muted">Ingata Church is in Kigali, Rwanda. Approved address, phone and email details will be added here.</p><div className="mt-6 border-y border-border py-5"><p className="text-xs font-bold">VISIT US</p><p className="mt-2 text-sm text-muted">Kigali, Rwanda · Exact meeting location to be confirmed</p><a className="mt-3 inline-block text-sm font-bold" href="https://maps.google.com/?q=Kigali%2C%20Rwanda" target="_blank" rel="noreferrer">Directions to Kigali ↗</a></div></aside><div className="surface-card p-6 sm:p-9"><p className="eyebrow text-clay">GENERAL CONTACT</p><h2 className="mt-3 text-2xl font-semibold">Send us a message</h2><p className="mb-6 mt-2 text-sm text-muted">For general questions, visitor inquiries or ministry information.</p><SubmissionForm /></div></section></main>;
  notFound();
}
