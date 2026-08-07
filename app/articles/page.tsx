import Image from "next/image";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import articles from "@/data/articles.json";

export default function ArticlesPage() {
  return (
    <>
      <Navigation />
      <main className="bg-[var(--color-bg)] pt-[var(--main-top-offset)]">
        <header className="px-4 pb-8 pt-4 md:px-8 md:pb-12 md:pt-8">
          <div className="mx-auto max-w-[var(--wide-max)]">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">The archive</p>
            <h1 className="mt-3 font-display text-4xl font-light text-[var(--color-text-primary)] md:text-6xl">Articles</h1>
            <p className="mt-4 max-w-2xl font-body text-lg text-[var(--color-text-muted)]">
              Scroll through the stories shaping how we understand the brain, mind, and behavior.
            </p>
          </div>
        </header>

        <section className="px-4 pb-16 md:px-8 md:pb-24" aria-label="Article archive">
          <div className="mx-auto max-w-[var(--wide-max)]">
            {articles.map((article, index) => (
              <article
                key={article.slug}
                className="sticky top-[calc(var(--main-top-offset)+1rem)] mb-8 h-[72vh] min-h-[32rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 bg-[var(--color-surface)] shadow-2xl md:mb-12 md:h-[78vh]"
                style={{ zIndex: index + 1 }}
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, min(100vw - 4rem, 1400px)"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">{article.category}</p>
                  <h2 className="mt-3 max-w-3xl font-display text-3xl font-light text-[var(--color-text-primary)] md:text-5xl">{article.title}</h2>
                  {article.subtitle && <p className="mt-3 max-w-2xl font-body text-base text-[var(--color-text-primary)]/80 md:text-lg">{article.subtitle}</p>}
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    <span>{article.author}</span>
                    <span>{article.readingTime} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
