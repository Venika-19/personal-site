import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Tag } from "@/components/ui/tag";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ScrollProgress } from "@/components/blog/scroll-progress";
import { PostListItem } from "@/components/blog/post-list-item";
import { MDXContent, extractToc } from "@/lib/mdx";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/content";
import { formatDate } from "@/lib/format-date";
import { siteConfig } from "@/lib/config";

export function generateStaticParams() {
  return getAllPosts(true).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteConfig.url}/blog/${slug}`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url,
      publishedTime: post.frontmatter.date,
      images: post.frontmatter.ogImage ? [post.frontmatter.ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.frontmatter.draft) notFound();

  const toc = extractToc(post.content);
  const related = getRelatedPosts(slug, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.updated ?? post.frontmatter.date,
    author: { "@type": "Person", name: siteConfig.name },
    url: `${siteConfig.url}/blog/${slug}`,
  };

  return (
    <>
      <ScrollProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_220px]">
        <article>
          <header className="pb-10 pt-16">
            <div className="mb-4 flex flex-wrap gap-2">
              {post.frontmatter.tags?.map((tag) => (
                <Tag key={tag} href={`/blog/tag/${tag}`}>
                  {tag}
                </Tag>
              ))}
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
              {post.frontmatter.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-ink-faint">
              <time dateTime={post.frontmatter.date}>
                {formatDate(post.frontmatter.date)}
              </time>
              <span aria-hidden>·</span>
              <span>{post.readingTime.text}</span>
            </div>
          </header>

          <div className="prose-article max-w-none pb-16">
            <MDXContent source={post.content} />
          </div>

          {related.length > 0 && (
            <section className="border-t border-border pt-10">
              <h2 className="mb-4 font-display text-lg font-semibold text-ink">
                Related posts
              </h2>
              {related.map((p) => (
                <PostListItem key={p.slug} post={p} />
              ))}
            </section>
          )}

          <p className="pt-10">
            <Link href="/blog" className="text-sm text-ink-muted hover:text-accent">
              ← Back to all posts
            </Link>
          </p>
        </article>

        <TableOfContents items={toc} />
      </Container>
    </>
  );
}
