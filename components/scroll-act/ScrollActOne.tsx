"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollActOne() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const opacity20 = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const opacity50 = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const opacity80 = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const bgColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgb(2, 5, 16)", "rgb(6, 3, 24)"]
  );

  return (
    <section
      ref={ref}
      id="scroll-act"
      className="relative min-h-[300vh] flex flex-col justify-center"
    >
      <motion.div
        className="sticky top-0 min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: bgColor }}
      >
        {/* Placeholder for neuron network - 3D scene will go here */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full border border-[var(--color-accent)]/20 flex items-center justify-center">
            <span className="font-mono text-sm text-[var(--color-text-muted)]">
              Network forms as you scroll
            </span>
          </div>
        </div>

        {/* Text overlays at scroll depths */}
        <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col" style={{ gap: "var(--space-3xl)" }}>
          <motion.p
            className="font-display text-[var(--color-text-primary)]"
            style={{ opacity: opacity20, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300 }}
          >
            100 billion neurons.
          </motion.p>
          <motion.p
            className="font-display text-[var(--color-text-primary)]"
            style={{ opacity: opacity50, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300 }}
          >
            Quadrillions of connections.
          </motion.p>
          <motion.p
            className="font-display text-[var(--color-text-primary)]"
            style={{ opacity: opacity80, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 300 }}
          >
            One publication dedicated to understanding them.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
