export type Article = {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: string;
  author: string;
  artist: string;
  readingTime: number;
  publishedAt: string;
  image: string;
  featured?: boolean;
};
