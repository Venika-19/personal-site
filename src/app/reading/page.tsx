import type { Metadata } from "next";
import { SimplePage } from "@/components/layout/simple-page";

export const metadata: Metadata = {
  title: "Reading",
  description: "[Books, articles, and papers you're reading or recommend.]",
};

export default function ReadingPage() {
  return <SimplePage slug="reading" eyebrow="Library" />;
}
