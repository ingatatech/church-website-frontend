"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { ChurchLogo } from "@/components/brand/church-logo";
import { authGet, authRequest } from "@/lib/api/church-api";
import { AdminShellView } from "@/components/admin/admin-shell-view";

type SessionProfile = { status?: string; fullName?: string; email?: string };

export default function AdminWorkspaceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<"checking" | "authorized" | "redirecting">("checking");
  const [profile, setProfile] = useState<SessionProfile>({});
  const checkStarted = useRef(false);
  const currentPath = useRef(pathname);
  currentPath.current = pathname;

  useEffect(() => {
    if (checkStarted.current) return;
    checkStarted.current = true;
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
        if (!cancelled) {
          setProfile(profile);
          setAuthStatus("authorized");
        }
      } catch {
        if (!cancelled) {
          const returnTo = encodeURIComponent(currentPath.current);
          setAuthStatus("redirecting");
          router.replace(`/admin/login?next=${returnTo}`);
        }
      }
    }

    void checkSession();
    return () => {
      cancelled = true;
      checkStarted.current = false;
    };
  }, [router]);

  if (authStatus !== "authorized") {
    return <main className="grid min-h-screen place-items-center bg-slate-50 px-5 py-10">
      <section aria-live="polite" className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
          <ChurchLogo className="size-10 rounded-full object-contain" />
        </span>
        <div className="mt-6 flex items-center justify-center gap-2">
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-900">{authStatus === "redirecting" ? "Opening sign in" : "Preparing your workspace"}</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-500">{authStatus === "redirecting" ? "Taking you to the secure sign-in page." : "One moment while we get your dashboard ready."}</p>
        <div aria-hidden="true" className="mt-7 space-y-2.5">
          <div className="mx-auto h-2 w-2/3 animate-pulse rounded-full bg-slate-100" />
          <div className="mx-auto h-2 w-1/2 animate-pulse rounded-full bg-slate-100 [animation-delay:120ms]" />
        </div>
      </section>
    </main>;
  }

  return <AdminShellView profile={profile}>{children}</AdminShellView>;
}
