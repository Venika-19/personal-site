import type { Metadata } from "next";
import { SimplePage } from "@/components/layout/simple-page";

export const metadata: Metadata = {
  title: "About",
  description: "[A short description of who you are, for SEO/social previews.]",
};

export default function AboutPage() {
  return <SimplePage slug="about" eyebrow="About" />;
}
