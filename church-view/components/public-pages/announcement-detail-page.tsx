import Link from "next/link";
import { getPublicData, type PublicContent } from "@/lib/api/church-api";
import { PageHero } from "../site/page-hero";

export async function AnnouncementDetailPage({ slug }: { slug: string }) {
  const item = await getPublicData<PublicContent>(`/content/announcements/${encodeURIComponent(slug)}`);
  const title = item?.title ?? slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return <main>
    <PageHero eyebrow="CHURCH ANNOUNCEMENT" title={title} description={item?.description ?? "More details about this church update will be shared when it is published."} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Announcements", href: "/announcements" }]} />
    <article className="reading-container section-space">
      <p className="eyebrow text-clay">FROM OUR CHURCH COMMUNITY</p>
      <h2 className="mt-4 text-3xl font-medium">Stay connected.</h2>
      <p className="mt-5 text-sm leading-7 text-muted">{item?.description ?? "This announcement is part of the website content structure. Published details will be shown here when available."}</p>
      <Link className="button button-primary mt-7" href="/announcements">Back to announcements <span aria-hidden="true">&#8599;</span></Link>
    </article>
  </main>;
}
