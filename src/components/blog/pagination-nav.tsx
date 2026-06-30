import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaginationNav({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const prevHref = page <= 2 ? basePath : `${basePath}/page/${page - 1}`;
  const nextHref = `${basePath}/page/${page + 1}`;

  return (
    <nav
      className="mt-12 flex items-center justify-between border-t border-border pt-6"
      aria-label="Pagination"
    >
      {page > 1 ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-accent"
        >
          <ChevronLeft size={14} /> Newer
        </Link>
      ) : (
        <span />
      )}
      <p className="font-mono text-xs text-ink-faint">
        Page {page} of {totalPages}
      </p>
      {page < totalPages ? (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-accent"
        >
          Older <ChevronRight size={14} />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
