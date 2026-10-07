"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
import { Archive, CalendarClock, Check, ImagePlus, Pencil, Search, Upload, X } from "lucide-react";
import { authGet, authMutation, authUpload } from "@/lib/api/church-api";
import {
  announcementCategories,
  announcementCategoryLabel,
  announcementStatuses,
  type Announcement,
  type AnnouncementCategory,
  type AnnouncementStatus,
} from "@/lib/content/announcements";

const maxImageSize = 15 * 1024 * 1024;
const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function slugFromTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function localDateTime(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function statusStyle(status: AnnouncementStatus) {
  if (status === "PUBLISHED") return "bg-green-50 text-green-800";
  if (status === "SCHEDULED") return "bg-indigo-50 text-indigo-800";
  if (status === "EXPIRED" || status === "ARCHIVED") return "bg-slate-100 text-slate-700";
  if (status === "UNPUBLISHED") return "bg-orange-50 text-orange-800";
  return "bg-amber-50 text-amber-800";
}

export function AnnouncementManager() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<AnnouncementStatus | "">("");
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory | "">("");
  const [publicationDate, setPublicationDate] = useState(localDateTime());
  const [expiryDate, setExpiryDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [processingId, setProcessingId] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadAnnouncements = useCallback(async () => {
    const result = await authGet<{ items: Announcement[] }>("/admin/announcements");
    setItems(result.items);
  }, []);

  useEffect(() => {
    let active = true;
    authGet<{ items: Announcement[] }>("/admin/announcements").then(
      (result) => { if (active) setItems(result.items); },
      (cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load announcements."); },
    ).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    const timer = window.setTimeout(() => setCurrentTime(Date.now()), 0);
    const interval = window.setInterval(() => setCurrentTime(Date.now()), 60_000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) =>
      (!normalized || item.title.toLowerCase().includes(normalized)) &&
      (!categoryFilter || item.details.category === categoryFilter) &&
      (!statusFilter || item.details.status === statusFilter),
    );
  }, [categoryFilter, items, query, statusFilter]);

  function resetForm(record?: Announcement) {
    setEditing(record ?? null);
    setTitle(record?.title ?? "");
    setSlug(record?.slug ?? "");
    setSlugEdited(Boolean(record));
    setDescription(record?.description ?? "");
    setCategory(record?.details.category ?? "");
    setPublicationDate(localDateTime(record?.details.publicationDate));
    setExpiryDate(localDateTime(record?.details.expiryDate ?? undefined));
    setImageUrl(record?.details.imageUrl ?? "");
    setPreviewUrl("");
    setImageName("");
    setError("");
    setNotice("");
    if (inputRef.current) inputRef.current.value = "";
    setModalOpen(true);
  }

  async function uploadImage(file: File) {
    setError("");
    if (!acceptedImageTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > maxImageSize) {
      setError("The image must be 15 MB or smaller.");
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    setImageName(file.name);
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const uploaded = await authUpload<{ url: string }>("/media/upload", form);
      if (!uploaded?.url) throw new Error("The upload service did not return an image URL.");
      setImageUrl(uploaded.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not upload this image.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDropImage(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) void uploadImage(file);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const action = String(form.get("action") ?? "DRAFT") as AnnouncementStatus;
    const publicationTimestamp = new Date(publicationDate).getTime();
    const expiryTimestamp = expiryDate ? new Date(expiryDate).getTime() : null;
    if (!imageUrl) {
      setError("Choose an image for this announcement before saving.");
      return;
    }
    if (Number.isNaN(publicationTimestamp)) {
      setError("Enter a valid publication date and time.");
      return;
    }
    if (action === "SCHEDULED" && publicationTimestamp <= Date.now()) {
      setError("Choose a future publication date to schedule this announcement.");
      return;
    }
    if (action === "PUBLISHED" && publicationTimestamp > Date.now()) {
      setError("This publication date is in the future. Choose Schedule instead.");
      return;
    }
    if (expiryDate && (Number.isNaN(expiryTimestamp) || expiryTimestamp! <= publicationTimestamp)) {
      setError("The expiry date must be later than the publication date.");
      return;
    }
    if (action === "PUBLISHED" && !editing && !window.confirm("Publish this announcement now?")) return;
    if (action === "SCHEDULED" && !window.confirm("Schedule this announcement for the selected publication date?")) return;

    setSaving(true);
    setError("");
    setNotice("");
    const body = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      imageUrl,
      category,
      publicationDate: new Date(publicationDate).toISOString(),
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
      status: action,
    };
    try {
      if (editing) {
        await authMutation(`/admin/announcements/${editing.id}`, "PATCH", body);
      } else {
        await authMutation("/admin/announcements", "POST", body);
      }
      setModalOpen(false);
      setNotice(editing ? "Announcement updated." : "Announcement created.");
      await loadAnnouncements();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this announcement.");
    } finally {
      setSaving(false);
    }
  }

  async function changeState(item: Announcement, action: "publish" | "schedule" | "unpublish" | "archive") {
    const confirmations = {
      publish: `Publish “${item.title}” now?`,
      schedule: `Schedule “${item.title}” for ${formatDate(item.details.publicationDate)}?`,
      unpublish: `Unpublish “${item.title}”? It will no longer appear publicly.`,
      archive: `Archive “${item.title}”? It will be removed from active announcement listings.`,
    };
    if (!window.confirm(confirmations[action])) return;
    setError("");
    setNotice("");
    setProcessingId(item.id);
    try {
      await authMutation(`/admin/announcements/${item.id}/${action}`, "POST");
      const actionLabel = {
        publish: "published",
        schedule: "scheduled",
        unpublish: "unpublished",
        archive: "archived",
      }[action];
      setNotice(`Announcement ${actionLabel}.`);
      await loadAnnouncements();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `Could not ${action} this announcement.`);
    } finally {
      setProcessingId("");
    }
  }

  function availableActions(item: Announcement) {
    const status = item.details.status;
    const actions: { label: string; action: "publish" | "schedule" | "unpublish" | "archive"; icon: typeof Check }[] = [];
    if (status === "DRAFT" || status === "UNPUBLISHED" || status === "EXPIRED") {
      const isFuture = Date.parse(item.details.publicationDate) > currentTime;
      actions.push(isFuture
        ? { label: "Schedule", action: "schedule", icon: CalendarClock }
        : { label: "Publish", action: "publish", icon: Check });
    } else if (status === "PUBLISHED") {
      actions.push({ label: "Unpublish", action: "unpublish", icon: X });
    } else if (status === "SCHEDULED") {
      actions.push({ label: "Unpublish", action: "unpublish", icon: X });
    }
    if (status !== "ARCHIVED") actions.push({ label: "Archive", action: "archive", icon: Archive });
    return actions;
  }

  return <div>
    <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-indigo-700">Church · Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Announcements</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Create, schedule, publish, unpublish and archive church announcements.</p>
      </div>
      <button className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700" onClick={() => resetForm()} type="button">
        <ImagePlus aria-hidden="true" className="mr-2 size-4" /> Add announcement
      </button>
    </header>

    {error && !modalOpen && <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
    {notice && <p className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">{notice}</p>}

    <section aria-label="Announcement management" className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_14rem_14rem] sm:p-6">
        <label className="relative block">
          <span className="sr-only">Search announcement titles</span><Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input className="h-11 w-full border border-slate-300 bg-slate-50 pl-10 pr-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" onChange={(event) => setQuery(event.target.value)} placeholder="Search by title" type="search" value={query} />
        </label>
        <label className="text-sm font-medium text-slate-700"><span className="sr-only">Filter announcements by category</span>
          <select className="h-11 w-full border border-slate-300 bg-slate-50 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" onChange={(event) => setCategoryFilter(event.target.value)} value={categoryFilter}>
            <option value="">All categories</option>{announcementCategories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700"><span className="sr-only">Filter announcements by status</span>
          <select className="h-11 w-full border border-slate-300 bg-slate-50 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" onChange={(event) => setStatusFilter(event.target.value as AnnouncementStatus | "")} value={statusFilter}>
            {announcementStatuses.map((option) => <option key={option.value || "all"} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      </div>
      {loading ? <p className="p-8 text-sm text-slate-500">Loading announcements…</p> : filteredItems.length ? <div className="divide-y divide-slate-100">
        {filteredItems.map((item) => <article className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[5rem_minmax(0,1.1fr)_minmax(8rem,.8fr)_minmax(9rem,.9fr)_minmax(8rem,.8fr)_auto] lg:items-center" key={item.id}>
          <div className="relative aspect-[4/3] w-20 overflow-hidden bg-slate-100">
            {item.details.imageUrl ? <Image alt="" className="object-cover" fill sizes="80px" src={item.details.imageUrl} unoptimized /> : <div className="grid h-full place-items-center text-xs text-slate-500">No image</div>}
          </div>
          <div className="min-w-0"><h2 className="truncate font-semibold text-slate-900">{item.title}</h2><p className="mt-1 truncate text-xs text-slate-500">/{item.slug}</p><p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.description}</p></div>
          <p className="text-sm text-slate-700">{announcementCategoryLabel(item.details.category)}</p>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600 lg:block"><dt className="font-semibold text-slate-500">Publishes</dt><dd>{formatDate(item.details.publicationDate)}</dd><dt className="font-semibold text-slate-500 lg:mt-1">Expires</dt><dd>{formatDate(item.details.expiryDate)}</dd></dl>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600 lg:block"><dt className="sr-only">Status</dt><dd><span className={`inline-flex rounded-full px-2.5 py-1 font-semibold ${statusStyle(item.details.status)}`}>{item.details.status[0] + item.details.status.slice(1).toLowerCase()}</span></dd><dt className="font-semibold text-slate-500 lg:mt-2">Created</dt><dd>{formatDate(item.createdAt)}</dd><dt className="font-semibold text-slate-500 lg:mt-1">Updated</dt><dd>{formatDate(item.updatedAt)}</dd></dl>
          <div className="flex flex-wrap items-center gap-2">
            {item.details.status === "PUBLISHED" && <a className="inline-flex min-h-9 items-center px-2 text-xs font-semibold text-indigo-700 hover:underline" href={`/announcements/${item.slug}`} rel="noreferrer" target="_blank">View</a>}
            <button aria-label={`Edit ${item.title}`} className="grid size-9 place-items-center border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700" onClick={() => resetForm(item)} type="button"><Pencil aria-hidden="true" className="size-4" /></button>
            {availableActions(item).map(({ label, action, icon: Icon }) => <button className="inline-flex min-h-9 items-center gap-1.5 border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-wait disabled:opacity-60" disabled={Boolean(processingId)} key={action} onClick={() => void changeState(item, action)} type="button"><Icon aria-hidden="true" className={`size-3.5 ${processingId === item.id ? "animate-pulse" : ""}`} />{processingId === item.id ? `${label}…` : label}</button>)}
          </div>
        </article>)}
      </div> : <div className="p-10 text-center"><h2 className="font-semibold text-slate-900">No announcements found.</h2><p className="mt-2 text-sm text-slate-500">{query || categoryFilter || statusFilter ? "Try changing your search or filters." : "Create an announcement to share church updates."}</p></div>}
    </section>

    {modalOpen && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving && !uploading) setModalOpen(false); }}>
      <section aria-labelledby="announcement-form-title" aria-modal="true" className="max-h-[96vh] w-full max-w-3xl overflow-y-auto rounded-t-xl bg-white shadow-2xl sm:rounded-xl" role="dialog">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div><h2 className="text-xl font-semibold text-slate-900" id="announcement-form-title">{editing ? "Edit announcement" : "Create announcement"}</h2><p className="mt-1 text-sm text-slate-500">Choose an image, category and publication timing.</p></div>
          <button aria-label="Close editor" className="grid size-9 place-items-center border border-slate-200 text-slate-500 hover:bg-slate-50" disabled={saving || uploading} onClick={() => setModalOpen(false)} type="button"><X aria-hidden="true" className="size-4" /></button>
        </div>
        <form className="space-y-5 p-5 sm:p-7" onSubmit={(event) => void submit(event)}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">Title <span className="text-red-600">*</span>
              <input className="mt-2 h-11 w-full border border-slate-300 bg-slate-50 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" maxLength={180} onChange={(event) => { const value = event.target.value; setTitle(value); if (!slugEdited) setSlug(slugFromTitle(value)); }} required value={title} />
            </label>
            <label className="block text-sm font-medium text-slate-700">URL slug <span className="text-red-600">*</span>
              <input className="mt-2 h-11 w-full border border-slate-300 bg-slate-50 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" maxLength={200} onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required value={slug} />
              <span className="mt-1 block text-xs text-slate-500">Generated from the title; edit to use a custom slug.</span>
            </label>
            <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Description <span className="text-red-600">*</span>
              <textarea className="mt-2 min-h-36 w-full border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm leading-6 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" maxLength={10000} onChange={(event) => setDescription(event.target.value)} required value={description} />
            </label>
            <label className="block text-sm font-medium text-slate-700">Category <span className="text-red-600">*</span>
              <select className="mt-2 h-11 w-full border border-slate-300 bg-slate-50 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" onChange={(event) => setCategory(event.target.value as AnnouncementCategory | "")} required value={category}>
                <option value="">Choose a category</option>{announcementCategories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">Publication date <span className="text-red-600">*</span>
              <input className="mt-2 h-11 w-full border border-slate-300 bg-slate-50 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" onChange={(event) => { setPublicationDate(event.target.value); setCurrentTime(Date.now()); }} required type="datetime-local" value={publicationDate} />
            </label>
            <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Expiry date <span className="font-normal text-slate-500">(optional)</span>
              <input className="mt-2 h-11 w-full border border-slate-300 bg-slate-50 px-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100" onChange={(event) => setExpiryDate(event.target.value)} type="datetime-local" value={expiryDate} />
              <span className="mt-1 block text-xs text-slate-500">Leave empty if this announcement should not expire automatically.</span>
            </label>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-slate-700">Announcement image <span className="text-red-600">*</span></p>
              {imageUrl ? <div className="mt-2 grid gap-4 border border-slate-200 p-3 sm:grid-cols-[12rem_1fr] sm:items-center">
                <div className="relative aspect-video overflow-hidden bg-slate-100"><Image alt={`Preview of ${title || "announcement"}`} className="object-cover" fill sizes="192px" src={previewUrl || imageUrl} unoptimized /></div>
                <div><p className="break-all text-sm font-semibold text-slate-800">{imageName || "Current announcement image"}</p>{uploading && <p className="mt-1 text-xs text-indigo-700" role="status">Uploading image…</p>}{previewUrl && !uploading && !imageUrl && <p className="mt-1 text-xs text-red-700">Upload failed. Replace the image and try again.</p>}<div className="mt-3 flex gap-3"><button className="min-h-10 border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50" disabled={uploading} onClick={() => inputRef.current?.click()} type="button">Replace</button><button className="min-h-10 border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50" disabled={uploading} onClick={() => { setImageUrl(""); setImageName(""); setPreviewUrl(""); }} type="button">Remove</button></div></div>
              </div> : <button className="mt-2 flex min-h-36 w-full flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-slate-600 transition hover:border-indigo-400 hover:bg-indigo-50/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" disabled={uploading} onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={onDropImage} type="button">
                {uploading ? <><Upload aria-hidden="true" className="size-7 animate-pulse text-indigo-600" /><span className="mt-2 text-sm font-semibold">Uploading image…</span></> : <><ImagePlus aria-hidden="true" className="size-7 text-slate-400" /><span className="mt-2 text-sm font-semibold">Drag &amp; drop an image here or click to browse</span><span className="mt-1 text-xs">JPEG, PNG, WebP, or GIF · maximum 15 MB</span></>}
              </button>}
              <input accept={acceptedImageTypes.join(",")} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file); }} ref={inputRef} type="file" />
            </div>
          </div>
          {error && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:flex-wrap sm:justify-end">
            <button className="min-h-11 border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50" disabled={saving || uploading} onClick={() => setModalOpen(false)} type="button">Cancel</button>
            <button className="min-h-11 border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50" disabled={saving || uploading || !imageUrl} name="action" type="submit" value={editing?.details.status ?? "DRAFT"}>{saving ? "Saving…" : editing ? "Save Changes" : "Save Draft"}</button>
            {Date.parse(publicationDate) > currentTime ? <button className="inline-flex min-h-11 items-center justify-center gap-2 bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50" disabled={saving || uploading || !imageUrl} name="action" type="submit" value="SCHEDULED"><CalendarClock aria-hidden="true" className="size-4" />{saving ? "Saving…" : "Schedule"}</button> : <button className="inline-flex min-h-11 items-center justify-center gap-2 bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50" disabled={saving || uploading || !imageUrl} name="action" type="submit" value="PUBLISHED"><Check aria-hidden="true" className="size-4" />{saving ? "Saving…" : editing ? "Save & Publish" : "Publish Now"}</button>}
          </div>
        </form>
      </section>
    </div>}
  </div>;
}
