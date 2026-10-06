import Link from "next/link";
import { PageHero } from "../../components/page-hero";
import { getPublicData, type Ministry } from "../../lib/church-api";

const ministries = [
  ["Children’s Ministry", "A welcoming place for children to learn about faith, build friendships and grow."],
  ["Youth Ministry", "Faith, friendship and meaningful activities for young people."],
  ["Women’s Ministry", "Connection, encouragement and spiritual growth for women."],
  ["Men’s Ministry", "Community, discipleship and opportunities to serve together."],
  ["Worship Ministry", "Use music and creative gifts to help lead the church in worship."],
  ["Prayer Ministry", "Join others in prayer for the church, our neighbors and the wider world."],
  ["Bible Study", "Explore Scripture and grow in understanding alongside others."],
  ["Outreach Ministry", "Share care and practical support beyond the church community."],
  ["Community Service", "Work together on practical ways to serve people in Kigali."],
];

export default async function MinistriesPage() {
  const published = await getPublicData<Ministry[]>("/ministries");
  const items = published?.length ? published.map((ministry) => [ministry.name, ministry.description, ministry.leader] as const) : ministries.map(([name, description]) => [name, description, null] as const);
  return <main><PageHero eyebrow="FIND YOUR PEOPLE" title="There’s more than" emphasis="one way in." description="Explore the ministries and groups that help people of every age connect, grow in faith and serve the community." />
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map(([name, description, leader], i) => <article className="flex min-h-56 flex-col bg-[#eeeadf] p-6 transition hover:bg-[#e8e8d9]" key={name}><p className="text-[9px] font-bold tracking-[.18em] text-muted">{String(i + 1).padStart(2, "0")} / MINISTRY</p><h2 className="mt-7 text-2xl font-semibold tracking-tight">{name}</h2><p className="mt-3 text-sm leading-6 text-muted">{description}</p>{leader && <p className="mt-3 text-xs text-muted">Led by {leader}</p>}<Link className="mt-auto pt-5 text-sm font-bold" href={`/contact?topic=${encodeURIComponent(name)}`}>Ask about this ministry <span className="ml-2 text-clay">↗</span></Link></article>)}</div>{!published?.length && <p className="mt-8 text-xs leading-6 text-muted">Ministry descriptions are starter content and can be updated with approved schedules, leaders and contact details.</p>}</section>
  </main>;
}
