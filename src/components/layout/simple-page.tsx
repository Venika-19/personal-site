import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { MDXContent } from "@/lib/mdx";
import { getPage } from "@/lib/content";

export function SimplePage({
  slug,
  eyebrow,
}: {
  slug: string;
  eyebrow?: string;
}) {
  const page = getPage(slug);
  if (!page) notFound();

  return (
    <Container narrow>
      <PageHeader
        eyebrow={eyebrow}
        title={page.frontmatter.title}
        description={page.frontmatter.description}
      />
      <div className="prose-article max-w-none pb-20">
        <MDXContent source={page.content} />
      </div>
    </Container>
  );
}
