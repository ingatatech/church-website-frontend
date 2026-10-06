import { PageHero } from "../../../components/page-hero";
import { getPublicData, type Sermon } from "../../../lib/church-api";

export default async function SermonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sermon = await getPublicData<Sermon>(`/sermons/${encodeURIComponent(id)}`);
  const title = sermon?.title ?? id.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return <main><PageHero eyebrow={`${sermon?.category ?? "SERMON"} · MESSAGE`} title={title} description={sermon?.description ?? "A message from the Ingata Church community. Audio, video and teaching details will appear when published."} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sermons", href: "/sermons" }]} />
    <section className="page-container section-space grid gap-10 lg:grid-cols-[1fr_.65fr]"><div><p className="eyebrow text-clay">LISTEN · WATCH · REFLECT</p><h2 className="mt-4 text-3xl font-medium">Take a moment to listen.</h2><p className="mt-4 text-sm leading-7 text-muted">{sermon?.description || "Explore this teaching and its Scripture reference."}</p><div className="mt-8 space-y-6">{sermon?.audioUrl && <div><p className="mb-2 text-xs font-bold">AUDIO MESSAGE</p><audio className="w-full" controls preload="none" src={sermon.audioUrl}>Audio playback is not supported by your browser.</audio></div>}{sermon?.videoUrl && <a className="button button-primary" href={sermon.videoUrl} target="_blank" rel="noreferrer">Watch video ↗</a>}{!sermon?.audioUrl && !sermon?.videoUrl && <p className="text-sm text-muted">Audio or video will be available here when this message is published.</p>}</div></div><aside className="surface-card h-fit p-6 sm:p-8"><p className="eyebrow text-muted">MESSAGE DETAILS</p><dl className="mt-5 divide-y divide-border">{[["SPEAKER", sermon?.speaker ?? "To be confirmed"], ["DATE", sermon?.date ?? "To be confirmed"], ["SCRIPTURE", sermon?.scripture || "Not listed"], ["CATEGORY", sermon?.category ?? "Message"]].map(([label, value]) => <div className="py-4" key={label}><dt className="eyebrow text-muted">{label}</dt><dd className="mt-1 text-sm">{value}</dd></div>)}</dl></aside></section>
  </main>;
}
