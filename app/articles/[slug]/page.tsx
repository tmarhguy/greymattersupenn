import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { RelatedArticlesCarousel } from "@/components/articles/RelatedArticlesCarousel";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import articles from "@/data/articles.json";

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) notFound();

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <article className="pb-16 md:pb-24">
          {/* Featured image */}
          <div className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/60 to-transparent" />
          </div>

          <div className="px-4 md:px-8 -mt-24 relative z-10">
            <div className="max-w-[var(--content-max)] mx-auto">
              <Link
                href="/articles"
                className="font-mono text-sm text-[var(--color-accent)] hover:underline mb-8 inline-block"
              >
                ← Back to Articles
              </Link>
              <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider">
                {article.category}
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-text-primary)] mt-2 mb-4">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="font-body text-[var(--color-text-muted)] text-lg mb-6">
                  {article.subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-4 font-mono text-sm text-[var(--color-text-muted)]">
                <span>By {article.author}</span>
                <span>•</span>
                <span>{article.readingTime} min read</span>
                <span>•</span>
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 mt-12">
            <div className="max-w-[var(--content-max)] mx-auto">
              <div className="font-body text-[var(--color-text-muted)] text-lg leading-relaxed prose prose-invert max-w-none">
                <p className="text-[var(--color-text-primary)]">
                  Full article content will be loaded from Sanity CMS. This article is part of the Penn Grey Matters archive.
                </p>
                <p className="mt-4 text-[var(--color-text-muted)]">
                  Visit the live site at greymattersjournalpenn.org to read the complete article, or check back soon as we migrate all content.
                </p>
              </div>
            </div>
          </div>

          <RelatedArticlesCarousel articles={articles} currentSlug={article.slug} />
        </article>
        <Footer />
      </main>
    </>
  );
}
