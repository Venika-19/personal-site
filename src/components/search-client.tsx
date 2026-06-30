"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search as SearchIcon } from "lucide-react";
import type { SearchDoc } from "@/lib/content";

const typeHref: Record<SearchDoc["type"], (slug: string) => string> = {
  blog: (slug) => `/blog/${slug}`,
  notes: (slug) => `/notes/${slug}`,
  projects: (slug) => `/projects/${slug}`,
};

const typeLabel: Record<SearchDoc["type"], string> = {
  blog: "Blog",
  notes: "Note",
  projects: "Project",
};

export function SearchClient({ index }: { index: SearchDoc[] }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: ["title", "description", "tags"],
        threshold: 0.35,
      }),
    [index]
  );

  const results = query.trim() ? fuse.search(query).map((r) => r.item) : index;

  return (
    <div>
      <div className="relative mb-8">
        <SearchIcon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search everything…"
          className="w-full rounded-md border border-border bg-bg-raised py-3 pl-10 pr-3 text-sm outline-none focus-visible:border-accent"
          autoFocus
        />
      </div>

      <ul className="divide-y divide-border border-y border-border">
        {results.length > 0 ? (
          results.map((doc) => (
            <li key={`${doc.type}-${doc.slug}`} className="py-4">
              <Link
                href={typeHref[doc.type](doc.slug)}
                className="group flex flex-col gap-1"
              >
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                    {typeLabel[doc.type]}
                  </span>
                  <span className="font-display text-base text-ink group-hover:text-accent">
                    {doc.title}
                  </span>
                </span>
                {doc.description && (
                  <span className="text-sm text-ink-muted">
                    {doc.description}
                  </span>
                )}
              </Link>
            </li>
          ))
        ) : (
          <li className="py-10 text-center text-sm text-ink-faint">
            No results for &ldquo;{query}&rdquo;.
          </li>
        )}
      </ul>
    </div>
  );
}
