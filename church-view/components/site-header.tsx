import Link from "next/link";
const links = [
  ["About", "/about"],
  ["Ministries", "/ministries"],
  ["Services", "/services"],
  ["Events", "/events"],
  ["Sermons", "/sermons"],
  ["News", "/announcements"],
];

export function SiteHeader() {
  return (
    <>
      <div className="flex h-9 items-center justify-center gap-2 bg-forest px-4 text-xs tracking-wide text-paper">
        <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
        <span>Worship together · Sundays</span>
        <Link className="ml-2 text-leaf underline-offset-4 hover:underline" href="/services">Service details ↗</Link>
      </div>
      <header className="relative z-20 border-b border-ink/10 bg-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <Link className="flex items-center gap-2.5" href="/" aria-label="Ingata Church home">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-forest font-display text-2xl">i<span className="-ml-1 text-clay">✳</span></span>
            <span className="text-xl font-bold tracking-tight">ingata<span className="mt-0.5 block text-[9px] font-semibold tracking-[.2em] text-muted">CHURCH · KIGALI</span></span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex" aria-label="Main navigation">
            {links.map(([label, href]) => <Link className="transition hover:text-clay" href={href} key={href}>{label}</Link>)}
          </nav>
          <Link className="hidden border border-ink px-4 py-2.5 text-sm font-semibold transition hover:bg-forest hover:text-paper sm:inline-flex" href="/contact">Plan your visit <span className="ml-3">↗</span></Link>
          <details className="group lg:hidden">
            <summary className="grid h-10 w-10 cursor-pointer place-content-center gap-1.5 rounded border border-ink/20 [&::-webkit-details-marker]:hidden" aria-label="Open navigation">
              <span className="h-px w-5 bg-ink" /><span className="h-px w-5 bg-ink" />
            </summary>
            <nav className="absolute left-0 right-0 top-full grid border-b border-ink/10 bg-paper px-6 pb-5 shadow-lg" aria-label="Mobile navigation">
              {links.map(([label, href]) => <Link className="border-b border-ink/10 py-3 text-sm" href={href} key={href}>{label}</Link>)}
              <Link className="py-3 text-sm font-bold" href="/contact">Plan your visit ↗</Link>
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
