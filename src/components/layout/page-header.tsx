import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="pb-10 pt-16">
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-xl text-lg text-ink-muted">{description}</p>
      )}
      {children}
    </header>
  );
}
