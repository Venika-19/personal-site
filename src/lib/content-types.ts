export type ContentType = "blog" | "notes" | "projects" | "pages";

export interface BaseFrontmatter {
  title: string;
  description?: string;
  date?: string;
  updated?: string;
  draft?: boolean;
}

export interface BlogFrontmatter extends BaseFrontmatter {
  date: string;
  tags?: string[];
  category?: string;
  cover?: string;
  ogImage?: string;
}

export interface NoteFrontmatter extends BaseFrontmatter {
  date: string;
  tags?: string[];
  status?: "seedling" | "budding" | "evergreen";
}

export interface ProjectFrontmatter extends BaseFrontmatter {
  summary: string;
  stack?: string[];
  github?: string;
  demo?: string;
  timeline?: string;
  cover?: string;
  gallery?: string[];
  status?: "active" | "archived" | "concept";
  featured?: boolean;
}

export interface ContentEntry<TFrontmatter extends BaseFrontmatter> {
  slug: string;
  frontmatter: TFrontmatter;
  content: string;
  readingTime: {
    text: string;
    minutes: number;
    words: number;
  };
}
