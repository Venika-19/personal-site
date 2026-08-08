import type { ReactNode } from "react";

export function Era({
  period,
  label,
  children,
}: {
  period: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-bg-raised p-6">
      <div className="mb-3 flex flex-wrap items-baseline gap-3">
        <span className="font-display text-base font-semibold text-ink">
          {label}
        </span>
        <span className="font-mono text-xs text-ink-faint">{period}</span>
      </div>
      <div className="text-sm leading-relaxed text-ink-muted">{children}</div>
    </div>
  );
}
