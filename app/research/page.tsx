import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";

export default function ResearchPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <section className="py-4 md:py-6 px-4 md:px-8">
          <div className="max-w-[var(--wide-max)] mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-text-primary)] mb-4">
              Research Spotlight
            </h1>
            <p className="font-body text-[var(--color-text-muted)] text-lg mb-12">
              Faculty interviews, lab highlights, and graduate student profiles.
            </p>
            <div className="min-h-[300px] rounded-[var(--radius-lg)] border border-[var(--color-accent)]/20 flex items-center justify-center bg-[var(--color-surface)]">
              <p className="font-mono text-[var(--color-text-muted)] text-sm">
                Research spotlights will load from Sanity CMS
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
