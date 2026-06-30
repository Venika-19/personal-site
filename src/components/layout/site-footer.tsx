import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="rule mt-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-10 text-sm text-ink-faint md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {siteConfig.name}. Built with Next.js, typed in
          TypeScript.
        </p>

        <nav aria-label="Footer" className="flex flex-wrap gap-4">
          {siteConfig.footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <a href={siteConfig.social.rss} className="hover:text-ink">
            RSS
          </a>
        </nav>
      </div>
    </footer>
  );
}
