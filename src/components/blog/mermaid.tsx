"use client";

import { useEffect, useRef, useState } from "react";

export function Mermaid({ chart }: { chart?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!ref.current) return;
      const code = chart ?? ref.current.textContent ?? "";
      if (!code.trim()) {
        setError("No chart definition was provided to <Mermaid />.");
        return;
      }
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "neutral" });

        ref.current.removeAttribute("data-processed");
        ref.current.textContent = code.trim();

        await mermaid.run({ nodes: [ref.current] });
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="text-sm text-red-600 dark:text-red-400">
        Mermaid render error: {error}
      </pre>
    );
  }

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto rounded-md border border-border bg-bg-raised p-4"
      aria-label="Diagram"
      role="img"
    >
      <div ref={ref} className="mermaid" />
    </div>
  );
}
