import { BlogIndex } from "@/components/blog/blog-index";
import { getAllPosts } from "@/lib/content";
import { POSTS_PER_PAGE } from "@/lib/paginate";

export function generateStaticParams() {
  const total = getAllPosts().length;
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

export default async function BlogPagePaginated({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return <BlogIndex page={Number(page) || 1} />;
}
