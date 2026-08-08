import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PostListItem } from "@/components/blog/post-list-item";
import { getAllPosts, getHomePage } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4);
  const home = getHomePage();

  return (
    <>
      {/* Hero */}
      <Container>
        <section className="flex min-h-[60vh] flex-col justify-center pb-16 pt-24">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
            {home?.frontmatter.role ?? "[Your Role / Title]"}
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted">
            {home?.frontmatter.tagline ?? "[Your one- or two-sentence intro.]"}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/about"
              className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
            >
              About me
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Read the blog
            </Link>
          </div>
        </section>
      </Container>

      {/* Recent writing */}
      <div className="bg-bg-tint">
        <Container>
          <section className="py-16">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Recent writing
              </h2>
              <Link
                href="/blog"
                className="text-sm text-ink-muted hover:text-accent"
              >
                All posts →
              </Link>
            </div>
            <div>
              {posts.length > 0 ? (
                posts.map((post) => <PostListItem key={post.slug} post={post} />)
              ) : (
                <p className="border-b border-border py-7 text-ink-faint">
                  No posts yet — check back soon.
                </p>
              )}
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
