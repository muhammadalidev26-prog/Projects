"use client";
import { useState } from "react";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    }).catch(() => null);

    if (res?.ok) {
      form.reset();
      setState("sent");
    } else {
      setError((await res?.json().catch(() => null))?.error ?? "Couldn't send. Check your connection and try again.");
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label>
        <input id="name" name="name" required maxLength={100} autoComplete="name" className="input" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className="input" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Project details</label>
        <textarea id="message" name="message" required minLength={10} maxLength={4000} rows={5} className="input" />
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button className="btn w-full sm:w-auto" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
      <p role="status" className="min-h-6 text-sm">
        {state === "sent" && <span className="text-accent">Message sent. Check your inbox for a confirmation.</span>}
        {state === "error" && <span className="text-red-400">{error}</span>}
      </p>
    </form>
  );
}
