import { notFound } from "next/navigation";
import { PageHero } from "../../../components/page-hero";
import { getPublicData, type Sermon } from "../../../lib/church-api";

export default async function SermonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sermon = await getPublicData<Sermon>(`/sermons/${encodeURIComponent(id)}`);
  if (!sermon) notFound();
  return <main><PageHero eyebrow={`${sermon.category} · SERMON`} title={sermon.title} description={sermon.description ?? "A message from the Ingata Church community."} />
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_.65fr] lg:px-10 lg:py-20"><div><p className="text-[10px] font-bold tracking-[.2em] text-clay">LISTEN · WATCH · REFLECT</p><h2 className="mt-4 text-3xl font-medium">Take a moment to listen.</h2><p className="mt-4 text-sm leading-7 text-muted">{sermon.description || "Explore this teaching and its Scripture reference."}</p><div className="mt-8 space-y-6">{sermon.audioUrl && <div><p className="mb-2 text-xs font-bold">AUDIO MESSAGE</p><audio className="w-full" controls preload="none" src={sermon.audioUrl}>Audio playback is not supported by your browser.</audio></div>}{sermon.videoUrl && <a className="inline-flex bg-forest px-5 py-3.5 text-sm font-bold text-paper" href={sermon.videoUrl} target="_blank" rel="noreferrer">Watch video ↗</a>}{!sermon.audioUrl && !sermon.videoUrl && <p className="text-sm text-muted">Audio or video is not available for this message yet.</p>}</div></div><aside className="h-fit bg-[#eeeadf] p-6 sm:p-8"><p className="text-[10px] font-bold tracking-[.2em] text-muted">MESSAGE DETAILS</p><dl className="mt-5 divide-y divide-ink/10">{[["SPEAKER", sermon.speaker], ["DATE", sermon.date], ["SCRIPTURE", sermon.scripture || "Not listed"], ["CATEGORY", sermon.category]].map(([label, value]) => <div className="py-4" key={label}><dt className="text-[10px] font-bold tracking-wide text-muted">{label}</dt><dd className="mt-1 text-sm">{value}</dd></div>)}</dl></aside></section>
  </main>;
}
