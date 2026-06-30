import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container narrow>
      <div className="flex min-h-[60vh] flex-col items-start justify-center">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-ink-muted">
          The page you&apos;re looking for doesn&apos;t exist, or may have moved.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
        >
          Back home
        </Link>
      </div>
    </Container>
  );
}
