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
  return (
    <main className="mx-auto w-full max-w-xl">
      <div className="overflow-hidden border border-stone-200 bg-white shadow-xl shadow-stone-900/10">
        <div className="h-1.5 bg-amber-700" />
        <div className="p-6 sm:p-10">
          <p className="text-xs font-bold tracking-[.18em] text-amber-800 uppercase">Church · Admin workspace</p>
          <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-stone-900 sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">{description}</p>
          <div className="mt-8"><AdminLoginForm initialStep={step} /></div>
          <p className="mt-7 border-t border-stone-200 pt-4 text-xs leading-5 text-stone-500">
            Account access is for authorized church administrators. Management permissions are controlled separately.
          </p>
        </div>
      </div>
    </main>
  );
}
