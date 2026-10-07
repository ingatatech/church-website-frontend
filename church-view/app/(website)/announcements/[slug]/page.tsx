import type { Metadata } from "next";
import { AnnouncementDetailPage } from "@/components/public-pages/announcement-detail-page";

type AnnouncementParams = { slug: string };

function titleFromSlug(slug: string) {
  return slug.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<AnnouncementParams> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: titleFromSlug(slug),
    description: "Church update from our community in Kigali.",
    alternates: { canonical: `/announcements/${slug}` },
  };
}

export default async function AnnouncementRoute({ params }: { params: Promise<AnnouncementParams> }) {
  const { slug } = await params;
  return <AnnouncementDetailPage slug={slug} />;
}
