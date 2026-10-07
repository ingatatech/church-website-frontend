"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { authGet, authMutation } from "@/lib/api/church-api";

type Section = "sermons" | "events" | "ministries" | "resources" | "leadership" | "settings";
type Field = {
  name: string;
  label: string;
  type?: "text" | "url" | "date" | "time" | "textarea" | "checkbox" | "select";
  required?: boolean;
  storage?: "details";
  options?: { value: string; label: string }[];
};
type ManagedRecord = {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  details?: Record<string, unknown>;
  published?: boolean;
  status?: string;
  date?: string;
  time?: string;
  category?: string;
  updatedAt?: string;
  createdAt?: string;
  [key: string]: unknown;
};
type ManagerConfig = {
  title: string;
  description: string;
  api: string;
  contentType?: string;
  fields: Field[];
  archive?: boolean;
};

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const configs: Record<Section, ManagerConfig> = {
  sermons: {
    title: "Sermons",
    description: "Manage messages, speakers, scripture references, and media links.",
    api: "/sermons",
    fields: [
      { name: "title", label: "Sermon title", required: true },
      { name: "speaker", label: "Speaker", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "category", label: "Category", required: true },
      { name: "scripture", label: "Scripture reference" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "audioUrl", label: "Audio URL", type: "url" },
      { name: "videoUrl", label: "Video URL", type: "url" },
      { name: "status", label: "Publication status", type: "select", required: true, options: statusOptions },
    ],
    archive: true,
  },
  events: {
    title: "Events",
    description: "Create and update the church calendar and event details.",
    api: "/events",
    fields: [
      { name: "name", label: "Event name", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "time", label: "Time", type: "time", required: true },
      { name: "location", label: "Location", required: true },
      { name: "speaker", label: "Speaker" },
      { name: "flyerUrl", label: "Flyer URL", type: "url" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "registrationRequired", label: "Registration required", type: "checkbox" },
      { name: "status", label: "Publication status", type: "select", required: true, options: statusOptions },
    ],
    archive: true,
  },
  ministries: {
    title: "Ministries",
    description: "Manage ministry descriptions, leaders, and images.",
    api: "/ministries",
    fields: [
      { name: "name", label: "Ministry name", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "leader", label: "Leader" },
      { name: "imageUrl", label: "Image URL", type: "url" },
      { name: "status", label: "Publication status", type: "select", required: true, options: statusOptions },
    ],
    archive: true,
  },
  resources: {
    title: "Resources",
    description: "Manage church documents, guides, and useful links.",
    api: "/admin/content/resources",
    contentType: "resources",
    fields: [
      { name: "title", label: "Resource title", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "category", label: "Category", storage: "details" },
      { name: "resourceType", label: "Resource type", storage: "details" },
      { name: "url", label: "Resource URL", type: "url", storage: "details" },
      { name: "status", label: "Publication status", type: "select", required: true, options: statusOptions.slice(0, 2) },
    ],
  },
  leadership: {
    title: "Leadership",
    description: "Maintain approved leader profiles and ministry roles.",
    api: "/admin/content/leaders",
    contentType: "leaders",
    fields: [
      { name: "title", label: "Leader name", required: true },
      { name: "slug", label: "URL slug", required: true },
      { name: "description", label: "Biography", type: "textarea" },
      { name: "role", label: "Role", storage: "details" },
      { name: "ministry", label: "Ministry", storage: "details" },
      { name: "imageUrl", label: "Image URL", type: "url", storage: "details" },
      { name: "status", label: "Publication status", type: "select", required: true, options: statusOptions.slice(0, 2) },
    ],
  },
  settings: {
    title: "Church settings",
    description: "Store the approved public church profile and visitor information.",
    api: "/admin/content/settings",
    contentType: "settings",
    fields: [
      { name: "title", label: "Church name", required: true },
      { name: "slug", label: "Profile key", required: true },
      { name: "city", label: "City", storage: "details" },
      { name: "country", label: "Country", storage: "details" },
      { name: "address", label: "Street address", storage: "details" },
      { name: "serviceSchedule", label: "Service schedule", storage: "details" },
      { name: "publicEmail", label: "Public email", storage: "details" },
      { name: "publicPhone", label: "Public phone", storage: "details" },
      { name: "description", label: "Welcome message", type: "textarea" },
      { name: "status", label: "Publication status", type: "select", required: true, options: statusOptions.slice(0, 2) },
    ],
  },
};

function readField(record: ManagedRecord, field: Field) {
  const value = field.storage === "details" ? record.details?.[field.name] : record[field.name];
  return value == null ? "" : String(value);
}

function statusOf(record: ManagedRecord, isContent: boolean): string {
  return isContent ? (record.published ? "published" : "draft") : record.status ?? "draft";
}

function descriptionOf(record: ManagedRecord) {
  const value = record.description ?? record.category ?? record.details?.category ?? record.details?.role;
  return typeof value === "string" ? value : "—";
}

function nameOf(record: ManagedRecord) {
  return typeof record.title === "string" ? record.title : typeof record.name === "string" ? record.name : "";
}

function secondaryLabel(record: ManagedRecord) {
  const value = [record.slug, record.speaker, record.location, record.date].find((item) => typeof item === "string");
  return typeof value === "string" ? value : "";
}

function displayDate(value?: string) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(parsed);
}

export function AdminRecordManager({ section }: { section: Section }) {
  const config = configs[section];
  const isContent = Boolean(config.contentType);
  const [records, setRecords] = useState<ManagedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<ManagedRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchRecords = useCallback(async () => {
    const result = await authGet<ManagedRecord[] | { items?: ManagedRecord[] }>(
      isContent ? config.api : `/admin${config.api}`,
    );
    const loaded = Array.isArray(result) ? result : result.items ?? [];
    return loaded;
  }, [config.api, isContent]);

  const loadRecords = useCallback(async () => {
    try {
      setRecords(await fetchRecords());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load these records.");
    }
  }, [fetchRecords]);

  useEffect(() => {
    let active = true;
    fetchRecords().then(
      (loaded) => { if (active) setRecords(loaded); },
      (cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load these records."); },
    ).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fetchRecords]);

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return records;
    return records.filter((record) => `${record.title ?? record.name ?? ""} ${record.slug ?? ""} ${record.description ?? ""}`.toLowerCase().includes(normalized));
  }, [query, records]);

  function openNewRecord() {
    setEditing(null);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function openEditRecord(record: ManagedRecord) {
    setEditing(record);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const fields = Object.fromEntries(config.fields.filter((field) => field.name !== "status").map((field) => [
      field.name,
      field.type === "checkbox" ? values.has(field.name) : String(values.get(field.name) ?? "").trim(),
    ]));
    const status = String(values.get("status") ?? "draft");
    setSaving(true);
    setError("");
    const body = isContent
      ? {
          type: config.contentType,
          title: fields.title,
          slug: fields.slug,
          description: fields.description || undefined,
          details: {
            ...Object.fromEntries(config.fields.filter((field) => field.storage === "details").map((field) => {
              const value = fields[field.name];
              return [field.name, value];
            })),
          },
          published: status === "published",
        }
      : { ...fields, status };

    try {
      if (editing) {
        const path = isContent ? `/admin/content/${editing.id}` : `${config.api}/${editing.id}`;
        await authMutation(path, "PATCH", body);
      } else {
        const path = isContent ? "/admin/content" : config.api;
        await authMutation(path, "POST", body);
      }
      setModalOpen(false);
      setNotice(editing ? "Changes saved." : "Record created.");
      await loadRecords();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this record.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord(record: ManagedRecord) {
    const title = record.title ?? record.name ?? "this record";
    if (!window.confirm(`Delete “${title}”? This action cannot be undone.`)) return;
    setError("");
    setNotice("");
    try {
      const path = isContent ? `/admin/content/${record.id}` : `${config.api}/${record.id}`;
      await authMutation(path, "DELETE");
      setNotice("Record deleted.");
      await loadRecords();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete this record.");
    }
  }

  return (
    <div>
      <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-indigo-700">Church · Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{config.title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{config.description}</p>
        </div>
        <button className="inline-flex min-h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700" onClick={openNewRecord} type="button">
          <Plus aria-hidden="true" className="mr-2 size-4" /> Add record
        </button>
      </header>

      {error && <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
      {notice && <p className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">{notice}</p>}

      <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-label={`${config.title} management`}>
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-semibold text-slate-900">All {config.title.toLowerCase()}</h2>
            <p className="mt-1 text-sm text-slate-500">{records.length} record{records.length === 1 ? "" : "s"} in the database</p>
          </div>
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Search {config.title}</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input className="h-11 w-full border border-slate-300 bg-slate-50 pl-10 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}`} type="search" value={query} />
          </label>
        </div>

        {loading ? <p className="p-8 text-sm text-slate-500">Loading records…</p> : filteredRecords.length ? <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr>
                <th className="px-6 py-3.5" scope="col">Name</th><th className="px-6 py-3.5" scope="col">Details</th><th className="px-6 py-3.5" scope="col">Status</th><th className="px-6 py-3.5" scope="col">Updated</th><th className="px-6 py-3.5 text-right" scope="col">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">{filteredRecords.map((record) => {
                const status = statusOf(record, isContent);
                const updated = record.updatedAt ?? record.createdAt;
                return <tr className="hover:bg-slate-50/70" key={record.id}>
                  <td className="max-w-xs px-6 py-4"><p className="truncate font-semibold text-slate-900">{nameOf(record)}</p><p className="mt-1 truncate text-xs text-slate-500">{secondaryLabel(record)}</p></td>
                  <td className="max-w-sm px-6 py-4 text-slate-600"><span className="line-clamp-2">{descriptionOf(record)}</span></td>
                  <td className="px-6 py-4"><span className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-semibold capitalize ${status === "published" ? "bg-green-50 text-green-800" : status === "archived" ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-800"}`}>{status.replaceAll("_", " ")}</span></td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">{displayDate(updated)}</td>
                  <td className="px-6 py-4"><div className="flex justify-end gap-2">
                    <button aria-label={`Edit ${record.title ?? record.name}`} className="grid size-9 place-items-center border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700" onClick={() => openEditRecord(record)} type="button"><Pencil aria-hidden="true" className="size-4" /></button>
                    <button aria-label={`Delete ${record.title ?? record.name}`} className="grid size-9 place-items-center border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-700" onClick={() => void deleteRecord(record)} type="button"><Trash2 aria-hidden="true" className="size-4" /></button>
                  </div></td>
                </tr>;
              })}</tbody>
            </table>
          </div>
          <div className="divide-y divide-slate-100 md:hidden">{filteredRecords.map((record) => {
            const status = statusOf(record, isContent);
            return <article className="p-5" key={record.id}>
              <div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-slate-900">{nameOf(record)}</h3><span className="rounded-sm bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">{status}</span></div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{descriptionOf(record)}</p>
              <p className="mt-3 text-xs text-slate-500">Updated {displayDate(record.updatedAt ?? record.createdAt)}</p>
              <div className="mt-4 flex gap-3">
                <button className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-indigo-700" onClick={() => openEditRecord(record)} type="button"><Pencil aria-hidden="true" className="size-4" /> Edit</button>
                <button className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-red-700" onClick={() => void deleteRecord(record)} type="button"><Trash2 aria-hidden="true" className="size-4" /> Delete</button>
              </div>
            </article>;
          })}</div>
        </> : <div className="p-10 text-center">
          <h3 className="font-semibold text-slate-900">{query ? "No matching records" : `No ${config.title.toLowerCase()} yet`}</h3>
          <p className="mt-2 text-sm text-slate-500">{query ? "Try another search term." : "Add a record to get started. Drafts remain private until published."}</p>
          {!query && <button className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700" onClick={openNewRecord} type="button"><Plus aria-hidden="true" className="mr-2 size-4" />Add record</button>}
        </div>}
      </section>

      {modalOpen && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
        <section aria-labelledby="record-form-title" aria-modal="true" className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-white shadow-2xl sm:rounded-xl" role="dialog">
          <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
            <div><h2 className="text-xl font-semibold text-slate-900" id="record-form-title">{editing ? `Edit ${config.title.slice(0, -1)}` : `Add ${config.title.slice(0, -1)}`}</h2><p className="mt-1 text-sm text-slate-500">Complete the fields and choose whether to publish this record.</p></div>
            <button aria-label="Close editor" className="grid size-9 place-items-center border border-slate-200 text-slate-500 hover:bg-slate-50" onClick={() => setModalOpen(false)} type="button"><X aria-hidden="true" className="size-4" /></button>
          </div>
          <form className="space-y-5 p-5 sm:p-7" key={editing?.id ?? "new-record"} onSubmit={saveRecord}>
            <div className="grid gap-5 sm:grid-cols-2">{config.fields.map((field) => {
              const value = field.name === "status" ? statusOf(editing ?? { id: "" }, isContent) : editing ? readField(editing, field) : "";
              const wide = field.type === "textarea" || field.name === "status" || field.type === "checkbox";
              if (field.type === "checkbox") return <label className="flex min-h-11 items-center gap-3 text-sm font-medium text-slate-700 sm:col-span-2" key={field.name}><input className="size-4 accent-indigo-600" defaultChecked={Boolean(editing?.[field.name])} name={field.name} type="checkbox" />{field.label}</label>;
              return <label className={`block text-sm font-medium text-slate-700 ${wide ? "sm:col-span-2" : ""}`} key={field.name}>
                {field.label}{field.required && <span className="ml-1 text-red-600">*</span>}
                {field.type === "textarea" ? <textarea className="mt-2 min-h-28 w-full border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" defaultValue={value} maxLength={field.name === "description" ? 10000 : undefined} name={field.name} required={field.required} /> : field.type === "select" ? <select className="mt-2 h-11 w-full border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" defaultValue={value || "draft"} name={field.name} required={field.required}>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input className="mt-2 h-11 w-full border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100" defaultValue={value} maxLength={field.name === "title" || field.name === "name" ? 180 : undefined} name={field.name} required={field.required} type={field.type ?? "text"} />}
              </label>;
            })}</div>
            {error && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button className="min-h-11 border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setModalOpen(false)} type="button">Cancel</button>
              <button className="min-h-11 bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60" disabled={saving} type="submit">{saving ? "Saving…" : editing ? "Save changes" : "Create record"}</button>
            </div>
          </form>
        </section>
      </div>}
    </div>
  );
}
