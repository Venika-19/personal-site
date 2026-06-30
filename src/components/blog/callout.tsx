import { Info, AlertTriangle, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

const variants = {
  note: { icon: Info, label: "Note" },
  warning: { icon: AlertTriangle, label: "Warning" },
  tip: { icon: Lightbulb, label: "Tip" },
} as const;

export function Callout({
  type = "note",
  children,
}: {
  type?: keyof typeof variants;
  children: ReactNode;
}) {
  const { icon: Icon, label } = variants[type];

  return (
    <div className="not-prose flex gap-3 rounded-md border border-border bg-bg-raised p-4 text-sm leading-relaxed">
      <Icon size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
      <div>
        <p className="mb-1 font-sans text-xs font-medium uppercase tracking-wide text-ink-faint">
          {label}
        </p>
        <div className="text-ink-muted">{children}</div>
      </div>
    </div>
  );
}
