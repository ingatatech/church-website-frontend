import Link from "next/link";
import type { ReactNode } from "react";
import { adminSections } from "../../lib/site-content";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background text-text"><header className="border-b border-border bg-surface"><div className="page-container flex min-h-16 items-center justify-between gap-4"><Link href="/admin" className="font-semibold">Ingata <span className="font-normal text-muted">/ Admin</span></Link><div className="flex items-center gap-4 text-sm"><span className="hidden text-muted sm:inline">Administrator workspace</span><Link className="font-semibold hover:text-clay" href="/">View website ↗</Link></div></div></header><div className="page-container grid gap-7 py-7 lg:grid-cols-[14rem_minmax(0,1fr)]"><aside className="lg:sticky lg:top-5 lg:h-fit"><nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible">{adminSections.map(([label, href]) => <Link className="whitespace-nowrap border border-border bg-surface px-3 py-2.5 text-sm hover:border-primary hover:text-primary" href={href} key={href}>{label}</Link>)}</nav></aside><div className="min-w-0">{children}</div></div></div>;
}
