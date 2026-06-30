/**
 * Site-wide configuration.
 * Replace every placeholder value below with your own.
 * Nothing here touches React/JSX — it's safe to edit without
 * understanding the rest of the codebase.
 */

export const siteConfig = {
  name: "[Your Name]",
  initials: "[YN]",
  title: "[Your Name] — [Your Role / Tagline]",
  description:
    "[A one- to two-sentence description of who you are and what this site is about. Used for SEO and social previews.]",
  url: "https://example.com",
  locale: "en-US",
  email: "[your-email@example.com]",
  social: {
    github: "https://github.com/[your-handle]",
    twitter: "https://twitter.com/[your-handle]",
    linkedin: "https://linkedin.com/in/[your-handle]",
    rss: "/rss.xml",
  },
  nav: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "Notes", href: "/notes" },
    { label: "Now", href: "/now" },
  ],
  footerLinks: [
    { label: "Uses", href: "/uses" },
    { label: "Reading", href: "/reading" },
    { label: "Photography", href: "/photography" },
    { label: "Contact", href: "/contact" },
    { label: "Colophon", href: "/colophon" },
  ],
  newsletter: {
    enabled: true,
    // Replace with your provider's endpoint (e.g. Buttondown, ConvertKit, Resend).
    action: "https://example.com/api/newsletter/subscribe",
  },
  analytics: {
    // Replace with your analytics provider's site id / token, e.g. Plausible, Vercel Analytics.
    provider: "plausible",
    domain: "example.com",
    enabled: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;
