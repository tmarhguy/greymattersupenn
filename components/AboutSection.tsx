"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 50, label: "Articles Published", suffix: "+" },
  { value: 12, label: "Podcast Episodes", suffix: "+" },
  { value: 8, label: "Chapters Worldwide", suffix: "" },
];

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="py-[var(--space-3xl)] md:py-[var(--space-4xl)] px-[var(--section-padding-x)]"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-[var(--wide-max)] mx-auto">
        <div className="grid md:grid-cols-2 gap-[var(--space-3xl)] items-start">
          {/* Mission text */}
          <div className="max-w-[var(--content-max)]">
            <h2 className="font-display text-[var(--color-text-primary)] mb-[var(--space-xl)]" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300 }}>
              Purpose, Scope & Commitment
            </h2>
            <div className="font-body text-[var(--color-text-muted)] text-body-lg space-y-[var(--space-xl)]">
              <div className="space-y-[var(--space-md)]">
                <h3 className="text-label text-[var(--color-accent)]">
                  Purpose
                </h3>
                <p>
                  Grey Matters first started at the University of Washington to broaden access to neuroscience content. At the University of Pennsylvania (Penn), we have decided to embody the very purpose Grey Matters was founded.
                </p>
                <p>
                  Neuroscience is quickly becoming one of the fastest-growing fields. Grey Matters hopes to serve as a focal point for neuroscience information that should be widely accessible.
                </p>
              </div>
              <div className="space-y-[var(--space-md)]">
                <h3 className="text-label text-[var(--color-accent)]">
                  Scope
                </h3>
                <p>
                  Penn Grey Matters is not restricted to neuroscience students. Grey Matters is dedicated to being a free site that any curious individual can go to and learn more about fascinating neuroscience topics. Our team includes artists, engineers, writing students, and many others from different interdisciplinary categories.
                </p>
              </div>
              <div className="space-y-[var(--space-md)]">
                <h3 className="text-label text-[var(--color-accent)]">
                  Commitment
                </h3>
                <p>
                  We plan to write articles relating to disease, psychology studies, brain conditions, technology, emotion, reason, and more. We also provide free podcasts with Penn faculty, and we are committed to writing about animal behavior and its significance in neuroscience research.
                </p>
              </div>
            </div>
          </div>

          {/* Animated stats */}
          <div className="flex flex-col gap-[var(--space-lg)]">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className="p-[var(--space-lg)] rounded-[var(--radius-md)] border border-[var(--color-accent)]/20"
              >
                <motion.span
                  className="font-display text-[var(--color-accent)] block"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300 }}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  {stat.value}{stat.suffix}
                </motion.span>
                <span className="font-mono text-body-sm text-[var(--color-text-muted)] mt-[var(--space-xs)] block">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
