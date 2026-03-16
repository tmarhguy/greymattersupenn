"use client";

import { useState } from "react";
import { Navigation } from "@/components/nav/Navigation";
import { Footer } from "@/components/Footer";
import { BrainCanvas } from "@/components/explore/BrainCanvas";
import brainRegions from "@/data/brain-regions.json";

type BrainRegion = (typeof brainRegions)[number];

export default function ExplorePage() {
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null);

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-[var(--main-top-offset)]">
        <section className="py-4 md:py-6 px-4 md:px-8">
          <div className="max-w-[var(--wide-max)] mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-light text-[var(--color-text-primary)] mb-4">
              Grey Matter
            </h1>
            <p className="font-body text-[var(--color-text-muted)] text-lg mb-12 max-w-2xl">
              An interactive brain explorer. Click on a region to learn about its functions, related conditions, and surprising facts.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <BrainCanvas />

              {/* Info panel */}
              <div className="space-y-6">
                <h2 className="font-mono text-sm uppercase tracking-wider text-[var(--color-accent)]">
                  Brain Regions
                </h2>
                <div className="space-y-3">
                  {brainRegions.map((region) => (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => setSelectedRegion(region)}
                      className={`w-full text-left p-4 rounded-[var(--radius-md)] border transition-colors ${
                        selectedRegion?.id === region.id
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                          : "border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40"
                      }`}
                    >
                      <span className="font-display text-lg text-[var(--color-text-primary)]">
                        {region.displayName}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedRegion && (
                  <div className="p-6 rounded-[var(--radius-md)] border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
                    <h3 className="font-display text-xl text-[var(--color-text-primary)] mb-4">
                      {selectedRegion.displayName}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-mono text-xs uppercase text-[var(--color-accent)] mb-2">
                          Functions
                        </h4>
                        <ul className="text-[var(--color-text-muted)] text-sm">
                          {selectedRegion.functions.map((f) => (
                            <li key={f}>• {f}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-mono text-xs uppercase text-[var(--color-accent)] mb-2">
                          Did you know?
                        </h4>
                        <p className="text-[var(--color-text-primary)] italic">
                          {selectedRegion.fact}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
