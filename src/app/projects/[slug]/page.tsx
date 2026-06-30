import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/layout/container";
import { Tag } from "@/components/ui/tag";
import { MDXContent } from "@/lib/mdx";
import { getAllProjects, getProjectBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllProjects(true).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.frontmatter.title,
    description: project.frontmatter.summary ?? project.frontmatter.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.frontmatter.draft) notFound();

  const fm = project.frontmatter;

  return (
    <Container narrow>
      <header className="pb-10 pt-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          {fm.status ?? "active"} {fm.timeline ? `· ${fm.timeline}` : ""}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
          {fm.title}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-muted">{fm.summary}</p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {fm.stack?.map((tech) => <Tag key={tech}>{tech}</Tag>)}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {fm.github && (
            <a
              href={fm.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent"
            >
              <GithubIcon /> Source
            </a>
          )}
          {fm.demo && (
            <a
              href={fm.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent"
            >
              <ExternalLink size={14} /> Live demo
            </a>
          )}
        </div>
      </header>

      {fm.cover && (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-md border border-border">
          <Image src={fm.cover} alt={`${fm.title} cover image`} fill className="object-cover" />
        </div>
      )}

      <div className="prose-article max-w-none">
        <MDXContent source={project.content} />
      </div>

      {fm.gallery && fm.gallery.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">
            Gallery
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {fm.gallery.map((src) => (
              <div
                key={src}
                className="relative aspect-video overflow-hidden rounded-md border border-border"
              >
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="py-16">
        <Link href="/projects" className="text-sm text-ink-muted hover:text-accent">
          ← Back to all projects
        </Link>
      </p>
    </Container>
  );
}
