import { Bell, Menu, Search } from "lucide-react";

type AdminProfile = {
  fullName?: string;
  email?: string;
};

export function HeaderView({ profile, isMenuOpen, onMenuClick }: { profile: AdminProfile; isMenuOpen: boolean; onMenuClick: () => void }) {
  const displayName = profile.fullName?.trim() || "Administrator";
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "A";

  return <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
    <div className="flex min-h-[4.5rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
      <button aria-controls="admin-dashboard-sidebar" aria-expanded={isMenuOpen} aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"} className="grid size-10 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenuClick} type="button">
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <label className="relative min-w-0 max-w-xl flex-1">
        <span className="sr-only">Search the admin workspace</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
        <input className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" placeholder="Search sermons, events, and more" type="search" />
      </label>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
        <button aria-label="Notifications" className="relative grid size-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800" type="button">
          <Bell aria-hidden="true" className="size-5" />
          <span aria-hidden="true" className="absolute right-2.5 top-2.5 size-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>
        <div aria-label={`Signed in as ${displayName}`} className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
          <div aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{initials}</div>
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-40 truncate text-sm font-semibold text-slate-900">{displayName}</p>
            <p className="max-w-40 truncate text-xs text-slate-500">{profile.email || "Administrator"}</p>
          </div>
        </div>
      </div>
    </div>
  </header>;
}
