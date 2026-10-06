"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { authGet, authRequest } from "../../lib/church-api";
import { adminSections } from "../../lib/site-content";

const publicAuthRoutes = new Set([
  "/admin/login",
  "/admin/signup",
  "/admin/verify-email",
  "/admin/setup-password",
]);

type SessionProfile = { status?: string };

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicAuthPage = publicAuthRoutes.has(pathname);
  const [authorizedPath, setAuthorizedPath] = useState("");

  useEffect(() => {
    if (isPublicAuthPage) return;
    let cancelled = false;

    async function checkSession() {
      try {
        let profile: SessionProfile;
        try {
          profile = await authGet<SessionProfile>("/auth/me");
        } catch {
          await authRequest("/auth/refresh");
          profile = await authGet<SessionProfile>("/auth/me");
        }

        if (profile?.status !== "active") throw new Error("An active account is required.");
        if (!cancelled) setAuthorizedPath(pathname);
      } catch {
        if (!cancelled) {
          const returnTo = encodeURIComponent(pathname);
          router.replace(`/admin/login?next=${returnTo}`);
        }
      }
    }

    void checkSession();
    return () => { cancelled = true; };
  }, [isPublicAuthPage, pathname, router]);

  if (isPublicAuthPage) {
    return <>
      <header className="border-b border-border bg-surface">
        <div className="page-container flex min-h-16 items-center justify-between gap-4">
          <Link href="/admin" className="font-semibold">Ingata <span className="font-normal text-muted">/ Admin</span></Link>
          <Link className="text-sm font-semibold hover:text-clay" href="/">View website <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      <div className="page-container">{children}</div>
    </>;
  }

  if (authorizedPath !== pathname) {
    return <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div role="status" aria-live="polite">
        <div className="mx-auto size-9 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden="true" />
        <p className="mt-4 text-sm font-medium text-muted">Checking your account…</p>
      </div>
    </main>;
  }

  return <div className="min-h-screen bg-background text-text">
    <header className="border-b border-border bg-surface">
      <div className="page-container flex min-h-16 items-center justify-between gap-4">
        <Link href="/admin" className="font-semibold">Ingata <span className="font-normal text-muted">/ Admin</span></Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden text-muted sm:inline">Administrator workspace</span>
          <Link className="font-semibold hover:text-clay" href="/">View website <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </header>
    <div className="page-container grid gap-7 py-7 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-5 lg:h-fit">
        <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible">
          {adminSections.map(([label, href]) => <Link className="whitespace-nowrap border border-border bg-surface px-3 py-2.5 text-sm hover:border-primary hover:text-primary" href={href} key={href}>{label}</Link>)}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  </div>;
}
