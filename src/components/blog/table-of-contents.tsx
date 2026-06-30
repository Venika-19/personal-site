import type { TocItem } from "@/lib/mdx";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-24 hidden max-h-[70vh] overflow-y-auto lg:block"
    >
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-faint">
        On this page
      </p>
      <ul className="space-y-2 border-l border-border text-sm">
        {items.map((item) => (
          <li
            key={item.slug}
            style={{ paddingLeft: item.depth === 3 ? "1.75rem" : "1rem" }}
          >
            <a
              href={`#${item.slug}`}
              className="block border-l border-transparent py-0.5 text-ink-muted hover:text-accent"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
