"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  ["About", "/about"], ["Ministries", "/ministries"], ["Services", "/services"],
  ["Events", "/events"], ["Sermons", "/sermons"], ["News", "/announcements"],
] as const;

const directionsUrl = "https://maps.google.com/?q=Kigali%2C%20Rwanda";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return <>
    <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-2 gap-y-1 bg-primary px-3 py-1.5 text-center text-xs text-primary-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      <span>Worship together · Sundays</span>
      <Link className="ml-1 text-accent underline-offset-4 hover:underline" href="/services">Service details <span aria-hidden="true">↗</span></Link>
    </div>
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="page-container flex min-h-[4.75rem] items-center justify-between gap-4 py-3">
        <Link className="flex shrink-0 items-center gap-2.5" href="/" aria-label="Ingata Church home">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-primary font-display text-2xl">i<span className="-ml-1 text-clay">✳</span></span>
          <span className="text-xl font-bold tracking-tight">ingata<span className="mt-0.5 block text-[9px] font-semibold tracking-[.2em] text-muted">CHURCH · KIGALI</span></span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium lg:flex xl:gap-6" aria-label="Main navigation">
          {links.map(([label, href]) => <Link aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined} className="min-h-11 content-center transition hover:text-primary-hover" href={href} key={href}>{label}</Link>)}
        </nav>
        <Link className="button button-primary hidden lg:inline-flex" href="/plan-your-visit">Plan your visit <span aria-hidden="true">↗</span></Link>
        <button ref={menuButton} aria-controls="mobile-navigation" aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} className="mobile-nav-toggle grid h-11 w-11 shrink-0 place-content-center gap-1.5 rounded-md border border-border bg-surface lg:hidden" onClick={() => setOpen((value) => !value)} type="button">
          <span className="h-px w-5 bg-text" /><span className="h-px w-5 bg-text" />
        </button>
      </div>
      {open && <div className="fixed inset-0 z-50 lg:hidden">
        <button aria-label="Close navigation menu" className="absolute inset-0 h-full w-full bg-primary/50" onClick={() => setOpen(false)} type="button" />
        <aside id="mobile-navigation" aria-label="Mobile navigation" aria-modal="true" className="absolute inset-y-0 right-0 flex w-[min(90vw,24rem)] flex-col bg-background p-5 shadow-card" role="dialog">
          <div className="flex items-center justify-between border-b border-border pb-4"><span className="font-semibold">Explore Ingata</span><button ref={closeButton} aria-label="Close navigation" className="grid h-11 w-11 place-items-center rounded-md border border-border" onClick={() => { setOpen(false); menuButton.current?.focus(); }} type="button">×</button></div>
          <nav className="mt-3 grid" aria-label="Mobile navigation links">
            {links.map(([label, href]) => <Link aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined} onClick={() => setOpen(false)} className="flex min-h-11 items-center border-b border-border py-3 text-sm font-medium" href={href} key={href}>{label}</Link>)}
          </nav>
          <div className="mt-auto grid gap-3 border-t border-border pt-5">
            <Link className="button button-primary w-full" onClick={() => setOpen(false)} href="/plan-your-visit">Plan your visit <span aria-hidden="true">↗</span></Link>
            <Link className="button button-outline w-full" onClick={() => setOpen(false)} href="/contact">Contact the church</Link>
            <a className="button button-ghost w-full" href={directionsUrl} target="_blank" rel="noreferrer">Map and directions <span aria-hidden="true">↗</span></a>
            <p className="text-center text-xs text-muted">Call details will be added when the church phone number is confirmed.</p>
          </div>
        </aside>
      </div>}
    </header>
  </>;
}
