import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Colophon",
  description: "Notes on how this site is built.",
};

const stack = [
  { label: "Framework", value: "Next.js (App Router), TypeScript" },
  { label: "Styling", value: "Tailwind CSS v4, CSS variables for theming" },
  { label: "Content", value: "MDX, parsed at build time with gray-matter + next-mdx-remote" },
  { label: "Typography", value: "Fraunces (display), Source Serif 4 (body), Inter Tight (UI), JetBrains Mono (code)" },
  { label: "Code highlighting", value: "rehype-pretty-code (Shiki)" },
  { label: "Diagrams", value: "Mermaid" },
  { label: "Math", value: "KaTeX via remark-math / rehype-katex" },
  { label: "Motion", value: "Framer Motion, used sparingly" },
  { label: "Icons", value: "Lucide" },
  { label: "Search", value: "cmdk command palette + Fuse.js" },
  { label: "Hosting", value: "Vercel" },
];

export default function ColophonPage() {
  return (
    <Container narrow>
      <PageHeader
        eyebrow="How this is built"
        title="Colophon"
        description="A record of the tools and decisions behind this site, kept up to date as things change."
      />
      <dl className="divide-y divide-border border-t border-border pb-20">
        {stack.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <dt className="font-mono text-xs uppercase tracking-wide text-ink-faint sm:w-40 sm:shrink-0">
              {item.label}
            </dt>
            <dd className="text-sm text-ink-muted">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}
