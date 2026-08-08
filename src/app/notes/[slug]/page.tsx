import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MDXContent } from "@/lib/mdx";
import { getAllNotes, getNoteBySlug } from "@/lib/content";
import { buildBacklinkIndex, buildSlugMap } from "@/lib/backlinks";
import { formatDate } from "@/lib/format-date";

export function generateStaticParams() {
  return getAllNotes(true).map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  return { title: note.frontmatter.title, description: note.frontmatter.description };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note || note.frontmatter.draft) notFound();

  const slugMap = buildSlugMap();
  const backlinkIndex = buildBacklinkIndex();
  const backlinks = backlinkIndex[slug] ?? [];

  return (
    <Container narrow>
      <header className="pb-10 pt-16">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          {note.frontmatter.status ?? "seedling"}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {note.frontmatter.title}
        </h1>
        <time className="mt-3 block font-mono text-xs text-ink-faint">
          {formatDate(note.frontmatter.date)}
        </time>
      </header>

      <div className="prose-article max-w-none pb-16">
        <MDXContent source={note.content} slugMap={slugMap} />
      </div>

      {backlinks.length > 0 && (
        <section className="border-t border-border py-10">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
            Referenced by
          </h2>
          <ul className="space-y-2">
            {backlinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-ink-muted hover:text-accent"
                >
                  {link.title}
                  <span className="ml-2 font-mono text-xs text-ink-faint">
                    {link.type}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="pb-16">
        <Link href="/notes" className="text-sm text-ink-muted hover:text-accent">
          ← Back to notes
        </Link>
      </p>
    </Container>
  );
}
