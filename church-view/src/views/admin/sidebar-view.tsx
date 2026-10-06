"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  Church,
  HandHeart,
  Image,
  Inbox,
  LayoutDashboard,
  Megaphone,
  Mic2,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SidebarViewProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navigationGroups: { label: string; items: { label: string; href: string; icon: LucideIcon }[] }[] = [
  { label: "Workspace", items: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  ] },
  { label: "Website content", items: [
    { label: "Sermons", href: "/admin/sermons", icon: Mic2 },
    { label: "Events", href: "/admin/events", icon: CalendarDays },
    { label: "Ministries", href: "/admin/ministries", icon: UsersRound },
    { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { label: "Resources", href: "/admin/resources", icon: BookOpen },
    { label: "Leadership", href: "/admin/leadership", icon: UsersRound },
    { label: "Media library", href: "/admin/media", icon: Image },
  ] },
  { label: "Community", items: [
    { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
    { label: "Prayer Requests", href: "/admin/prayer-requests", icon: HandHeart },
  ] },
  { label: "System", items: [
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ] },
];

export function SidebarView({ isOpen, onClose }: SidebarViewProps) {
  const pathname = usePathname();

  return <>
    {isOpen && <button
      aria-label="Close navigation menu"
      className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
      onClick={onClose}
      type="button"
    />}
    <aside id="admin-dashboard-sidebar" className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-300 transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
        <Link aria-label="Ingata Church admin dashboard" className="flex items-center gap-3 text-white" href="/admin/dashboard" onClick={onClose}>
          <span className="grid size-10 place-items-center rounded-xl bg-indigo-600"><Church aria-hidden="true" className="size-5" /></span>
          <span><span className="block text-sm font-semibold tracking-wide">INGATA</span><span className="mt-0.5 block text-xs text-slate-400">Church Admin</span></span>
        </Link>
        <button aria-label="Close navigation menu" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden" onClick={onClose} type="button"><X aria-hidden="true" className="size-5" /></button>
      </div>

      <nav aria-label="Administration" className="flex-1 space-y-5 overflow-y-auto px-4 py-6">
        {navigationGroups.map((group) => <div className="space-y-1" key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{group.label}</p>
          {group.items.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return <Link
              aria-current={active ? "page" : undefined}
              className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${active ? "bg-indigo-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
              href={href}
              key={href}
              onClick={onClose}
            >
              <Icon aria-hidden="true" className="size-[18px] shrink-0" />
              <span>{label}</span>
            </Link>;
          })}
        </div>)}
      </nav>

      <div className="border-t border-slate-800 p-5">
        <div className="rounded-xl bg-slate-800/80 p-4">
          <p className="text-sm font-semibold text-white">Need a hand?</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Contact your church administrator if you need help managing the website.</p>
        </div>
        <p className="mt-4 px-1 text-[11px] text-slate-500">Ingata Church · Kigali</p>
      </div>
    </aside>
  </>;
}
