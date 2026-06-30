import type { Metadata } from "next";
import { SimplePage } from "@/components/layout/simple-page";

export const metadata: Metadata = {
  title: "Now",
  description: "[What you're currently focused on — updated periodically.]",
};

export default function NowPage() {
  return <SimplePage slug="now" eyebrow="Right now" />;
}
