import Link from "next/link";
import Image from "next/image";
import { getPublicData, type PublicContent } from "@/lib/api/church-api";
import { announcementCategoryLabel } from "@/lib/content/announcements";
import { PageHero } from "../site/page-hero";

export async function AnnouncementDetailPage({ slug }: { slug: string }) {
  const item = await getPublicData<PublicContent>(`/content/announcements/${encodeURIComponent(slug)}`);
  const title = item?.title ?? slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return <main>
    <PageHero eyebrow="CHURCH ANNOUNCEMENT" title={title} description={item?.description ?? "More details about this church update will be shared when it is published."} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Announcements", href: "/announcements" }]} />
    <article className="reading-container section-space">
      {typeof item?.details.imageUrl === "string" && item.details.imageUrl && <div className="relative mb-8 aspect-[16/9] max-h-[32rem] overflow-hidden"><Image alt={title} className="object-cover" fill sizes="(max-width: 1024px) 100vw, 60vw" src={item.details.imageUrl} unoptimized /></div>}
      <div className="flex flex-wrap items-center gap-3"><p className="eyebrow text-clay">FROM OUR CHURCH COMMUNITY</p>{typeof item?.details.category === "string" && <span className="inline-flex min-h-8 items-center rounded-full border border-border px-3 text-xs">{announcementCategoryLabel(item.details.category)}</span>}{typeof item?.details.publicationDate === "string" && <time className="text-xs text-muted" dateTime={item.details.publicationDate}>{new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "Africa/Kigali" }).format(new Date(item.details.publicationDate))}</time>}</div>
      <h2 className="mt-4 text-3xl font-medium">{title}</h2>
      <p className="mt-5 text-sm leading-7 text-muted">{item?.description ?? "This announcement is part of the website content structure. Published details will be shown here when available."}</p>
      <Link className="button button-primary mt-7" href="/announcements">Back to announcements <span aria-hidden="true">&#8599;</span></Link>
    </article>
  </main>;
}
