import { SiteContentLayout } from "@/components/site/site-content-layout";
import type { SitePage } from "@/lib/content/site-pages";

export function SiteContentPage({ page, path }: { page: SitePage; path: string }) {
  const bullets = page.bullets ?? [];

  return <SiteContentLayout page={page} path={path}>
    {bullets.length > 0 && <ul className="mt-7 divide-y divide-border border-y border-border">
      {bullets.map((item) => <li className="py-4 text-sm leading-6" key={item}>{item}</li>)}
    </ul>}
  </SiteContentLayout>;
}
