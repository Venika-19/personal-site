import { getAllPosts, getAllNotes } from "./content";

export interface BacklinkEntry {
  slug: string;
  title: string;
  type: "blog" | "notes";
  href: string;
}

const WIKILINK_PATTERN = /\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;

function extractTargetSlugs(content: string): string[] {
  const slugs: string[] = [];
  const re = new RegExp(WIKILINK_PATTERN.source, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    slugs.push(match[1].trim());
  }
  return slugs;
}

// targetSlug → list of pages that contain [[targetSlug]]
export function buildBacklinkIndex(): Record<string, BacklinkEntry[]> {
  const index: Record<string, BacklinkEntry[]> = {};

  const sources = [
    ...getAllPosts().map((p) => ({
      slug: p.slug,
      title: p.frontmatter.title,
      content: p.content,
      type: "blog" as const,
      href: `/blog/${p.slug}`,
    })),
    ...getAllNotes().map((n) => ({
      slug: n.slug,
      title: n.frontmatter.title,
      content: n.content,
      type: "notes" as const,
      href: `/notes/${n.slug}`,
    })),
  ];

  for (const source of sources) {
    for (const targetSlug of extractTargetSlugs(source.content)) {
      if (!index[targetSlug]) index[targetSlug] = [];
      if (!index[targetSlug].some((e) => e.slug === source.slug)) {
        index[targetSlug].push({
          slug: source.slug,
          title: source.title,
          type: source.type,
          href: source.href,
        });
      }
    }
  }

  return index;
}

// slug → { url, title } for the remark plugin to resolve wikilinks
export function buildSlugMap(): Record<string, { url: string; title: string }> {
  const map: Record<string, { url: string; title: string }> = {};
  for (const p of getAllPosts()) {
    map[p.slug] = { url: `/blog/${p.slug}`, title: p.frontmatter.title };
  }
  for (const n of getAllNotes()) {
    map[n.slug] = { url: `/notes/${n.slug}`, title: n.frontmatter.title };
  }
  return map;
}

// ---- remark plugin -------------------------------------------------------

function splitWikilinks(
  text: string,
  slugMap: Record<string, { url: string; title: string }>
): any[] {
  const re = new RegExp(WIKILINK_PATTERN.source, "g");
  const parts: any[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const slug = match[1].trim();
    const label = match[2]?.trim();
    const entry = slugMap[slug];
    parts.push({
      type: "link",
      url: entry?.url ?? `/notes/${slug}`,
      data: { hProperties: { className: "wikilink" } },
      children: [{ type: "text", value: label || entry?.title || slug }],
    });
    lastIndex = match.index + match[0].length;
  }

  if (parts.length === 0) return [{ type: "text", value: text }];
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }
  return parts;
}

function processChildren(
  children: any[],
  slugMap: Record<string, { url: string; title: string }>
): any[] {
  const result: any[] = [];
  for (const child of children) {
    if (child.type === "text") {
      result.push(...splitWikilinks(child.value, slugMap));
    } else {
      if (Array.isArray(child.children)) {
        child.children = processChildren(child.children, slugMap);
      }
      result.push(child);
    }
  }
  return result;
}

export function remarkWikilinks(
  slugMap: Record<string, { url: string; title: string }>
) {
  return () => (tree: any) => {
    if (Array.isArray(tree.children)) {
      tree.children = processChildren(tree.children, slugMap);
    }
  };
}
