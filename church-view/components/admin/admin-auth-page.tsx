import { AdminLoginForm } from "./admin-login-form";

type AuthStep = "register" | "verify" | "password" | "login";

export function AdminAuthPage({
  step,
  title,
  description,
}: {
  step: AuthStep;
  title: string;
  description: string;
}) {
  return <main className="mx-auto max-w-lg py-8 sm:py-12">
    <div className="surface-card overflow-hidden">
      <div className="h-1.5 bg-secondary" />
      <div className="p-6 sm:p-9">
        <p className="eyebrow text-clay">CHURCH · ADMIN WORKSPACE</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        <div className="mt-7"><AdminLoginForm initialStep={step} /></div>
        <p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted">Account sign-in is connected. Management permissions are controlled separately by the church administrator.</p>
      </div>
    </div>
  </main>;
}
