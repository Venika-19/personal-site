import type { Metadata } from "next";
import { SimplePage } from "@/components/layout/simple-page";

export const metadata: Metadata = {
  title: "Uses",
  description: "[The hardware, software, and tools you use day to day.]",
};

export default function UsesPage() {
  return <SimplePage slug="uses" eyebrow="Setup" />;
}
