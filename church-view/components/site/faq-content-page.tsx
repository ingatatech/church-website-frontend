import { SiteContentLayout } from "@/components/site/site-content-layout";
import type { SitePage } from "@/lib/content/site-pages";

export function FaqContentPage({ page }: { page: SitePage }) {
  const questions = (page.bullets ?? []).map((item) => {
    const [question, answer = ""] = item.split("?");
    return { question, answer: answer.trim() };
  });

  return <SiteContentLayout page={page} path="/faqs">
    <div className="mt-7 divide-y divide-border border-y border-border">
      {questions.map(({ question, answer }) => <details className="group py-4" key={question}>
        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
          {question}?<span aria-hidden="true" className="text-clay">+</span>
        </summary>
        <p className="pt-2 text-sm leading-6 text-muted">{answer}</p>
      </details>)}
    </div>
  </SiteContentLayout>;
}
