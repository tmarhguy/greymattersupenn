"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/nav/Navigation";
import { Preloader } from "@/components/Preloader";
import { HeroSection } from "@/components/hero/HeroSection";
import { ScrollActOne } from "@/components/scroll-act/ScrollActOne";
import { AboutSection } from "@/components/AboutSection";
import { ArticlesCarousel } from "@/components/articles/ArticlesCarousel";
import articles from "@/data/articles.json";
import { JoinSection } from "@/components/JoinSection";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function HomePage() {
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [heroExpanded, setHeroExpanded] = useState(false);

  useEffect(() => {
    // Start transition at 2.2s: fade preloader, expand hero
    const transitionTimer = setTimeout(() => {
      setPreloaderVisible(false);
      setHeroExpanded(true);
    }, 2200);
    return () => clearTimeout(transitionTimer);
  }, []);

  return (
    <>
      <Navigation />
      <main>
        <HeroSection expanded={heroExpanded} />
        <Preloader visible={preloaderVisible} />
        <ScrollActOne />
            <AboutSection />
            {/* Grey Matter CTA */}
            <section className="py-16 px-4 md:px-8 bg-[var(--color-bg)]">
              <div className="max-w-[var(--wide-max)] mx-auto text-center">
                <h2 className="font-display text-2xl md:text-3xl font-light text-[var(--color-text-primary)] mb-4">
                  Explore the brain — an interactive atlas
                </h2>
                <Link
                  href="/explore"
                  className="inline-block px-8 py-3 rounded-[var(--radius-md)] border border-[var(--color-accent-violet)] text-[var(--color-accent-violet)] font-mono text-sm uppercase tracking-wider hover:bg-[var(--color-accent-violet)]/10 transition-colors"
                >
                  Grey Matter
                </Link>
              </div>
            </section>
            <ArticlesCarousel articles={articles} />
        <JoinSection />
        <Footer />
      </main>
    </>
  );
}
