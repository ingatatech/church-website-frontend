"use client";

import { useState, type FormEvent } from "react";

type SubmissionType = "contact" | "visitor" | "prayer";

export function SubmissionForm({ type = "contact", compact = false, initialMessage = "" }: { type?: SubmissionType; compact?: boolean; initialMessage?: string }) {
  const [status, setStatus] = useState<string>("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5004/api").replace(/\/$/, "");
    try {
      const response = await fetch(`${apiBase}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone") || undefined,
          message: form.get("message"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "We couldn’t send your message. Please try again.");
      formElement.reset();
      setStatus(result.message ?? "Thanks. Your message has been received.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "We couldn’t send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const fieldClass = "w-full border border-ink/20 bg-paper px-4 py-3 text-sm outline-none transition placeholder:text-muted/70 focus:border-forest focus:ring-1 focus:ring-forest";
  return <form className={compact ? "space-y-4" : "space-y-5"} onSubmit={submit}>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold">Your name<input className={`${fieldClass} mt-2`} name="name" autoComplete="name" maxLength={140} required /></label><label className="block text-xs font-semibold">Email address<input className={`${fieldClass} mt-2`} name="email" type="email" autoComplete="email" maxLength={254} required /></label></div>
    <label className="block text-xs font-semibold">Phone <span className="font-normal text-muted">(optional)</span><input className={`${fieldClass} mt-2`} name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
    <label className="block text-xs font-semibold">{type === "prayer" ? "Prayer request" : type === "visitor" ? "Anything you’d like us to know before you visit?" : "How can we help?"}<textarea className={`${fieldClass} mt-2 min-h-32 resize-y`} name="message" minLength={5} maxLength={5000} defaultValue={initialMessage} required /></label>
    {type === "prayer" && <p className="text-xs leading-5 text-muted">Prayer requests are personal. Share only what you’re comfortable sending to the church team.</p>}
    <button className="bg-forest px-5 py-3.5 text-sm font-bold text-paper transition hover:bg-ink disabled:cursor-wait disabled:opacity-60" disabled={sending} type="submit">{sending ? "Sending…" : "Send message"} <span className="ml-4">↗</span></button>
    <p className="min-h-5 text-sm text-muted" aria-live="polite" role="status">{status}</p>
  </form>;
}
