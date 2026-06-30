import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div
      className={`mx-auto px-5 ${narrow ? "max-w-2xl" : "max-w-5xl"} ${className}`}
    >
      {children}
    </div>
  );
}
