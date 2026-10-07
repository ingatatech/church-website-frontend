import type { ReactNode } from "react";
import Link from "next/link";
import { ChurchLogo } from "@/components/brand/church-logo";

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-stone-50/95">
        <div className="page-container flex min-h-20 items-center justify-between gap-4">
          <Link href="/" aria-label="Church home" className="flex items-center gap-3">
            <ChurchLogo className="size-11 object-contain" priority />
            <span className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">Church</span>
          </Link>
          <Link className="text-sm font-semibold text-stone-700 transition-colors hover:text-amber-800" href="/">
            Return to website <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      <div className="page-container flex flex-1 flex-col justify-center py-12 sm:py-16">
        {children}
      </div>

      <footer className="border-t border-stone-200 py-5 text-center text-xs text-stone-500">
        Church administration
      </footer>
    </div>
  );
}
