import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import type { SitePage } from "@/lib/content/site-pages";

export function SiteContentLayout({ page, path, children }: { page: SitePage; path: string; children: ReactNode }) {
  const parentSegment = path.split("/")[1];

  return <main>
    <PageHero
      eyebrow={page.eyebrow}
      title={page.title}
      emphasis={page.emphasis}
      description={page.description}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: parentSegment.replaceAll("-", " "), href: `/${parentSegment}` },
      ]}
    />
    <section className="page-container section-space">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
        <div>
          <p className="eyebrow text-clay">OUR CHURCH · KIGALI</p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">{page.heading}</h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">{page.body}</p>
          {children}
        </div>
        <aside className="surface-card h-fit p-6 sm:p-8">
          <p className="eyebrow text-muted">EXPLORE MORE</p>
          <nav className="mt-4 grid divide-y divide-border">
            {(page.links ?? [
              { label: "Plan your visit", href: "/plan-your-visit" },
              { label: "Get in touch", href: "/contact" },
            ]).map((link) => <Link className="flex min-h-12 items-center justify-between gap-3 py-3 text-sm font-semibold hover:text-clay" href={link.href} key={link.href}>
              {link.label}<span aria-hidden="true">↗</span>
            </Link>)}
          </nav>
        </aside>
      </div>
    </section>
  </main>;
}
