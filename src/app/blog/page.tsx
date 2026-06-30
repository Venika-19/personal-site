import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/blog-index";

export const metadata: Metadata = {
  title: "Blog",
  description: "[A short description of what you write about.]",
};

export default function BlogPage() {
  return <BlogIndex page={1} />;
}
