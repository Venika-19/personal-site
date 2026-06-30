import Link from "next/link";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { PostListItem } from "@/components/blog/post-list-item";
import { PaginationNav } from "@/components/blog/pagination-nav";
import { Tag } from "@/components/ui/tag";
import { getAllPosts, getAllTags } from "@/lib/content";
import { paginate } from "@/lib/paginate";

export function BlogIndex({ page }: { page: number }) {
  const posts = getAllPosts();
  const tags = getAllTags();
  const { pageItems, totalPages, page: safePage } = paginate(posts, page);

  return (
    <Container narrow>
      <PageHeader
        eyebrow="Writing"
        title="Blog"
        description="[A short description of what you write about — themes, cadence, intent.]"
      />

      {tags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Tag key={tag} href={`/blog/tag/${tag}`}>
              {tag} ({count})
            </Tag>
          ))}
        </div>
      )}

      <div>
        {pageItems.length > 0 ? (
          pageItems.map((post) => <PostListItem key={post.slug} post={post} />)
        ) : (
          <p className="py-10 text-ink-faint">
            [No posts yet. Add an .mdx file under{" "}
            <code className="font-mono">content/blog</code> with frontmatter
            like <code className="font-mono">title</code>,{" "}
            <code className="font-mono">date</code>, and{" "}
            <code className="font-mono">description</code>.]
          </p>
        )}
      </div>

      <PaginationNav page={safePage} totalPages={totalPages} basePath="/blog" />

      <p className="mt-10 text-sm text-ink-faint">
        Subscribe via <Link href="/rss.xml" className="underline">RSS</Link>.
      </p>
    </Container>
  );
}
