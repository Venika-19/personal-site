import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MDXContent } from "@/lib/mdx";
import { getAllNotes, getNoteBySlug } from "@/lib/content";
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
        <MDXContent source={note.content} />
      </div>

      <p className="pb-16">
        <Link href="/notes" className="text-sm text-ink-muted hover:text-accent">
          ← Back to notes
        </Link>
      </p>
    </Container>
  );
}
