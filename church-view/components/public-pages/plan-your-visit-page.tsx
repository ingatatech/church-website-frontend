import Link from "next/link";
import { SubmissionForm } from "../forms/submission-form";
import { PageHero } from "../site/page-hero";

export function PlanYourVisitPage() {
  return <main>
    <PageHero eyebrow="YOUR FIRST VISIT" title="Come as you are." emphasis="We will save you a seat." description="Everything you need to feel comfortable visiting the church in Kigali." breadcrumbs={[{ label: "Home", href: "/" }]} />
    <section className="page-container section-space grid gap-10 lg:grid-cols-2">
      <div>
        <p className="eyebrow text-clay">WHAT TO EXPECT</p>
        <h2 className="mt-4 text-3xl font-medium">A warm welcome, from the start.</h2>
        <p className="mt-4 text-sm leading-7 text-muted">Come as you are. Our team can help you find the gathering, meet people and get settled. Service times and the exact street address are being confirmed, so contact us before you travel.</p>
        <ul className="mt-6 divide-y divide-border border-y border-border text-sm">
          <li className="py-4">Family friendly and open to all</li>
          <li className="py-4">Ask us about accessibility and children&apos;s ministry</li>
          <li className="py-4">Current service schedule: please confirm with the church</li>
        </ul>
        <Link className="button button-primary mt-6" href="/contact">Ask us about your visit <span aria-hidden="true">&#8599;</span></Link>
      </div>
      <div className="surface-card p-6 sm:p-8">
        <p className="eyebrow text-muted">LET US KNOW YOU ARE COMING</p>
        <h2 className="mt-3 text-2xl font-semibold">Plan a visit</h2>
        <p className="mb-6 mt-2 text-sm text-muted">Share a little information and the team can help you prepare.</p>
        <SubmissionForm type="visitor" compact />
      </div>
    </section>
  </main>;
}
