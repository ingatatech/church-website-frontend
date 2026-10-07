import { SubmissionForm } from "../forms/submission-form";
import { PageHero } from "../site/page-hero";

export function PrayerRequestPage() {
  return <main>
    <PageHero eyebrow="PRAYER & CARE" title="You do not have to" emphasis="carry it alone." description="Share a prayer request with our church prayer team." breadcrumbs={[{ label: "Home", href: "/" }]} />
    <section className="page-container section-space grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
      <div>
        <p className="eyebrow text-clay">WE ARE HERE WITH YOU</p>
        <h2 className="mt-4 text-3xl font-medium">A moment to share.</h2>
        <p className="mt-4 text-sm leading-7 text-muted">Share only what you feel comfortable sending. This request will be prepared for the church team once the website is connected to its submission service.</p>
      </div>
      <div className="surface-card p-6 sm:p-8"><SubmissionForm type="prayer" /></div>
    </section>
  </main>;
}
