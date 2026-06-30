import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PostListItem } from "@/components/blog/post-list-item";
import { Tag } from "@/components/ui/tag";
import { getAllPosts, getFeaturedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 4);
  const featured = getFeaturedProjects().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <Container>
        <section className="flex min-h-[60vh] flex-col justify-center pb-16 pt-24">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
            [Your Role / Title]
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-muted">
            [Your one- or two-sentence positioning statement. What you build,
            what you write about, and who it&apos;s for.]
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/about"
              className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
            >
              About me
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              View projects
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      </Container>

      {/* Recent writing */}
      <Container className="border-t border-border">
        <section className="py-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">
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
                [No posts yet — add an .mdx file to content/blog to get
                started.]
              </p>
            )}
          </div>
        </section>
      </Container>

      {/* Featured projects */}
      <Container className="border-t border-border">
        <section className="py-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">
              Featured projects
            </h2>
            <Link
              href="/projects"
              className="text-sm text-ink-muted hover:text-accent"
            >
              All projects →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.length > 0 ? (
              featured.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group rounded-md border border-border p-5 transition-colors hover:border-accent"
                >
                  <h3 className="font-display text-lg font-medium text-ink group-hover:text-accent">
                    {project.frontmatter.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-muted">
                    {project.frontmatter.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.frontmatter.stack?.slice(0, 3).map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-ink-faint">
                [No featured projects yet — set `featured: true` in a
                project&apos;s frontmatter.]
              </p>
            )}
          </div>
        </section>
      </Container>
    </>
  );
}
