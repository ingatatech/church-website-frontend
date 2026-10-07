"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicContent } from "@/lib/api/church-api";
import {
  announcementCategories,
  announcementCategoryLabel,
} from "@/lib/content/announcements";

export function AnnouncementList({ items }: { items: PublicContent[] }) {
  const [category, setCategory] = useState("");
  const filtered = useMemo(
    () => items.filter((item) => !category || item.details.category === category),
    [category, items],
  );

  return <>
    <div aria-label="Filter announcements by category" className="mb-8 flex gap-2 overflow-x-auto pb-2" role="group">
      <button aria-pressed={!category} className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${!category ? "border-primary bg-primary text-white" : "border-border bg-white hover:border-primary"}`} onClick={() => setCategory("")} type="button">All</button>
      {announcementCategories.map((option) => <button aria-pressed={category === option.value} className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${category === option.value ? "border-primary bg-primary text-white" : "border-border bg-white hover:border-primary"}`} key={option.value} onClick={() => setCategory(option.value)} type="button">{option.label}</button>)}
    </div>
    {filtered.length ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((item) => {
        const imageUrl = typeof item.details.imageUrl === "string" ? item.details.imageUrl : "";
        const categoryValue = typeof item.details.category === "string" ? item.details.category : "";
        const publicationDate = typeof item.details.publicationDate === "string" ? item.details.publicationDate : item.publishedAt;
        return <article className="surface-card overflow-hidden" key={item.id}>
          {imageUrl && <div className="relative aspect-video"><Image alt={item.title} className="object-cover" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={imageUrl} unoptimized /></div>}
          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2"><p className="eyebrow text-primary">{publicationDate ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "Africa/Kigali" }).format(new Date(publicationDate)) : "CHURCH UPDATE"}</p>{categoryValue && <span className="inline-flex min-h-7 items-center rounded-full border border-border px-3 text-xs">{announcementCategoryLabel(categoryValue)}</span>}</div>
            <h2 className="mt-3 text-xl font-semibold"><Link className="hover:text-primary-hover" href={`/announcements/${item.slug}`}>{item.title}</Link></h2>
            {item.description && <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted">{item.description}</p>}
            <Link className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-primary" href={`/announcements/${item.slug}`}>Read announcement <span className="ml-2" aria-hidden="true">↗</span></Link>
          </div>
        </article>;
      })}
    </div> : <div className="border-y border-border py-12"><p className="eyebrow text-primary">{category ? "NO MATCHING UPDATES" : "STAY IN THE LOOP"}</p><h2 className="mt-5 text-3xl font-medium">{category ? "No announcements found." : <>News, notes &amp;<br /><em className="font-display">good things.</em></>}</h2><p className="mt-4 max-w-lg text-sm leading-7 text-muted">{category ? "Try another category to see more church updates." : "Announcements and ministry updates will appear here when they are published. For an urgent question, please get in touch with the church."}</p>{category ? <button className="button button-primary mt-5" onClick={() => setCategory("")} type="button">Show all announcements</button> : <Link className="button button-primary mt-5" href="/contact">Contact the church ↗</Link>}</div>}
  </>;
}
