import Link from "next/link";

const footerLinks = [
  ["Our story", "/about/our-story"], ["Ministries", "/ministries"], ["Services", "/services"],
  ["Events", "/events"], ["Sermons", "/sermons"], ["Resources", "/resources"],
  ["Prayer request", "/prayer-request"], ["Contact", "/contact"],
] as const;

export function SiteFooter() {
  return <footer className="bg-surface px-5 pb-6 pt-12">
    <div className="page-container grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.5fr]">
      <div><Link className="flex h-fit items-center gap-2.5" href="/" aria-label="Ingata Church home"><span className="grid h-10 w-10 place-items-center rounded-full border border-primary font-display text-2xl">i<span className="-ml-1 text-clay">âœ³</span></span><span className="text-xl font-bold tracking-tight">ingata<span className="mt-0.5 block text-[9px] font-semibold tracking-[.2em] text-muted">CHURCH Â· KIGALI</span></span></Link><p className="mt-4 font-display text-sm italic leading-relaxed text-muted">A community of faith, hope<br />and open doors in Kigali.</p></div>
      <div><h2 className="eyebrow text-muted">EXPLORE</h2><nav className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm font-medium" aria-label="Footer navigation">{footerLinks.map(([label, href]) => <Link className="hover:text-clay" href={href} key={href}>{label}</Link>)}</nav></div>
      <div><h2 className="eyebrow text-muted">COME AS YOU ARE</h2><p className="mt-4 max-w-xs text-sm leading-6 text-muted">Join us in Kigali. We would be glad to help you plan your first visit.</p><Link className="button button-primary mt-4" href="/plan-your-visit">Plan your visit <span aria-hidden="true">â†—</span></Link></div>
    </div>
    <div className="page-container mt-10 flex flex-wrap justify-between gap-3 border-t border-border pt-4 text-[11px] text-muted"><span>Â© 2026 Ingata Church</span><nav className="flex flex-wrap gap-4" aria-label="Legal"><Link href="/privacy-policy">Privacy</Link><Link href="/terms-and-conditions">Terms</Link><Link href="/cookie-policy">Cookies</Link></nav><a className="text-text" href="#top">Back to top â†‘</a></div>
  </footer>;
}
