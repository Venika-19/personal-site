import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { GithubIcon, TwitterIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/contact-form";
import { NewsletterForm } from "@/components/newsletter-form";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "[How to reach you — email, social, or a contact form.]",
};

export default function ContactPage() {
  return (
    <Container narrow>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        description="[A line setting expectations — response time, what kinds of messages you welcome.]"
      />

      <div className="mb-10 flex flex-wrap gap-4">
        <a
          href={`mailto:${siteConfig.email}`}
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent"
        >
          <Mail size={14} /> {siteConfig.email}
        </a>
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent"
        >
          <GithubIcon /> GitHub
        </a>
        <a
          href={siteConfig.social.twitter}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent"
        >
          <TwitterIcon /> Twitter
        </a>
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent"
        >
          <LinkedinIcon /> LinkedIn
        </a>
      </div>

      <ContactForm />

      <div className="mt-16">
        <NewsletterForm />
      </div>
    </Container>
  );
}
