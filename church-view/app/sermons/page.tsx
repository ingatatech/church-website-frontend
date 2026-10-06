import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { getPublicData, type Sermon } from "../../lib/church-api";

function sermonDate(date: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "Africa/Kigali" }).format(new Date(`${date}T12:00:00`));
}

export default async function SermonsPage() {
  const sermons = await getPublicData<Sermon[]>("/sermons");
  const categories = [...new Set((sermons ?? []).map((sermon) => sermon.category))];
  return <main><PageHero eyebrow="SERMONS & MEDIA" title="Words for the" emphasis="way ahead." description="Watch or listen to sermons, explore teaching by topic and take a little encouragement with you." />
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20"><div className="flex flex-wrap gap-2">{(categories.length ? categories : ["Teaching", "Bible study", "Worship"]).map((category) => <span className="border border-ink/15 px-4 py-2 text-xs" key={category}>{category}</span>)}</div>
      {sermons?.length ? <div className="mt-8 grid gap-4 md:grid-cols-2">{sermons.map((sermon) => <article className="bg-[#eeeadf] p-6" key={sermon.id}><p className="text-[10px] font-bold tracking-[.16em] text-clay">{sermon.category} · {sermonDate(sermon.date)}</p><h2 className="mt-3 text-2xl font-semibold"><Link className="hover:text-clay" href={`/sermons/${sermon.id}`}>{sermon.title}</Link></h2><p className="mt-2 text-sm text-muted">{sermon.speaker}{sermon.scripture ? ` · ${sermon.scripture}` : ""}</p>{sermon.description && <p className="mt-4 text-sm leading-6 text-muted">{sermon.description}</p>}<div className="mt-5 flex flex-wrap gap-4">{sermon.audioUrl && <audio className="h-10 max-w-full" controls preload="none" src={sermon.audioUrl}>Audio playback is not supported by your browser.</audio>}{sermon.videoUrl && <a className="self-center text-sm font-bold" href={sermon.videoUrl} target="_blank" rel="noreferrer">Watch video ↗</a>}</div></article>)}</div> : <div className="mt-8 border-y border-ink/15 py-12"><p className="text-[10px] font-bold tracking-[.2em] text-clay">SERMON LIBRARY</p><h2 className="mt-5 text-3xl font-medium">A moment to pause<br />and <em className="font-display">listen.</em></h2><p className="mt-4 max-w-lg text-sm leading-7 text-muted">Published sermons will appear here with speaker, date, Scripture reference, category and available audio or video.</p></div>}
    </section>
  </main>;
}
