import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { ArticlesCarousel } from "@/components/articles/ArticlesCarousel";
import articles from "@/data/articles.json";

export default function ArticlesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <section className="py-4 md:py-6 px-4 md:px-8">
          <div className="max-w-[var(--wide-max)] mx-auto mb-4">
            <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-text-primary)] mb-4">
              Articles
            </h1>
            <p className="font-body text-[var(--color-text-muted)] text-lg max-w-2xl">
              Explore our neuroscience articles from the Penn Grey Matters team.
            </p>
          </div>
          <ArticlesCarousel articles={articles} title="" showViewAll={false} compact />
        </section>
        <Footer />
      </main>
    </>
  );
}
