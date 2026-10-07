import type { ReactNode } from "react";
import Link from "next/link";
import { ChurchLogo } from "@/components/brand/church-logo";

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return <>
    <header className="border-b border-border bg-surface">
      <div className="page-container flex min-h-16 items-center justify-between gap-4">
        <Link href="/admin" aria-label="Church admin" className="flex items-center gap-2.5 font-semibold"><ChurchLogo size={36} className="size-9 rounded-full object-contain" /><span>our church <span className="font-normal text-muted">/ Admin</span></span></Link>
        <Link className="text-sm font-semibold hover:text-clay" href="/">View website <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
    <div className="page-container">{children}</div>
  </>;
}
