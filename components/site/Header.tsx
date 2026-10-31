"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  Clock3,
  Heart,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
  Compass,
} from "lucide-react";
import { ChurchLogo } from "@/components/brand/church-logo";
import { useChurchBrand } from "@/components/brand/church-brand-provider";
import { defaultHomepageSettings, type HomepageSettings } from "@/lib/content/website-settings";

const subscribeNever = () => () => {};

function isCurrentPage(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export type UrgentAnnouncementData = {
  id?: string;
  title: string;
  description?: string | null;
  slug?: string;
  category?: string;
  href?: string;
  ctaLabel?: string;
};

export function HeaderView({
  phone,
  email,
  location = "",
  siteHeader,
  urgentAnnouncement,
}: {
  phone?: string;
  email?: string;
  location?: string;
  siteHeader: HomepageSettings["siteHeader"];
  urgentAnnouncement?: UrgentAnnouncementData | null;
}) {
  const pathname = usePathname();
  const { churchName, logoAlt } = useChurchBrand();
  const headerSettings = siteHeader ?? defaultHomepageSettings.siteHeader;
  const configuredNavigation = headerSettings.navigation
    .filter((item) => item.visible)
    .sort((left, right) => left.order - right.order);
    
  const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLDivElement>(null);

  // Active announcement prioritizing database announcement records then site settings announcement
  const activeAnnouncement = urgentAnnouncement
    ? {
        title: urgentAnnouncement.title,
        description: urgentAnnouncement.description,
        href: urgentAnnouncement.href || `/announcements/${urgentAnnouncement.slug}`,
        ctaLabel: urgentAnnouncement.ctaLabel || "Read Notice",
        isUrgent: true,
      }
    : headerSettings.announcement?.visible && headerSettings.announcement.text
      ? {
          title: headerSettings.announcement.text,
          description: null,
          href: headerSettings.announcement.href || "/announcements",
          ctaLabel: headerSettings.announcement.ctaLabel || "Learn More",
          isUrgent: false,
        }
      : null;

  // Sticky scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu focus trap
  useEffect(() => {
    if (!mobileMenuOpen) return;

    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = mobileNavigationRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  const isHeroPage = pathname === "/";
  const showAnnouncement = Boolean(activeAnnouncement && bannerVisible);
  
  // Modern & Minimalist Color Variables
  const navTextColor = scrolled || !isHeroPage ? "text-stone-700" : "text-white/90";
  const navHoverColor = scrolled || !isHeroPage ? "hover:text-primary" : "hover:text-white";
  const navActiveColor = scrolled || !isHeroPage ? "text-primary font-bold" : "text-white font-bold";

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled
      ? `bg-white/95 shadow-[0_10px_30px_-20px_rgba(22,45,82,0.35)] backdrop-blur-md border-b border-stone-200/80 ${showAnnouncement ? "py-0" : "py-1"}`
          : isHeroPage
        ? `bg-gradient-to-b from-[#0b1833]/70 to-transparent ${showAnnouncement ? "py-0" : "py-3"}`
        : `bg-white/95 shadow-[0_10px_30px_-20px_rgba(22,45,82,0.35)] border-b border-stone-200/80 ${showAnnouncement ? "py-0" : "py-1"}`
      }`}
    >
      {/* ── 1. Top Section: Announcement Banner ── */}
      {activeAnnouncement && bannerVisible && (
        <aside
          aria-label="Urgent church announcement"
          className="relative z-20 flex min-h-10 items-start border-0 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 py-2 pl-3 pr-11 text-stone-950 sm:items-center sm:px-6 lg:px-8"
          role="region"
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-2 md:flex-row md:gap-6">
            
            {/* Live Indicator & Text Content */}
            <div className="flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
              <span className="flex min-w-0 items-start gap-2">
                {/* Animated Blue Circle */}
                <span className="relative mt-0.5 flex size-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex size-2.5 rounded-full bg-primary-hover"></span>
                </span>
                
                <span className="min-w-0 break-words font-bold tracking-tight text-stone-950 text-xs sm:text-sm">
                  {activeAnnouncement.title}
                </span>
              </span>
              
              {activeAnnouncement.description && (
                <span className="hidden md:inline text-stone-800 text-xs font-medium max-w-lg truncate">
                  <span className="mx-2 text-stone-950/40">—</span>
                  {activeAnnouncement.description}
                </span>
              )}
            </div>

            {/* CTA Link */}
            {activeAnnouncement.href && (
              <Link
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-stone-950/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-950 transition-all hover:bg-stone-950 hover:text-white"
                href={activeAnnouncement.href}
              >
                <span>{activeAnnouncement.ctaLabel}</span>
                <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            )}
          </div>

          <button
            aria-label="Dismiss announcement"
            className="absolute right-2 top-1/2 flex size-7 shrink-0 -translate-y-1/2 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-950/10 hover:text-stone-950 sm:right-3"
            onClick={() => setBannerVisible(false)}
            type="button"
          >
            <X className="size-4" />
          </button>
        </aside>
      )}

      {/* ── 2. Main Navigation Bar ── */}
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-2 sm:px-6 lg:px-8">
        
        {/* Brand / Logo */}
        <Link
          aria-label={`${churchName} home`}
          className="group flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-90 md:flex-none"
          href="/"
        >
          <span className="flex size-10 sm:size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-stone-900/10 group-hover:shadow-md transition-shadow">
            <ChurchLogo
              alt={logoAlt || churchName}
              className="size-9 sm:size-10 object-contain"
              priority
            />
          </span>
          <span className="min-w-0 flex flex-col justify-center">
            <span
              className={`block max-w-[10rem] sm:max-w-[16rem] font-display text-sm sm:text-base font-extrabold tracking-tight truncate transition-colors ${
                scrolled || !isHeroPage ? "text-stone-950" : "text-white"
              }`}
            >
              {churchName}
            </span>
            {headerSettings.brandTagline && (
              <span
                className={`mt-0.5 block text-[10px] sm:text-xs font-medium uppercase tracking-wider truncate transition-colors ${
                  scrolled || !isHeroPage ? "text-stone-500" : "text-white/70"
                }`}
              >
                {headerSettings.brandTagline}
              </span>
            )}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex lg:gap-2 shrink min-w-0">
          {configuredNavigation.map((link) => {
            const active = isCurrentPage(pathname, link.href);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-md px-3 py-2 text-xs lg:text-sm font-semibold tracking-wide transition-colors duration-200 ${
                  active ? navActiveColor : `${navTextColor} ${navHoverColor}`
                }`}
                href={link.href}
                key={`${link.href}-${link.order}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Primary CTA Button - Blue Accent */}
        {headerSettings.primaryCta.visible && (
          <div className="hidden shrink-0 items-center md:flex ml-4">
            <Link
              className="flex shrink-0 whitespace-nowrap items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-primary-hover hover:shadow-md hover:-translate-y-0.5"
              href={headerSettings.primaryCta.href}
            >
              <span>{headerSettings.primaryCta.label}</span>
              <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        )}

        {/* Mobile Hamburger Button */}
        <button
          aria-controls="mobile-navigation"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className={`ml-2 flex size-11 shrink-0 items-center justify-center rounded-xl p-0 shadow-sm transition-all md:hidden ${
            scrolled || !isHeroPage 
              ? "bg-white border border-stone-200 text-stone-900 hover:bg-stone-50" 
              : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
          }`}
          onClick={() => setMobileMenuOpen((open) => !open)}
          ref={menuButtonRef}
          type="button"
        >
          {mobileMenuOpen ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* ── 3. Full-screen Mobile Navigation Drawer ── */}
      {mobileMenuOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-stone-950/40 backdrop-blur-sm md:hidden transition-opacity">
          <button
            aria-label="Close navigation menu"
            className="absolute inset-0 size-full cursor-default"
            onClick={closeMobileMenu}
            type="button"
          />

          <div
            aria-labelledby="mobile-navigation-title"
            aria-modal="true"
            className="absolute inset-y-0 right-0 flex max-h-dvh w-[min(85vw,22rem)] flex-col overflow-y-auto overscroll-contain bg-white px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-right duration-300"
            id="mobile-navigation"
            ref={mobileNavigationRef}
            role="dialog"
          >
            <h2 className="sr-only" id="mobile-navigation-title">
              Mobile Navigation Menu
            </h2>

            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-5">
              <Link
                aria-label={`${churchName} home`}
                className="flex items-center gap-3 text-stone-900"
                href="/"
                onClick={closeMobileMenu}
              >
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-stone-900/5">
                  <ChurchLogo className="size-8 object-contain" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-sm font-bold tracking-tight text-stone-950">
                    {churchName}
                  </span>
                </span>
              </Link>
              <button
                aria-label="Close navigation menu"
                className="flex size-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                onClick={closeMobileMenu}
                ref={closeButtonRef}
                type="button"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Quick Action Grid - Updated to Blue Accents */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-b border-stone-100 pb-6">
              {headerSettings.primaryCta.visible && (
                <Link
                  href={headerSettings.primaryCta.href}
                  onClick={closeMobileMenu}
                  className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-primary-hover"
                >
                  <Compass className="size-4 shrink-0" />
                  <span>{headerSettings.primaryCta.label}</span>
                </Link>
              )}
              <Link
                href="/prayer-request"
                onClick={closeMobileMenu}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary/6 px-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <Heart className="size-4 text-primary" />
                <span>Prayer</span>
              </Link>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 px-3 text-sm font-semibold text-stone-700 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
                >
                  <Phone className="size-4 text-primary" />
                  <span>Call</span>
                </a>
              )}
              <Link
                href={headerSettings.directionsHref}
                onClick={closeMobileMenu}
                className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 px-3 text-sm font-semibold text-stone-700 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
              >
                <MapPin className="size-4 text-primary" />
                <span>{headerSettings.directionsLabel}</span>
              </Link>
            </div>

            {/* Nav Links */}
            <nav aria-label="Mobile navigation links" className="mt-6 space-y-1">
              {configuredNavigation.map((link) => {
                const active = isCurrentPage(pathname, link.href);
                return (
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={`flex h-12 items-center rounded-xl px-4 text-sm font-semibold tracking-wide transition-colors ${
                      active 
                        ? "bg-primary/6 text-primary" 
                        : "text-stone-600 hover:bg-stone-50 hover:text-primary"
                    }`}
                    href={link.href}
                    key={`${link.href}-${link.order}`}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Drawer Footer with Service Times & Contact */}
            <div className="mt-auto border-t border-stone-100 pt-6">
              <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-600 border border-stone-100">
                <p className="font-semibold text-stone-900 flex items-center gap-2">
                  <Clock3 className="size-4 text-primary" />
                  {headerSettings.serviceSummary}
                </p>
                {location && (
                  <p className="mt-3 flex items-start gap-2 text-stone-600">
                    <MapPin className="size-4 text-stone-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{location}</span>
                  </p>
                )}
                {email && (
                  <p className="mt-3 flex items-center gap-2 text-stone-600">
                    <Mail className="size-4 text-stone-400 shrink-0" />
                    <a className="hover:text-primary transition-colors truncate" href={`mailto:${email}`}>
                      {email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}