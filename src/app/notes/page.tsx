import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getAllNotes } from "@/lib/content";
import { formatDate } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Notes",
  description: "[A digital garden of evolving, informal notes and ideas.]",
};

const statusColor: Record<string, string> = {
  seedling: "bg-yellow-500",
  budding: "bg-orange-500",
  evergreen: "bg-green-600",
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <Container narrow>
      <PageHeader
        eyebrow="Digital garden"
        title="Notes"
        description="[Looser, evolving notes — not polished essays. Each one is tagged with how 'finished' it is.]"
      />

      <ul className="space-y-1">
        {notes.length > 0 ? (
          notes.map((note) => (
            <li key={note.slug} className="border-b border-border py-4">
              <Link
                href={`/notes/${note.slug}`}
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      statusColor[note.frontmatter.status ?? "seedling"]
                    }`}
                    aria-hidden
                  />
                  <span className="font-display text-lg text-ink group-hover:text-accent">
                    {note.frontmatter.title}
                  </span>
                </span>
                <time className="font-mono text-xs text-ink-faint">
                  {formatDate(note.frontmatter.date)}
                </time>
              </Link>
            </li>
          ))
        ) : (
          <p className="py-10 text-ink-faint">
            [No notes yet. Add an .mdx file under{" "}
            <code className="font-mono">content/notes</code>.]
          </p>
        )}
      </ul>
    </Container>
  );
}
