"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/config";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    // Replace this with a real endpoint: an API route, Formspree,
    // Resend, or a serverless function. This is a placeholder that
    // simulates a network request.
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="rounded-md border border-border bg-bg-raised p-5 text-sm text-ink-muted">
        Thanks — your message has been sent. I&apos;ll get back to you soon at the
        address you provided.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm text-ink-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-md border border-border bg-bg-raised px-3 py-2 text-sm outline-none focus-visible:border-accent"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-ink-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-border bg-bg-raised px-3 py-2 text-sm outline-none focus-visible:border-accent"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm text-ink-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-border bg-bg-raised px-3 py-2 text-sm outline-none focus-visible:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-600">
          Something went wrong. Please email {siteConfig.email} directly.
        </p>
      )}
    </form>
  );
}
