"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Command, Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { ThemeSwitcher } from "@/components/theme-switcher";

function FlowerLogo() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="-16 -16 32 32"
      aria-hidden="true"
      className="shrink-0"
    >
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={0}
          cy={-8}
          rx={4.4}
          ry={8}
          fill="var(--sakura-petal)"
          transform={`rotate(${a})`}
        />
      ))}
      <circle cx={0} cy={0} r={3} fill="var(--sakura-center)" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function openCommandPalette() {
    document.dispatchEvent(new CustomEvent("open-command-palette"));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-ink"
          aria-label={`${siteConfig.name} — home`}
        >
          <FlowerLogo />
          {siteConfig.initials}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  active ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCommandPalette}
            className="hidden items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-ink-faint transition-colors hover:text-ink md:flex"
            aria-label="Open command palette"
          >
            <Command size={12} />
            <span>Search</span>
            <kbd className="ml-1 rounded border border-border-strong px-1 text-[10px]">
              ⌘K
            </kbd>
          </button>

          <ThemeSwitcher />

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-border px-5 py-3 md:hidden"
          aria-label="Mobile primary"
        >
          <ul className="flex flex-col gap-3">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block text-sm text-ink-muted hover:text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
