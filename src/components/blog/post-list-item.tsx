import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ContentEntry } from "@/lib/content-types";
import type { BlogFrontmatter } from "@/lib/content-types";
import { formatDate } from "@/lib/format-date";

export function PostListItem({ post }: { post: ContentEntry<BlogFrontmatter> }) {
  return (
    <article className="group border-b border-border py-7 first:pt-0">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl font-medium text-ink transition-colors group-hover:text-accent md:text-2xl">
            {post.frontmatter.title}
          </h2>
          <ArrowUpRight
            size={16}
            className="hidden shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent md:block"
          />
        </div>
        {post.frontmatter.description && (
          <p className="mt-2 max-w-xl text-ink-muted">
            {post.frontmatter.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-xs text-ink-faint">
          <time dateTime={post.frontmatter.date}>
            {formatDate(post.frontmatter.date)}
          </time>
          <span aria-hidden>·</span>
          <span>{post.readingTime.text}</span>
          {post.frontmatter.tags?.slice(0, 2).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </Link>
    </article>
  );
}
