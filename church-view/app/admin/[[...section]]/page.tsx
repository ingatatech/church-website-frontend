import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLoginForm } from "../../../components/admin-login-form";
import { adminContent } from "../../../lib/site-content";

export const metadata: Metadata = { title: "Admin workspace", robots: { index: false, follow: false } };

function PageHeader({ title, description, action }: { title: string; description: string; action?: string }) {
  return <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end"><div><p className="eyebrow text-clay">INGATA CHURCH · ADMIN</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-muted">{description}</p></div>{action && <button className="button button-primary shrink-0" type="button">{action}<span aria-hidden="true">＋</span></button>}</div>;
}

export default async function AdminPage({ params }: { params: Promise<{ section?: string[] }> }) {
  const section = (await params).section ?? [];
  if (section[0] === "login") return <main className="mx-auto max-w-lg py-8"><div className="surface-card p-6 sm:p-9"><p className="eyebrow text-clay">ADMINISTRATOR ACCESS</p><h1 className="mt-3 text-3xl font-semibold">Welcome back</h1><p className="mt-2 text-sm text-muted">Sign in will be enabled when the authentication service is connected.</p><AdminLoginForm /><p className="mt-4 text-xs leading-5 text-muted" role="note">This is a frontend sign-in screen. Authentication is not configured yet.</p></div></main>;
  if (section.length > 1) notFound();
  if (section.length === 0) return <main><PageHeader title="Overview" description="A quick look at the Ingata Church website workspace." /><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Content sections", "9", "Manage church website information"], ["Published items", "—", "Connect content API to load totals"], ["New inquiries", "—", "Contact submissions"], ["Prayer requests", "—", "Shared with the prayer team"]].map(([label, value, hint]) => <article className="surface-card p-5" key={label}><p className="text-sm text-muted">{label}</p><p className="mt-4 text-3xl font-semibold">{value}</p><p className="mt-2 text-xs leading-5 text-muted">{hint}</p></article>)}</div><section className="surface-card mt-6 p-5 sm:p-7"><h2 className="text-lg font-semibold">Quick access</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{Object.entries(adminContent).slice(0, 6).map(([key, item]) => <Link className="border border-border bg-background p-4 text-sm font-semibold hover:border-primary" href={`/admin/${key}`} key={key}>{item.title}<span className="float-right" aria-hidden="true">↗</span></Link>)}</div><p className="mt-5 text-xs leading-5 text-muted">Dashboard values and content rows are placeholders until connected to the backend API.</p></section></main>;
  const item = adminContent[section[0]];
  if (!item) notFound();
  return <main><PageHeader title={item.title} description={item.description} action={section[0] !== "settings" ? "Add new" : undefined} />
    <section className="surface-card mt-6 overflow-hidden"><div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><h2 className="font-semibold">All {item.title.toLowerCase()}</h2><label className="sr-only" htmlFor="admin-search">Search {item.title}</label><input id="admin-search" className="form-field max-w-sm" type="search" placeholder={`Search ${item.title.toLowerCase()}`} /></div>
      <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[38rem] text-left text-sm"><thead className="bg-surface-strong text-[10px] font-bold tracking-[.12em] text-muted"><tr>{item.columns.map((column) => <th className="px-5 py-3" key={column}>{column}</th>)}<th className="px-5 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody>{item.records.map((record, index) => <tr className="border-t border-border" key={`${record[0]}-${index}`}>{record.map((value, cell) => <td className="px-5 py-4" key={`${cell}-${value}`}>{cell === record.length - 1 && ["Draft", "Published", "Empty"].includes(value) ? <span className="inline-flex border border-border px-2 py-1 text-xs">{value}</span> : value}</td>)}<td className="px-5 py-4 text-right"><button className="text-sm font-semibold hover:text-clay" type="button">Edit</button></td></tr>)}</tbody></table></div>
      <div className="divide-y divide-border md:hidden">{item.records.map((record, index) => <article className="p-4" key={`${record[0]}-${index}`}><h3 className="font-semibold">{record[0]}</h3><dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">{item.columns.slice(1).map((column, i) => <div key={column}><dt className="eyebrow text-muted">{column}</dt><dd className="mt-1 break-words text-sm">{record[i + 1]}</dd></div>)}</dl><button className="mt-4 min-h-10 text-sm font-semibold text-primary" type="button">Edit item</button></article>)}</div>
      <p className="border-t border-border px-4 py-3 text-xs text-muted sm:px-5">Sample structure · Live content will appear when connected to the API.</p>
    </section>
  </main>;
}
