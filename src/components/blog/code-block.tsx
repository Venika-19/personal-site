"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Mermaid } from "./mermaid";

/**
 * Overrides MDX's rendered <pre> element. rehype-pretty-code annotates
 * the <pre> with data-language; when that language is "mermaid" we
 * render the diagram instead of a syntax-highlighted code block.
 */
export function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  const isMermaid = props["data-language" as keyof typeof props] === "mermaid";

  if (isMermaid) {
    return <MermaidFromCode {...props} />;
  }

  return <HighlightedCode {...props} />;
}

function HighlightedCode(props: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  async function handleCopy() {
    const text = preRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="code-block">
      <pre {...props} ref={preRef} />
      <button
        type="button"
        onClick={handleCopy}
        className="copy-btn"
        aria-label="Copy code to clipboard"
      >
        <span className="inline-flex items-center gap-1">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
    </div>
  );
}

function MermaidFromCode(props: React.HTMLAttributes<HTMLPreElement>) {
  const sourceRef = useRef<HTMLPreElement>(null);
  const [chart, setChart] = useState<string | null>(null);

  useEffect(() => {
    setChart(sourceRef.current?.textContent ?? "");
  }, []);

  return (
    <>
      {/* Hidden — exists only so we can read the raw diagram source text. */}
      <pre {...props} ref={sourceRef} hidden />
      {chart && <Mermaid chart={chart} />}
    </>
  );
}
