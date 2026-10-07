"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Clock, Menu, X } from "lucide-react";
import { ChurchLogo } from "@/components/brand/church-logo";

// Shared by desktop navigation and the mobile drawer so both stay in sync.
const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Ministries", href: "/ministries" },
  { label: "Services", href: "/services" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
] as const;

function isCurrentPage(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    closeButtonRef.current?.focus();
    // Let keyboard users dismiss the drawer and return to its toggle.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/95 shadow-sm backdrop-blur">
    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
      <Link aria-label="Church home" className="flex shrink-0 items-center gap-3 text-stone-900" href="/">
        <ChurchLogo className="size-11 object-contain" priority />
        <span className="font-serif text-2xl tracking-tight">Church</span>
      </Link>

      <nav aria-label="Main navigation" className="hidden flex-1 items-center justify-center gap-3 lg:flex xl:gap-5">
        {navigationLinks.map(({ label, href }) => {
          const active = isCurrentPage(pathname, href);
          return <Link
            aria-current={active ? "page" : undefined}
            className={`whitespace-nowrap text-xs font-bold uppercase tracking-wide transition-colors xl:text-sm ${active ? "text-amber-800" : "text-stone-600 hover:text-amber-800"}`}
            href={href}
            key={href}
          >
            {label}
          </Link>;
        })}
      </nav>

      <div className="hidden shrink-0 items-center gap-3 lg:flex">
        <Link className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-bold text-stone-700 transition-colors hover:text-amber-800" href="/services">
          <Clock aria-hidden="true" className="size-4 text-amber-700" />
          Service Times
        </Link>
        <Link className="inline-flex min-h-11 items-center justify-center rounded-sm bg-amber-700 px-4 text-sm font-bold text-white transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2" href="/plan-your-visit">
          Plan Your Visit
        </Link>
      </div>

      <button
        aria-controls="mobile-navigation"
        aria-expanded={mobileMenuOpen}
        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        className="grid size-11 place-items-center rounded-sm border border-stone-300 text-stone-800 transition-colors hover:bg-stone-100 lg:hidden"
        onClick={() => setMobileMenuOpen((open) => !open)}
        ref={menuButtonRef}
        type="button"
      >
        {mobileMenuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>
    </div>

    {mobileMenuOpen && <div className="fixed inset-0 z-[60] bg-stone-950/40 lg:hidden">
      <button aria-label="Close navigation menu" className="absolute inset-0 size-full cursor-default" onClick={closeMobileMenu} type="button" />
      <div aria-label="Mobile navigation" aria-modal="true" className="absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col border-l border-stone-200 bg-stone-50 px-5 py-6 shadow-xl" id="mobile-navigation" role="dialog">
        <div className="flex items-center justify-between border-b border-stone-200 pb-5">
          <Link className="flex items-center gap-3 text-stone-900" href="/" onClick={closeMobileMenu}>
            <ChurchLogo className="size-10 object-contain" />
            <span className="font-serif text-xl">Church</span>
          </Link>
          <button aria-label="Close navigation menu" className="grid size-10 place-items-center rounded-sm border border-stone-300 text-stone-800 hover:bg-stone-100" onClick={closeMobileMenu} ref={closeButtonRef} type="button">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile navigation links" className="mt-3 grid">
          {navigationLinks.map(({ label, href }) => {
            const active = isCurrentPage(pathname, href);
            return <Link
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 items-center border-b border-stone-200 text-sm font-bold uppercase tracking-wide transition-colors ${active ? "text-amber-800" : "text-stone-700 hover:text-amber-800"}`}
              href={href}
              key={href}
              onClick={closeMobileMenu}
            >
              {label}
            </Link>;
          })}
        </nav>

        <div className="mt-auto grid gap-3 border-t border-stone-200 pt-5">
          <Link className="inline-flex min-h-11 items-center justify-center gap-2 border border-stone-300 px-4 text-sm font-bold text-stone-800 transition-colors hover:bg-stone-100" href="/services" onClick={closeMobileMenu}>
            <Clock aria-hidden="true" className="size-4 text-amber-700" />
            Service Times
          </Link>
          <Link className="inline-flex min-h-11 items-center justify-center rounded-sm bg-amber-700 px-4 text-sm font-bold text-white transition-colors hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2" href="/plan-your-visit" onClick={closeMobileMenu}>
            Plan Your Visit
          </Link>
        </div>
      </div>
    </div>}
  </header>;
}
