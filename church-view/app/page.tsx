import Link from "next/link";
import { getPublicData, type ChurchEvent } from "../lib/church-api";

const ministries = ["Children’s Ministry", "Youth Ministry", "Women’s Ministry", "Men’s Ministry", "Worship Ministry", "Prayer Ministry", "Bible Study", "Outreach Ministry", "Community Service"];

export default async function Home() {
  const events = await getPublicData<ChurchEvent[]>("/events");
  return (
    <main>
      <section className="relative flex min-h-[620px] items-center overflow-hidden bg-forest text-paper md:min-h-[700px]">
        <div className="absolute inset-0 bg-cover bg-[center_42%]" style={{ backgroundImage: "linear-gradient(90deg,rgba(14,29,23,.84),rgba(19,35,28,.18)),url(https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=2200&q=88)" }} />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-10">
          <p className="flex items-center gap-2 text-[10px] font-bold tracking-[.22em] text-paper"><span className="h-1.5 w-1.5 rounded-full bg-leaf" /> A PLACE TO BELONG</p>
          <h1 className="mt-7 max-w-3xl text-6xl font-medium leading-[.98] tracking-[-.065em] sm:text-7xl lg:text-8xl">Faith grows<br />better <em className="font-display font-medium text-leaf">together.</em></h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-paper/85">We’re a community learning the way of Jesus, loving our neighbors and making room for everyone.</p>
          <div className="mt-8 flex flex-wrap items-center gap-6"><Link className="bg-leaf px-5 py-4 text-sm font-bold text-ink transition hover:bg-white" href="/contact">Plan your visit <span className="ml-5">↗</span></Link><Link className="text-sm font-semibold" href="/about">Get to know us <span className="ml-2 text-leaf">↓</span></Link></div>
        </div>
        <div className="absolute bottom-8 right-8 font-display text-sm italic text-paper sm:right-12">Rooted in faith. Open to all.</div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28" id="about">
        <p className="text-[10px] font-bold tracking-[.2em] text-muted">✳ &nbsp; A LITTLE ABOUT US</p>
        <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-end">
          <h2 className="text-5xl font-medium leading-[1.05] tracking-[-.06em] sm:text-6xl">Church should feel<br />like a <em className="font-display text-clay">deep breath.</em></h2>
          <div className="max-w-md"><p className="text-sm leading-7 text-muted">Come as you are. Bring your questions, your whole family, or just yourself. There’s a seat at the table and a story still being written—with you in it.</p><Link className="mt-4 inline-block border-b border-ink/20 pb-2 text-sm font-bold" href="/about">Discover our story <span className="ml-2 text-clay">↗</span></Link></div>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-y border-ink/15 px-2 py-6 text-[10px] font-bold tracking-[.2em] text-muted"><span>WORSHIP</span><b className="text-clay">✳</b><span>GROW</span><b className="text-clay">✳</b><span>GIVE</span><b className="text-clay">✳</b><span>BELONG</span></div>
      </section>

      <section className="grid bg-forest text-paper md:grid-cols-2" id="services">
        <div className="min-h-[320px] bg-cover bg-center md:min-h-[540px]" role="img" aria-label="A community sharing a joyful moment" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1300&q=85)" }} />
        <div className="flex flex-col items-start justify-center px-7 py-14 sm:px-12 lg:px-20 lg:py-20"><p className="text-[10px] font-bold tracking-[.2em]">✳ &nbsp; MAKE ROOM FOR SUNDAY</p><h2 className="mt-6 text-6xl font-medium leading-none tracking-[-.06em]">There’s a<br />place for <em className="font-display text-leaf">you.</em></h2><p className="mt-5 max-w-md text-sm leading-7 text-paper/75">We’d love to worship with you. Come a little early, meet the community and find a place to belong.</p><div className="my-7 w-full max-w-md border-y border-paper/25 py-4"><strong className="block text-sm">Sunday worship</strong><span className="mt-1 block text-xs text-paper/70">Service time and location to be confirmed</span></div><Link className="bg-paper px-5 py-4 text-sm font-bold text-ink hover:bg-leaf" href="/services">View service information <span className="ml-4">↗</span></Link></div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28" id="ministries">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[10px] font-bold tracking-[.2em] text-muted">✳ &nbsp; FIND YOUR PEOPLE</p><h2 className="mt-5 text-5xl font-medium leading-tight tracking-[-.06em] sm:text-6xl">There’s more than<br /><em className="font-display text-clay">one way in.</em></h2></div><p className="max-w-sm text-sm leading-7 text-muted">Faith takes shape in community. Explore ways to connect, contribute and grow.</p></div>
        <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">{ministries.map((name, index) => <Link className="group flex min-h-28 items-center justify-between bg-[#eeeadf] px-5 py-4 transition hover:bg-leaf" href="/ministries" key={name}><span><small className="block text-[9px] tracking-[.15em] text-muted">0{index + 1} / MINISTRY</small><strong className="mt-3 block font-medium">{name}</strong></span><span className="text-lg text-clay transition group-hover:translate-x-1">↗</span></Link>)}</div>
        <Link className="mt-6 inline-block text-sm font-bold" href="/ministries">Explore all ministries <span className="ml-2 text-clay">↗</span></Link>
      </section>

      <section className="bg-forest px-6 py-20 text-paper lg:px-10 lg:py-24" id="events"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold tracking-[.2em]">✳ &nbsp; LIFE AT INGATA</p><h2 className="mt-5 text-5xl font-medium leading-tight tracking-[-.06em] sm:text-6xl">Good things<br />are <em className="font-display text-leaf">coming up.</em></h2></div><Link className="text-sm font-semibold" href="/events">All events <span className="ml-2 text-leaf">↗</span></Link></div><div className="mt-10 border-t border-paper/25">{events?.length ? events.slice(0, 3).map((event) => <Link className="grid grid-cols-[1fr_20px] items-center border-b border-paper/25 py-5 transition hover:px-2 sm:grid-cols-[1fr_25px]" href="/events" key={event.id}><span><strong className="block text-sm">{event.name}</strong><small className="mt-1 block text-xs text-paper/65">{event.date} · {event.time} · {event.location}</small></span><span className="text-leaf">↗</span></Link>) : <p className="border-b border-paper/25 py-6 text-sm text-paper/70">Confirmed events will appear here when published. <Link className="font-bold text-leaf underline" href="/contact?topic=events">Ask us what’s coming up.</Link></p>}</div></div></section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center lg:px-10 lg:py-28" id="sermons"><div className="flex min-h-80 items-center justify-center bg-[#e9e3d4] p-8 text-center"><div><span className="block text-4xl text-clay">✳</span><p className="mt-5 font-display text-4xl leading-tight">A little hope goes<br /><em className="text-clay">a long way.</em></p><small className="mt-6 block text-[9px] font-bold tracking-[.17em] text-muted">TAKE A MOMENT. FIND A MESSAGE.</small></div></div><div><p className="text-[10px] font-bold tracking-[.2em] text-muted">✳ &nbsp; WORDS FOR THE WEEK</p><h2 className="mt-5 text-5xl font-medium leading-tight tracking-[-.06em]">Room to pause.<br />Space to <em className="font-display text-clay">listen.</em></h2><p className="mt-5 max-w-md text-sm leading-7 text-muted">Explore sermons, teaching and resources for wherever you are on the journey.</p><Link className="mt-6 inline-flex bg-forest px-5 py-4 text-sm font-bold text-paper hover:bg-ink" href="/sermons">Browse sermons <span className="ml-5">↗</span></Link></div></section>

      <section className="grid gap-8 bg-[#e8e8d9] px-6 py-16 md:grid-cols-2 lg:px-10"><div className="mx-auto w-full max-w-7xl md:col-span-2"><p className="text-[10px] font-bold tracking-[.2em] text-muted">✳ &nbsp; STAY IN THE LOOP</p><h2 className="mt-4 text-4xl font-medium tracking-[-.05em]">News, notes & <em className="font-display text-clay">good things.</em></h2><p className="mt-3 max-w-lg text-sm leading-7 text-muted">Church announcements, community news and ministry updates—all in one place.</p><Link className="mt-3 inline-block text-sm font-bold" href="/announcements">Read announcements <span className="ml-2 text-clay">↗</span></Link></div></section>

      <section className="bg-forest px-6 py-20 text-paper lg:px-10 lg:py-24" id="visit"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_.8fr] md:items-center"><div><p className="text-[10px] font-bold tracking-[.2em]">✳ &nbsp; YOUR NEXT CHAPTER COULD START HERE</p><h2 className="mt-6 text-5xl font-medium leading-none tracking-[-.06em] sm:text-7xl">Come as you are.<br /><em className="font-display text-leaf">Leave with more.</em></h2><p className="mt-5 max-w-md text-sm leading-7 text-paper/75">We’ll save you a seat, show you around and help you feel at home.</p><Link className="mt-7 inline-flex bg-leaf px-5 py-4 text-sm font-bold text-ink hover:bg-white" href="/contact">Get in touch <span className="ml-5">↗</span></Link></div><div className="min-h-64 overflow-hidden border border-paper/20"><iframe title="Map of Kigali, Rwanda" className="h-64 w-full border-0 grayscale" loading="lazy" src="https://maps.google.com/maps?q=Kigali%2C%20Rwanda&output=embed" /><p className="px-4 py-3 text-xs text-paper/75">Kigali, Rwanda · Exact church address to be added</p></div></div></section>
    </main>
  );
}
