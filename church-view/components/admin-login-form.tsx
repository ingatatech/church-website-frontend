"use client";

export function AdminLoginForm() {
  return <form className="mt-7 space-y-5" onSubmit={(event) => event.preventDefault()}>
    <label className="block text-sm font-semibold">Email address<input className="form-field mt-2" type="email" autoComplete="username" required /></label>
    <label className="block text-sm font-semibold">Password<input className="form-field mt-2" type="password" autoComplete="current-password" required /></label>
    <button className="button button-primary w-full" type="submit">Sign in</button>
  </form>;
}
