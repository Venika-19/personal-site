# Personal site — starter

A premium, minimal personal website built as a content platform: every page,
post, and project is a file. Nothing in this README contains real content —
the repo ships with realistic placeholders you replace before launch.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · MDX ·
Framer Motion · shadcn/ui-compatible primitives · Lucide icons · Vercel

> **Note on Contentlayer:** the brief asked for Content Collections or
> Contentlayer. Contentlayer is no longer maintained and breaks on current
> Next.js versions, so this repo uses a small first-party content loader
> instead (`src/lib/content.ts`) built on `gray-matter` +
> `next-mdx-remote/rsc`. It gives the same developer experience —
> add a file, get a page — without depending on an unmaintained package.

---

## Quick start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The site renders fully with the placeholder
content already in `content/` — there's nothing else required to see it
running.

To build for production:

```bash
npm run build
npm run start
```

---

## Folder structure

```
content/                   # Everything editorial. No code required to edit this.
  blog/                     # Blog posts — one .mdx file per post
  notes/                    # Digital garden notes
  projects/                 # Project case studies
  pages/                    # about.mdx, now.mdx, uses.mdx, reading.mdx

src/
  app/                      # Next.js App Router routes
    blog/[slug]/            # Blog post detail
    blog/tag/[tag]/         # Tag archive
    blog/page/[page]/       # Pagination
    projects/[slug]/        # Project detail
    notes/[slug]/           # Note detail
    about|now|uses|reading/ # MDX-backed static pages
    photography|contact|colophon/
    rss.xml/route.ts        # RSS feed
    sitemap.ts, robots.ts   # SEO
  components/               # UI components, organized by area
  lib/                      # Content loader, MDX rendering, config, helpers

public/                     # Static assets (images, photography placeholders)
```

---

## Editing content (no React required)

Every content type lives under `content/` as MDX with YAML frontmatter.

### Add a blog post

Create `content/blog/my-new-post.mdx`:

```mdx
---
title: "My new post"
description: "One sentence for previews and SEO."
date: "2026-04-01"
tags: ["engineering"]
category: "Engineering"
---

Write your post here. Headings, code blocks, inline code, lists, and
images all work. Use a fenced mermaid code block for diagrams, and
inline or block math syntax for equations.
```

It will automatically appear on `/blog`, get its own page at
`/blog/my-new-post`, show up in tag pages, RSS, the sitemap, and the
command palette / search index. Nothing else needs to change.

Set `draft: true` in frontmatter to keep a post out of all listings.

### Add a note (digital garden)

Same idea, under `content/notes/`. Use `status: seedling | budding |
evergreen` to signal how developed the idea is.

### Add a project

Under `content/projects/`, with richer frontmatter:

```yaml
title: "Project name"
summary: "One sentence shown in project cards."
stack: ["TypeScript", "Next.js"]
github: "https://github.com/you/repo"
demo: "https://example.com"
timeline: "Jan 2026 - Mar 2026"
status: "active" # active | archived | concept
featured: true # shows on the home page
cover: "/path/to/cover.jpg"
gallery: ["/path/to/1.jpg", "/path/to/2.jpg"]
```

The MDX body can include normal prose plus a Mermaid diagram for
architecture, exactly like blog posts.

### Edit the static pages (About, Now, Uses, Reading)

These live in `content/pages/*.mdx` and are plain MDX with `title` and
`description` frontmatter — no special fields.

### Site-wide settings

`src/lib/config.ts` holds your name, social links, nav items, footer links,
and the newsletter/analytics toggles. It's the one file you'll touch even
though it's "code" — it's plain data, no JSX.

---

## Features

- **MDX pipeline:** syntax highlighting (Shiki via `rehype-pretty-code`),
  Mermaid diagrams (fenced mermaid code blocks), math (`remark-math` /
  `rehype-katex`), auto-linked heading anchors, a `Callout` component, and
  a copy button on every code block.
- **Blog:** tags, categories, reading time, pagination, related posts
  (by shared tags/category), table of contents, RSS feed, JSON-LD
  structured data, canonical URLs.
- **Projects:** rich frontmatter (stack, links, timeline, gallery, status),
  rendered as case studies with architecture diagrams.
- **Notes:** a lightweight digital garden with a status taxonomy.
- **Search:** a `/search` page and a global command palette (Cmd/Ctrl+K,
  built on `cmdk` + `Fuse.js`) covering posts, notes, and projects.
- **Theming:** light/dark/system via `next-themes`, persisted, with a
  visible focus ring and `prefers-reduced-motion` support throughout.
- **SEO:** per-page metadata, OpenGraph + Twitter cards, `sitemap.xml`,
  `robots.txt`, RSS, canonical URLs, BlogPosting structured data.
- **Performance:** static generation for all content routes, optimized
  fonts via `next/font`, optimized images via `next/image`.

---

## Design system

Tokens live as CSS variables in `src/app/globals.css` (`:root` / `.dark`),
mapped into Tailwind via `@theme inline`. Summary:

- **Palette:** warm paper background, near-black ink, a single restrained
  burnt-amber accent (`--color-accent`) used only for interactive/active
  states — never decoratively.
- **Type:** Fraunces (display headings), Source Serif 4 (long-form body
  copy in articles), Inter Tight (UI chrome — nav, buttons, labels),
  JetBrains Mono (code, metadata, eyebrows).
- **Structural device:** a recurring hairline rule (`.rule`) and small
  monospace "eyebrow" labels are the main structural signature, rather
  than numbered steps or card-heavy layouts.

Change the palette or type pairing by editing the CSS variables — nothing
else in the codebase hardcodes colors or fonts.

---

## Wiring up the bonus features

A few features are stubbed with clear placeholders so they compile without
external accounts, but need a real endpoint before they do anything:

- **Newsletter** (`src/components/newsletter-form.tsx`) — posts to
  `siteConfig.newsletter.action` in `src/lib/config.ts`. Point it at
  Buttondown, ConvertKit, Resend, or your own API route.
- **Contact form** (`src/components/contact-form.tsx`) — currently
  simulates a network request. Replace the `handleSubmit` body with a call
  to a real API route or a form service (Formspree, Resend, etc.).
- **Analytics** (`siteConfig.analytics` in `src/lib/config.ts`) — a
  config stub for Plausible/Vercel Analytics/PostHog. Add the relevant
  script/provider in `src/app/layout.tsx` once you've picked one and set
  `enabled: true`.

See `.env.example` for the environment variables these expect once wired
up.

---

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel (vercel.com/new) — it auto-detects Next.js, no
   config needed.
3. Set `siteConfig.url` in `src/lib/config.ts` to your production domain
   (used for canonical URLs, sitemap, RSS, and OpenGraph).
4. Deploy. Every push to `main` redeploys automatically.

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs lint, type
checking, and a production build on every push and pull request, so
broken content or code is caught before it reaches Vercel.

---

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build (also used by CI/Vercel)
npm run start    # run the production build locally
npm run lint     # ESLint
npx tsc --noEmit # type check only
```
