import Link from "next/link";
import type { ReactNode } from "react";

export function Tag({ children, href }: { children: ReactNode; href?: string }) {
  const className =
    "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-ink-muted transition-colors hover:border-accent hover:text-accent";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <span className={className}>{children}</span>;
}
