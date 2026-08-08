import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "@/components/blog/code-block";
import { Mermaid } from "@/components/blog/mermaid";
import { Callout } from "@/components/blog/callout";
import { remarkWikilinks } from "@/lib/backlinks";

const prettyCodeOptions = {
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  keepBackground: false,
};

/**
 * Shared MDX component map. Anything exposed here can be used
 * directly inside an .mdx content file without an import.
 */
const mdxComponents = {
  pre: CodeBlock,
  Mermaid,
  Callout,
};

export function MDXContent({
  source,
  slugMap,
}: {
  source: string;
  slugMap?: Record<string, { url: string; title: string }>;
}) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath, remarkWikilinks(slugMap ?? {})],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: "wrap" }],
            rehypeKatex,
            [rehypePrettyCode, prettyCodeOptions],
          ],
        },
      }}
    />
  );
}

/**
 * Extracts a simple heading-based table of contents from raw MDX
 * source. Intentionally regex-based and dependency-free so it can
 * run fast at build time for every article.
 */
export interface TocItem {
  depth: number;
  text: string;
  slug: string;
}

export function extractToc(source: string): TocItem[] {
  const lines = source.split("\n");
  const toc: TocItem[] = [];
  const headingRegex = /^(#{2,3})\s+(.*)$/;

  for (const line of lines) {
    const match = headingRegex.exec(line.trim());
    if (match) {
      const depth = match[1].length;
      const text = match[2].replace(/[*_`]/g, "").trim();
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      toc.push({ depth, text, slug });
    }
  }

  return toc;
}
