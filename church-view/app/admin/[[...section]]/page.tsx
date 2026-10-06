import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { adminContent } from "../../../lib/site-content";

export const metadata: Metadata = {
  title: "Admin workspace",
  robots: { index: false, follow: false },
};

function PageHeader({ title, description, action }: { title: string; description: string; action?: string }) {
  return <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Ingata Church · Admin</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
    {action && <button className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100" type="button">
      {action}<span aria-hidden="true" className="ml-2 text-lg leading-none">+</span>
    </button>}
  </div>;
}

function statusClass(status: string) {
  if (status === "Published") return "bg-emerald-50 text-emerald-700 ring-emerald-600/15";
  if (status === "Scheduled") return "bg-blue-50 text-blue-700 ring-blue-600/15";
  if (status === "Draft") return "bg-amber-50 text-amber-800 ring-amber-600/20";
  return "bg-slate-100 text-slate-600 ring-slate-500/15";
}

export default async function AdminContentPage({ params }: { params: Promise<{ section?: string[] }> }) {
  const section = (await params).section ?? [];
  if (section.length === 0) redirect("/admin/dashboard");
  if (section.length > 1) notFound();

  const item = adminContent[section[0]];
  if (!item) notFound();

  return <div>
    <PageHeader title={item.title} description={item.description} action={section[0] !== "settings" ? "Add new" : undefined} />
    <section aria-label={`${item.title} list`} className="mt-6 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="font-semibold text-slate-900">All {item.title.toLowerCase()}</h2>
          <p className="mt-1 text-sm text-slate-500">Review and manage your church website content.</p>
        </div>
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Search {item.title}</span>
          <input className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" type="search" placeholder={`Search ${item.title.toLowerCase()}`} />
        </label>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[38rem] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
            <tr>{item.columns.map((column) => <th className="px-6 py-3.5" key={column} scope="col">{column}</th>)}<th className="px-6 py-3.5" scope="col"><span className="sr-only">Actions</span></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {item.records.map((record, index) => <tr className="transition-colors hover:bg-slate-50/70" key={`${record[0]}-${index}`}>
              {record.map((value, cell) => <td className="px-6 py-4 text-slate-600" key={`${cell}-${value}`}>
                {cell === record.length - 1 && ["Draft", "Published", "Scheduled", "Empty"].includes(value)
                  ? <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClass(value)}`}>{value}</span>
                  : value}
              </td>)}
              <td className="px-6 py-4 text-right"><button className="text-sm font-semibold text-indigo-700 hover:text-indigo-800" type="button">Edit</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {item.records.map((record, index) => <article className="p-5" key={`${record[0]}-${index}`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-slate-900">{record[0]}</h3>
            {record.some((value) => ["Draft", "Published", "Scheduled", "Empty"].includes(value)) && <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusClass(record[record.length - 1])}`}>{record[record.length - 1]}</span>}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            {item.columns.slice(1).map((column, columnIndex) => <div key={column}>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{column}</dt>
              <dd className="mt-1 break-words text-sm text-slate-700">{record[columnIndex + 1] ?? "—"}</dd>
            </div>)}
          </dl>
          <button className="mt-4 min-h-10 text-sm font-semibold text-indigo-700" type="button">Edit item</button>
        </article>)}
      </div>

      <p className="border-t border-slate-200/80 px-5 py-3.5 text-xs text-slate-500">Sample rows · Live content management will appear when connected to the API.</p>
    </section>
  </div>;
}
