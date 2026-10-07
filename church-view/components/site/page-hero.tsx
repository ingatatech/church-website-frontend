import Link from "next/link";

export function PageHero({ eyebrow, title, emphasis, description, breadcrumbs = [] }: { eyebrow: string; title: string; emphasis?: string; description: string; breadcrumbs?: { label: string; href: string }[] }) {
  return <section className="bg-primary px-5 py-14 text-primary-foreground sm:py-20 lg:py-24">
    <div className="page-container">
      {breadcrumbs.length > 0 && <nav aria-label="Breadcrumb" className="mb-7 text-xs text-primary-foreground/70"><ol className="flex flex-wrap gap-2">{breadcrumbs.map((item, index) => <li key={item.href}>{index > 0 && <span className="mr-2" aria-hidden="true">/</span>}<Link href={item.href} className="hover:text-accent">{item.label}</Link></li>)}</ol></nav>}
      <p className="eyebrow text-accent">{eyebrow}</p>
      <h1 className="mt-5 max-w-4xl text-[clamp(2.75rem,7vw,5.75rem)] font-medium leading-[1.02] tracking-[-.055em]">{title}{emphasis && <> <em className="font-display text-accent">{emphasis}</em></>}</h1>
      <p className="mt-6 max-w-2xl text-sm leading-7 text-primary-foreground/80 sm:text-base">{description}</p>
    </div>
  </section>;
}
