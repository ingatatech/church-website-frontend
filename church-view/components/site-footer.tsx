import Link from "next/link";
export function SiteFooter() {
  return (
    <footer className="bg-paper px-5 pb-6 pt-12 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.5fr_auto]">
        <Link className="flex h-fit items-center gap-2.5" href="/" aria-label="Ingata Church home">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-forest font-display text-2xl">i<span className="-ml-1 text-clay">✳</span></span>
          <span className="text-xl font-bold tracking-tight">ingata<span className="mt-0.5 block text-[9px] font-semibold tracking-[.2em] text-muted">CHURCH · KIGALI</span></span>
        </Link>
        <p className="font-display text-sm italic leading-relaxed text-muted">A community of faith, hope<br />and open doors in Kigali.</p>
        <nav className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm font-medium" aria-label="Footer navigation">
          <Link className="hover:text-clay" href="/about">Our story</Link><Link className="hover:text-clay" href="/ministries">Ministries</Link>
          <Link className="hover:text-clay" href="/events">Events</Link><Link className="hover:text-clay" href="/sermons">Sermons</Link>
          <Link className="hover:text-clay" href="/announcements">Announcements</Link><Link className="hover:text-clay" href="/contact">Contact</Link>
        </nav>
        <p className="text-xs leading-5 text-muted">Official social links<br />will be added here.</p>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap justify-between gap-3 border-t border-ink/15 pt-4 text-[11px] text-muted"><span>© 2026 Ingata Church</span><span>Kigali, Rwanda · All are welcome</span><Link className="text-ink" href="#top">Back to top ↑</Link></div>
    </footer>
  );
}
