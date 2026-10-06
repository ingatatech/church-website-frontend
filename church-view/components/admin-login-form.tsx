"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { authRequest } from "../lib/church-api";

type AuthStep = "register" | "verify" | "password" | "login";
type RegistrationResult = { requestId: string; destination?: string };

const pendingKey = "ingata-admin-registration";
const completionKey = "ingata-admin-registration-complete";

export function AdminLoginForm({ initialStep = "login" }: { initialStep?: AuthStep }) {
  const router = useRouter();
  const step = initialStep;
  const [requestId, setRequestId] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const raw = window.sessionStorage.getItem(pendingKey);
    if (initialStep === "login") {
      const completionNotice = window.sessionStorage.getItem(completionKey);
      if (completionNotice) {
        setNotice(completionNotice);
        window.sessionStorage.removeItem(completionKey);
      }
    }
    if (!raw) {
      if (initialStep === "verify" || initialStep === "password") router.replace("/admin/signup");
      return;
    }
    try {
      const pending = JSON.parse(raw) as { requestId?: string; email?: string; verified?: boolean };
      if (pending.requestId) {
        setRequestId(pending.requestId);
        setEmail(pending.email ?? "");
        if (initialStep === "register") router.replace(pending.verified ? "/admin/setup-password" : "/admin/verify-email");
        if (initialStep === "verify" && pending.verified) router.replace("/admin/setup-password");
        if (initialStep === "password" && !pending.verified) router.replace("/admin/verify-email");
      }
    } catch {
      window.sessionStorage.removeItem(pendingKey);
      if (initialStep === "verify" || initialStep === "password") router.replace("/admin/signup");
    }
  }, [initialStep, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const values = new FormData(event.currentTarget);

    try {
      if (step === "register") {
        const result = await authRequest<RegistrationResult>("/auth/register", {
          fullName: String(values.get("fullName") ?? "").trim(),
          email: String(values.get("email") ?? "").trim(),
          acceptTerms: values.get("acceptTerms") === "on",
        });
        const nextEmail = String(values.get("email") ?? "").trim();
        setEmail(nextEmail);
        setRequestId(result.requestId);
        window.sessionStorage.setItem(pendingKey, JSON.stringify({ requestId: result.requestId, email: nextEmail }));
        setNotice(`We sent a six-digit verification code to ${result.destination ?? nextEmail}.`);
        router.push("/admin/verify-email");
      } else if (step === "verify") {
        await authRequest("/auth/verify-otp", {
          requestId,
          otp: String(values.get("otp") ?? "").trim(),
        });
        window.sessionStorage.setItem(pendingKey, JSON.stringify({ requestId, email, verified: true }));
        router.push("/admin/setup-password");
      } else if (step === "password") {
        const password = String(values.get("password") ?? "");
        const confirmPassword = String(values.get("confirmPassword") ?? "");
        if (password !== confirmPassword) throw new Error("Your passwords do not match.");
        await authRequest("/auth/setup-password", { password, confirmPassword });
        window.sessionStorage.removeItem(pendingKey);
        window.sessionStorage.setItem(completionKey, "Your account is ready. Sign in with your new password.");
        router.replace("/admin/login");
      } else {
        await authRequest("/auth/login", {
          email: String(values.get("email") ?? "").trim(),
          password: String(values.get("password") ?? ""),
        });
        const requestedPath = new URLSearchParams(window.location.search).get("next");
        const publicRoutes = ["/admin/login", "/admin/signup", "/admin/verify-email", "/admin/setup-password"];
        const destination = requestedPath?.startsWith("/admin/") && !publicRoutes.some((route) => requestedPath === route || requestedPath.startsWith(`${route}/`))
          ? requestedPath
          : "/admin";
        router.replace(destination);
        router.refresh();
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await authRequest<RegistrationResult>("/auth/resend-otp", { requestId });
      setNotice(`A new verification code was sent to ${result.destination ?? email}.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn’t resend the code.");
    } finally {
      setBusy(false);
    }
  }

  const isSignup = step !== "login";
  const steps = ["Your details", "Verify email", "Set password"];
  const activeStep = step === "register" ? 0 : step === "verify" ? 1 : step === "password" ? 2 : -1;

  return <div>
    {isSignup && <ol aria-label="Account setup progress" className="mb-7 grid grid-cols-3 gap-2">
      {steps.map((label, index) => <li className={`border-t-2 pt-2 text-[11px] font-semibold leading-4 sm:text-xs ${index <= activeStep ? "border-primary text-primary" : "border-border text-muted"}`} key={label}>
        <span className="mr-1.5">0{index + 1}</span>{label}
      </li>)}
    </ol>}

    <form className="space-y-5" onSubmit={submit}>
      {step === "register" && <>
        <label className="block text-sm font-semibold" htmlFor="fullName">Full name<input id="fullName" name="fullName" className="form-field mt-2" type="text" autoComplete="name" minLength={2} maxLength={140} required /></label>
        <label className="block text-sm font-semibold" htmlFor="signupEmail">Email address<input id="signupEmail" name="email" className="form-field mt-2" type="email" autoComplete="email" required /></label>
        <label className="flex items-start gap-3 text-sm leading-6 text-muted"><input className="mt-1 size-4 accent-primary" name="acceptTerms" type="checkbox" required /><span>I agree to the terms of use and privacy policy.</span></label>
      </>}

      {step === "verify" && <>
        <p className="text-sm leading-6 text-muted">Enter the six-digit code sent to <span className="font-semibold text-text">{email}</span>.</p>
        <label className="block text-sm font-semibold" htmlFor="otp">Verification code<input id="otp" name="otp" className="form-field mt-2 text-center text-xl tracking-[.35em]" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} autoFocus required /></label>
        <button className="text-sm font-semibold text-primary underline-offset-4 hover:underline disabled:opacity-50" type="button" disabled={busy} onClick={resendCode}>Send a new code</button>
      </>}

      {step === "password" && <>
        <p className="text-sm leading-6 text-muted">Set a password for <span className="font-semibold text-text">{email}</span>. Use at least 8 characters.</p>
        <label className="block text-sm font-semibold" htmlFor="newPassword">Password<input id="newPassword" name="password" className="form-field mt-2" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /></label>
        <label className="block text-sm font-semibold" htmlFor="confirmPassword">Confirm password<input id="confirmPassword" name="confirmPassword" className="form-field mt-2" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /></label>
      </>}

      {step === "login" && <>
        <label className="block text-sm font-semibold" htmlFor="loginEmail">Email address<input id="loginEmail" name="email" className="form-field mt-2" type="email" autoComplete="username" required /></label>
        <label className="block text-sm font-semibold" htmlFor="loginPassword">Password<input id="loginPassword" name="password" className="form-field mt-2" type="password" autoComplete="current-password" minLength={6} maxLength={128} required /></label>
      </>}

      {error && <p className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm leading-5 text-error" role="alert">{error}</p>}
      {notice && <p className="rounded-lg border border-success/20 bg-success/5 px-4 py-3 text-sm leading-5 text-success" role="status">{notice}</p>}

      <button className="button button-primary w-full disabled:cursor-wait disabled:opacity-60" type="submit" disabled={busy || (step === "verify" && !requestId)}>
        {busy ? "Please wait…" : step === "register" ? "Create account" : step === "verify" ? "Verify email" : step === "password" ? "Set password" : "Sign in"}
      </button>
    </form>

    {step === "login" ? <p className="mt-6 text-center text-sm text-muted">New to the workspace? <Link className="font-semibold text-primary hover:underline" href="/admin/signup">Create an account</Link></p> : step !== "password" && <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link className="font-semibold text-primary hover:underline" href="/admin/login">Sign in</Link></p>}
    {step === "verify" && <button className="mt-4 block w-full text-center text-sm text-muted underline-offset-4 hover:text-text hover:underline" type="button" onClick={() => { window.sessionStorage.removeItem(pendingKey); router.replace("/admin/signup"); }}>Use a different email address</button>}
  </div>;
}
