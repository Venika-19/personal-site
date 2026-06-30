import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Tag } from "@/components/ui/tag";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "[An overview of things you've built, shipped, or are exploring.]",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <Container>
      <PageHeader
        eyebrow="Selected work"
        title="Projects"
        description="[A short framing sentence about how you choose what to build and share here.]"
      />

      <div className="grid gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex flex-col rounded-md border border-border p-5 transition-colors hover:border-accent"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">
                  {project.frontmatter.status ?? "active"}
                </span>
                {project.frontmatter.timeline && (
                  <span className="font-mono text-[11px] text-ink-faint">
                    {project.frontmatter.timeline}
                  </span>
                )}
              </div>
              <h2 className="font-display text-lg font-medium text-ink group-hover:text-accent">
                {project.frontmatter.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-ink-muted">
                {project.frontmatter.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.frontmatter.stack?.slice(0, 4).map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-ink-faint">
            [No projects yet. Add an .mdx file under{" "}
            <code className="font-mono">content/projects</code>.]
          </p>
        )}
      </div>
    </Container>
  );
}
