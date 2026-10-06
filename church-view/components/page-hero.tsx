export function PageHero({ eyebrow, title, emphasis, description }: { eyebrow: string; title: string; emphasis?: string; description: string }) {
  return (
    <section className="bg-forest px-6 py-16 text-paper sm:py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-bold tracking-[.2em] text-leaf">✳ &nbsp; {eyebrow}</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[1.03] tracking-[-.06em] sm:text-7xl">{title}{emphasis && <> <em className="font-display text-leaf">{emphasis}</em></>}</h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-paper/75 sm:text-base">{description}</p>
      </div>
    </section>
  );
}
