import type { MetadataRoute } from "next";
import { getAllPosts, getAllNotes, getAllProjects } from "@/lib/content";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/blog",
    "/projects",
    "/notes",
    "/now",
    "/reading",
    "/photography",
    "/contact",
    "/colophon",
    "/search",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.frontmatter.updated ?? post.frontmatter.date,
  }));

  const noteRoutes = getAllNotes().map((note) => ({
    url: `${siteConfig.url}/notes/${note.slug}`,
    lastModified: note.frontmatter.updated ?? note.frontmatter.date,
  }));

  const projectRoutes = getAllProjects().map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: project.frontmatter.updated ?? new Date().toISOString(),
  }));

  return [...staticRoutes, ...postRoutes, ...noteRoutes, ...projectRoutes];
}
