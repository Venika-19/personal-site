"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, FileText, Sprout, FolderGit2, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import type { SearchDoc } from "@/lib/content";

const typeIcon = {
  blog: FileText,
  notes: Sprout,
  projects: FolderGit2,
};

const typeHref = {
  blog: (slug: string) => `/blog/${slug}`,
  notes: (slug: string) => `/notes/${slug}`,
  projects: (slug: string) => `/projects/${slug}`,
};

export function CommandPalette({ searchIndex }: { searchIndex: SearchDoc[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    const openHandler = () => setOpen(true);
    document.addEventListener("open-command-palette", openHandler);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("open-command-palette", openHandler);
    };
  }, [handleKeydown]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <Command
        shouldFilter
        className="w-full max-w-lg overflow-hidden rounded-md border border-border bg-bg-raised shadow-xl"
        onClick={(e) => e.stopPropagation()}
        label="Command palette"
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search size={14} className="text-ink-faint" />
          <Command.Input
            autoFocus
            placeholder="Search posts, notes, projects…"
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-ink-faint"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-ink-faint">
            Esc
          </kbd>
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-ink-faint">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigate" className="px-2 pb-1 pt-2">
            {siteConfig.nav.map((item) => (
              <Command.Item
                key={item.href}
                onSelect={() => navigate(item.href)}
                className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-2 text-sm text-ink data-[selected=true]:bg-accent-soft"
              >
                {item.label}
                <ArrowRight size={12} className="text-ink-faint" />
              </Command.Item>
            ))}
          </Command.Group>

          {searchIndex.length > 0 && (
            <Command.Group heading="Content" className="px-2 pb-1 pt-3">
              {searchIndex.map((doc) => {
                const Icon = typeIcon[doc.type];
                return (
                  <Command.Item
                    key={`${doc.type}-${doc.slug}`}
                    onSelect={() => navigate(typeHref[doc.type](doc.slug))}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-ink data-[selected=true]:bg-accent-soft"
                  >
                    <Icon size={14} className="shrink-0 text-ink-faint" />
                    <span className="truncate">{doc.title}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}
