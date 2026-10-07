"use client";

import Link from "next/link";
import { useState } from "react";
import type { Sermon } from "@/lib/api/church-api";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "Africa/Kigali" }).format(new Date(`${date}T12:00:00`));
}

export function SermonLibrary({ sermons }: { sermons: Sermon[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [speaker, setSpeaker] = useState("all");
  const categories = [...new Set(sermons.map((sermon) => sermon.category))].sort();
  const speakers = [...new Set(sermons.map((sermon) => sermon.speaker))].sort();
  const visibleSermons = sermons.filter((sermon) => {
    const searchTarget = `${sermon.title} ${sermon.speaker} ${sermon.scripture ?? ""} ${sermon.category}`.toLowerCase();
    return searchTarget.includes(query.toLowerCase()) && (category === "all" || sermon.category === category) && (speaker === "all" || sermon.speaker === speaker);
  });

  return <>
    <form className="mt-8 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-[1fr_14rem_14rem]" role="search" onSubmit={(event) => event.preventDefault()}>
      <label className="block text-sm font-semibold sm:col-span-2 lg:col-span-1">Search messages
        <input className="form-field mt-2" onChange={(event) => setQuery(event.target.value)} placeholder="Title, speaker or Scripture" type="search" value={query} />
      </label>
      <label className="block text-sm font-semibold">Category
        <select className="form-field mt-2" onChange={(event) => setCategory(event.target.value)} value={category}><option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </label>
      <label className="block text-sm font-semibold">Speaker
        <select className="form-field mt-2" onChange={(event) => setSpeaker(event.target.value)} value={speaker}><option value="all">All speakers</option>{speakers.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      </label>
    </form>
    {visibleSermons.length ? <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{visibleSermons.map((sermon) => <article className="surface-card p-4 sm:p-6" key={sermon.id}>
      <p className="eyebrow text-primary">{sermon.category} · {formatDate(sermon.date)}</p>
      <h2 className="mt-3 text-xl font-semibold"><Link className="hover:text-primary-hover" href={`/sermons/${sermon.id}`}>{sermon.title}</Link></h2>
      <p className="mt-2 text-sm text-muted">{sermon.speaker}{sermon.scripture ? ` · ${sermon.scripture}` : ""}</p>
      {sermon.description && <p className="mt-4 text-sm leading-6 text-muted">{sermon.description}</p>}
      <div className="mt-5 grid gap-4">{sermon.audioUrl && <div><p className="mb-2 text-xs font-bold">AUDIO MESSAGE</p><audio className="h-11 w-full" controls preload="none" src={sermon.audioUrl}>Audio playback is not supported by your browser.</audio></div>}{sermon.videoUrl && <a className="inline-flex min-h-11 items-center text-sm font-bold text-primary hover:text-primary-hover" href={sermon.videoUrl} target="_blank" rel="noreferrer">Watch video ↗</a>}</div>
    </article>)}</div> : <div className="mt-6 border-y border-border py-12"><p className="eyebrow text-primary">SERMON LIBRARY</p><h2 className="mt-5 text-3xl font-medium">{sermons.length ? "No matching messages." : "A moment to pause and listen."}</h2><p className="mt-3 max-w-lg text-sm leading-7 text-muted">{sermons.length ? "Try a different search or adjust the speaker and category filters." : "Published sermons will appear here with speaker, date, Scripture reference, category and available audio or video."}</p></div>}
  </>;
}
