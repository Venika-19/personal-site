/**
 * Site-wide configuration.
 * Replace every placeholder value below with your own.
 * Nothing here touches React/JSX — it's safe to edit without
 * understanding the rest of the codebase.
 */

export const siteConfig = {
  name: "Venika Sruthi",
  initials: "VS",
  title: "Venika Sruthi — Software Engineer",
  description:
    "Software Engineer II at Harness. Writing about engineering, ideas, and everything in between.",
  url: "https://byvenika.com",
  locale: "en-US",
  email: "venikasruthi19@gmail.com",
  social: {
    linkedin: "https://www.linkedin.com/in/venika-sruthi/",
    rss: "/rss.xml",
  },
  nav: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Notes", href: "/notes" },
    { label: "Now", href: "/now" },
  ],
  footerLinks: [
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
    domain: "byvenika.com",
    enabled: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;
