import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTimeFn from "reading-time";
import type {
  BaseFrontmatter,
  BlogFrontmatter,
  ContentEntry,
  NoteFrontmatter,
  ProjectFrontmatter,
} from "./content-types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

/**
 * This module is the entire "headless CMS" for the site.
 * Every MDX file under /content is automatically discovered —
 * adding a new blog post means adding a new .mdx file, nothing else.
 */

function getDirectory(type: string) {
  return path.join(CONTENT_ROOT, type);
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

function readEntry<T extends BaseFrontmatter>(
  dir: string,
  filename: string
): ContentEntry<T> {
  const fullPath = path.join(dir, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.mdx?$/, "");
  const rt = readingTimeFn(content);

  return {
    slug,
    frontmatter: data as T,
    content,
    readingTime: {
      text: rt.text,
      minutes: Math.ceil(rt.minutes),
      words: rt.words,
    },
  };
}

function getAllEntries<T extends BaseFrontmatter>(
  type: string,
  options: { includeDrafts?: boolean } = {}
): ContentEntry<T>[] {
  const dir = getDirectory(type);
  const files = listMdxFiles(dir);
  const entries = files.map((file) => readEntry<T>(dir, file));

  const filtered = options.includeDrafts
    ? entries
    : entries.filter((entry) => !entry.frontmatter.draft);

  return filtered.sort((a, b) => {
    const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
    const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
    return dateB - dateA;
  });
}

function getEntryBySlug<T extends BaseFrontmatter>(
  type: string,
  slug: string
): ContentEntry<T> | null {
  const dir = getDirectory(type);
  const candidates = [`${slug}.mdx`, `${slug}.md`];
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(dir, candidate))) {
      return readEntry<T>(dir, candidate);
    }
  }
  return null;
}

// ---------- Blog ----------

export function getAllPosts(includeDrafts = false) {
  return getAllEntries<BlogFrontmatter>("blog", { includeDrafts });
}

export function getPostBySlug(slug: string) {
  return getEntryBySlug<BlogFrontmatter>("blog", slug);
}

export function getAllTags() {
  const posts = getAllPosts();
  const tagSet = new Map<string, number>();
  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => {
      tagSet.set(tag, (tagSet.get(tag) ?? 0) + 1);
    });
  });
  return Array.from(tagSet.entries()).map(([tag, count]) => ({ tag, count }));
}

export function getPostsByTag(tag: string) {
  return getAllPosts().filter((post) =>
    post.frontmatter.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPostBySlug(slug);
  if (!current) return [];
  const others = getAllPosts().filter((p) => p.slug !== slug);

  const scored = others.map((post) => {
    const shared =
      post.frontmatter.tags?.filter((t) =>
        current.frontmatter.tags?.includes(t)
      ).length ?? 0;
    const sameCategory =
      post.frontmatter.category === current.frontmatter.category ? 1 : 0;
    return { post, score: shared * 2 + sameCategory };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}

// ---------- Notes (digital garden) ----------

export function getAllNotes(includeDrafts = false) {
  return getAllEntries<NoteFrontmatter>("notes", { includeDrafts });
}

export function getNoteBySlug(slug: string) {
  return getEntryBySlug<NoteFrontmatter>("notes", slug);
}

// ---------- Projects ----------

export function getAllProjects(includeDrafts = false) {
  return getAllEntries<ProjectFrontmatter>("projects", { includeDrafts });
}

export function getProjectBySlug(slug: string) {
  return getEntryBySlug<ProjectFrontmatter>("projects", slug);
}

export function getFeaturedProjects() {
  return getAllProjects().filter((p) => p.frontmatter.featured);
}

// ---------- Static pages (about, now, uses, reading) ----------

export function getPage(slug: string) {
  return getEntryBySlug<BaseFrontmatter>("pages", slug);
}

// ---------- Search index (used by the command palette + search page) ----------

export interface SearchDoc {
  type: "blog" | "notes" | "projects";
  slug: string;
  title: string;
  description?: string;
  tags?: string[];
}

export function getSearchIndex(): SearchDoc[] {
  const posts = getAllPosts().map((p) => ({
    type: "blog" as const,
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    tags: p.frontmatter.tags,
  }));
  const notes = getAllNotes().map((n) => ({
    type: "notes" as const,
    slug: n.slug,
    title: n.frontmatter.title,
    description: n.frontmatter.description,
    tags: n.frontmatter.tags,
  }));
  const projects = getAllProjects().map((p) => ({
    type: "projects" as const,
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.summary ?? p.frontmatter.description,
  }));
  return [...posts, ...notes, ...projects];
}
