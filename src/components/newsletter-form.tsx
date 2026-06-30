import { siteConfig } from "@/lib/config";

export function NewsletterForm() {
  if (!siteConfig.newsletter.enabled) return null;

  return (
    <div className="rounded-md border border-border bg-bg-raised p-6">
      <h3 className="font-display text-lg font-semibold text-ink">
        Get new posts by email
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        [One line about cadence and what subscribers get. No spam.]
      </p>
      {/* Replace `action` in src/lib/config.ts with your provider's endpoint. */}
      <form
        action={siteConfig.newsletter.action}
        method="post"
        className="mt-4 flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus-visible:border-accent"
        />
        <button
          type="submit"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
