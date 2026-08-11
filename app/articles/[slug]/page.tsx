import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { RelatedArticlesCarousel } from "@/components/articles/RelatedArticlesCarousel";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import articles from "@/data/articles.json";
import { articleBodies } from "@/data/article-bodies";

const sectionHeadings = new Set([
  "What is Intellectual Prime?",
  "Neurological Basis of Intelligence",
  "Psychological Basis of Intelligence",
  "Can intelligence be improved?",
]);

function ArticleBody({ slug }: { slug: string }) {
  const body = articleBodies[slug];

  if (!body) {
    return (
      <p className="text-[var(--color-text-primary)]">
        Full article content will be available soon.
      </p>
    );
  }

  const [articleText, referencesText] = body.split("\n\nZiegler P. The Black Death.");
  const blocks = articleText.split(/\n\s*\n/).slice(1);
  const references = referencesText
    ? ["Ziegler P. The Black Death." + referencesText]
        .join("")
        .split("\n")
        .filter(Boolean)
    : [];

  return (
    <>
      {blocks.map((block, index) => {
        const text = block.replace(/\s*\n\s*/g, " ").trim();
        if (!text) return null;

        if (sectionHeadings.has(text)) {
          return (
            <h2
              key={index}
              className="font-display text-3xl font-light text-[var(--color-text-primary)] mt-14 mb-5"
            >
              {text}
            </h2>
          );
        }

        return <p key={index}>{text}</p>;
      })}

      {references.length > 0 && (
        <section className="mt-16 border-t border-[var(--color-border)] pt-10" aria-labelledby="references-title">
          <h2 id="references-title" className="font-display text-3xl font-light text-[var(--color-text-primary)] mb-6">
            References
          </h2>
          <ol className="list-decimal space-y-3 pl-6 text-base">
            {references.map((reference, index) => (
              <li key={index}>{reference}</li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}

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
                <ArticleBody slug={article.slug} />
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
