import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { SearchClient } from "@/components/search-client";
import { getSearchIndex } from "@/lib/content";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  const index = getSearchIndex();

  return (
    <Container narrow>
      <PageHeader eyebrow="Find" title="Search" />
      <div className="pb-20">
        <SearchClient index={index} />
      </div>
    </Container>
  );
}
