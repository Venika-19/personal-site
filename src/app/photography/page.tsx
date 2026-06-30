import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Photography",
  description: "[An album of photography or other visual work.]",
};

// Replace with real images placed under /public/photography.
// Each entry needs a src, alt, and optional caption.
const placeholderAlbum = Array.from({ length: 6 }).map((_, i) => ({
  src: `/photography/placeholder-${(i % 3) + 1}.svg`,
  alt: `[Photography Album] — image ${i + 1}`,
  caption: `[Caption for image ${i + 1}]`,
}));

export default function PhotographyPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Visual"
        title="Photography"
        description="[A line about what kind of photography you shoot — street, travel, film, etc.]"
      />
      <div className="grid grid-cols-2 gap-3 pb-20 md:grid-cols-3">
        {placeholderAlbum.map((photo, i) => (
          <figure
            key={i}
            className="group relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-bg-raised"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/70 to-transparent p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  );
}
