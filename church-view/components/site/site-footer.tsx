import Link from "next/link";
import { ChurchLogo } from "@/components/brand/church-logo";

const footerLinks = [
  ["Our story", "/about/our-story"],
  ["Ministries", "/ministries"],
  ["Services", "/services"],
  ["Events", "/events"],
  ["Sermons", "/sermons"],
  ["Resources", "/resources"],
  ["Prayer request", "/prayer-request"],
  ["Contact", "/contact"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 px-5 pb-6 pt-12 text-stone-900">
      <div className="page-container grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.5fr]">
        <div>
          <Link className="flex h-fit items-center gap-2.5" href="/" aria-label="Church home">
            <ChurchLogo className="size-10 rounded-full object-contain" />
            <span className="text-xl font-bold tracking-tight">
              Church
              <span className="mt-0.5 block text-[9px] font-semibold tracking-[.2em] text-stone-600">CHURCH · KIGALI</span>
            </span>
          </Link>
          <p className="mt-4 font-display text-sm italic leading-relaxed text-stone-600">
            A community of faith, hope<br />and open doors in Kigali.
          </p>
        </div>

        <div>
          <h2 className="eyebrow text-stone-600">EXPLORE</h2>
          <nav className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm font-medium" aria-label="Footer navigation">
            {footerLinks.map(([label, href]) => (
              <Link className="hover:text-amber-800" href={href} key={href}>{label}</Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="eyebrow text-stone-600">COME AS YOU ARE</h2>
          <p className="mt-4 max-w-xs text-sm leading-6 text-stone-600">
            Join us in Kigali. We would be glad to help you plan your first visit.
          </p>
          <Link className="mt-4 inline-flex min-h-11 items-center gap-3 rounded-sm bg-amber-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-800" href="/plan-your-visit">
            Plan your visit <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="page-container mt-10 flex flex-wrap justify-between gap-3 border-t border-stone-300 pt-4 text-[11px] text-stone-600">
        <span>© 2026 the church</span>
        <nav className="flex flex-wrap gap-4" aria-label="Legal">
          <Link className="hover:text-amber-800" href="/privacy-policy">Privacy</Link>
          <Link className="hover:text-amber-800" href="/terms-and-conditions">Terms</Link>
          <Link className="hover:text-amber-800" href="/cookie-policy">Cookies</Link>
        </nav>
        <a className="text-stone-900 hover:text-amber-800" href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
