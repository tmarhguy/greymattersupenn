"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/nav/Navigation";
import { Preloader } from "@/components/Preloader";
import { HeroSection } from "@/components/hero/HeroSection";
import { ArticlesRow } from "@/components/articles/ArticlesRow";
import { NeuronNetworkSection } from "@/components/neuron-network/NeuronNetworkSection";
import { AboutSection } from "@/components/AboutSection";
import articles from "@/data/articles.json";
import { JoinSection } from "@/components/JoinSection";
import { Footer } from "@/components/Footer";
import { GreyMatterExplorer } from "@/components/explore/GreyMatterExplorer";
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
        <ArticlesRow articles={articles} />
        <NeuronNetworkSection />
        <AboutSection />
            {/* Grey Matter — interactive brain */}
            <section className="py-16 px-4 md:px-8 bg-[var(--color-bg)]">
              <div className="max-w-[var(--wide-max)] mx-auto">
                <div className="text-center mb-10 md:mb-12">
                  <h2 className="font-display text-2xl md:text-3xl font-light text-[var(--color-text-primary)] mb-4">
                    Explore the brain — an interactive atlas
                  </h2>
                  <p className="font-body text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl mx-auto">
                    Click and drag to rotate. Scroll to zoom. Select a region to learn more.
                  </p>
                </div>

                <GreyMatterExplorer />

                <div className="mt-10 text-center">
                  <Link
                    href="/explore"
                    className="inline-block px-8 py-3 rounded-[var(--radius-md)] border border-[var(--color-accent-violet)] text-[var(--color-accent-violet)] font-mono text-sm uppercase tracking-wider hover:bg-[var(--color-accent-violet)]/10 transition-colors"
                  >
                    Grey Matter
                  </Link>
                </div>
              </div>
            </section>
        <JoinSection />
        <Footer />
      </main>
    </>
  );
}
