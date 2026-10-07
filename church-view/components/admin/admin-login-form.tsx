"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authRequest } from "@/lib/api/church-api";

type AuthStep = "register" | "verify" | "password" | "login";
type RegistrationResult = { requestId: string; destination?: string };

const pendingKey = "church-admin-registration";
const completionKey = "church-admin-registration-complete";

function PasswordField({
  id,
  name,
  label,
  autoComplete,
  minLength,
  maxLength,
  visible,
  onToggle,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  minLength: number;
  maxLength: number;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-800" htmlFor={id}>{label}</label>
      <div className="relative mt-2">
        <input
          autoComplete={autoComplete}
          className="auth-field pr-12"
          id={id}
          maxLength={maxLength}
          minLength={minLength}
          name={name}
          required
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-stone-600 transition-colors hover:text-amber-800 focus-visible:outline-amber-700"
          onClick={onToggle}
          type="button"
        >
          {visible ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
        </button>
      </div>
    </div>
  );
}

export function AdminLoginForm({ initialStep = "login" }: { initialStep?: AuthStep }) {
  const router = useRouter();
  const step = initialStep;
  const [requestId, setRequestId] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      {steps.map((label, index) => <li className={`border-t-2 pt-2 text-[11px] font-semibold leading-4 sm:text-xs ${index <= activeStep ? "border-amber-700 text-amber-800" : "border-stone-300 text-stone-500"}`} key={label}>
        <span className="mr-1.5">0{index + 1}</span>{label}
      </li>)}
    </ol>}

    <form className="space-y-5" onSubmit={submit}>
      {step === "register" && <>
        <label className="block text-sm font-semibold text-stone-800" htmlFor="fullName">Full name<input id="fullName" name="fullName" className="auth-field mt-2" type="text" autoComplete="name" minLength={2} maxLength={140} required /></label>
        <label className="block text-sm font-semibold text-stone-800" htmlFor="signupEmail">Email address<input id="signupEmail" name="email" className="auth-field mt-2" type="email" autoComplete="email" required /></label>
        <label className="flex items-start gap-3 text-sm leading-6 text-stone-600"><input className="mt-1 size-4 accent-amber-700" name="acceptTerms" type="checkbox" required /><span>I agree to the terms of use and privacy policy.</span></label>
      </>}

      {step === "verify" && <>
        <p className="text-sm leading-6 text-stone-600">Enter the six-digit code sent to <span className="font-semibold text-stone-900">{email}</span>.</p>
        <label className="block text-sm font-semibold text-stone-800" htmlFor="otp">Verification code<input id="otp" name="otp" className="auth-field mt-2 text-center text-xl tracking-[.35em]" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} autoFocus required /></label>
        <button className="text-sm font-semibold text-amber-800 underline-offset-4 hover:underline disabled:opacity-50" type="button" disabled={busy} onClick={resendCode}>Send a new code</button>
      </>}

      {step === "password" && <>
        <p className="text-sm leading-6 text-stone-600">Set a password for <span className="font-semibold text-stone-900">{email}</span>. Use at least 8 characters.</p>
        <PasswordField id="newPassword" name="password" label="Password" autoComplete="new-password" minLength={8} maxLength={128} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} />
        <PasswordField id="confirmPassword" name="confirmPassword" label="Confirm password" autoComplete="new-password" minLength={8} maxLength={128} visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((visible) => !visible)} />
      </>}

      {step === "login" && <>
        <label className="block text-sm font-semibold text-stone-800" htmlFor="loginEmail">Email address<input id="loginEmail" name="email" className="auth-field mt-2" type="email" autoComplete="username" required /></label>
        <PasswordField id="loginPassword" name="password" label="Password" autoComplete="current-password" minLength={6} maxLength={128} visible={showPassword} onToggle={() => setShowPassword((visible) => !visible)} />
      </>}

      {error && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800" role="alert">{error}</p>}
      {notice && <p className="border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-800" role="status">{notice}</p>}

      <button className="inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-amber-700 px-5 py-3 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-amber-800 disabled:cursor-wait disabled:opacity-60" type="submit" disabled={busy || (step === "verify" && !requestId)}>
        {busy ? "Please wait…" : step === "register" ? "Create account" : step === "verify" ? "Verify email" : step === "password" ? "Set password" : "Sign in"}
      </button>
    </form>

    {step === "login" ? <p className="mt-6 text-center text-sm text-stone-600">New to the workspace? <Link className="font-semibold text-amber-800 hover:underline" href="/admin/signup">Create an account</Link></p> : step !== "password" && <p className="mt-6 text-center text-sm text-stone-600">Already have an account? <Link className="font-semibold text-amber-800 hover:underline" href="/admin/login">Sign in</Link></p>}
    {step === "verify" && <button className="mt-4 block w-full text-center text-sm text-stone-600 underline-offset-4 hover:text-stone-900 hover:underline" type="button" onClick={() => { window.sessionStorage.removeItem(pendingKey); router.replace("/admin/signup"); }}>Use a different email address</button>}
  </div>;
}
