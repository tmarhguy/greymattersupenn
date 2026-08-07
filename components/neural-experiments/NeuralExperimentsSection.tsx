"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type SceneProps = {
  progress: MotionValue<number>;
  start: number;
  end: number;
  label: string;
  title: string;
  children: React.ReactNode;
};

const driftNodes = Array.from({ length: 110 }, (_, i) => ({
  left: 6 + ((i * 17.3) % 88),
  top: 8 + ((i * 29.7) % 82),
  size: i % 5 === 0 ? 15 : i % 3 === 0 ? 9 : 5,
  red: i % 2 === 0,
}));

type Point = readonly [number, number];
type SynapseConnection = readonly [Point, Point];

const SYNAPSE_CENTER: Point = [100, 50];
const SYNAPSE_INNER: Point[] = Array.from({ length: 10 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
  return [100 + Math.cos(angle) * 15, 50 + Math.sin(angle) * 15];
});
const SYNAPSE_OUTER: Point[] = Array.from({ length: 20 }, (_, i) => {
  const angle = (Math.PI * 2 * i) / 20 - Math.PI / 2 + (i % 2 ? 0.04 : -0.04);
  return [100 + Math.cos(angle) * 38, 50 + Math.sin(angle) * 38];
});
const SYNAPSE_CONNECTIONS: SynapseConnection[] = [
  ...SYNAPSE_INNER.map((point) => [SYNAPSE_CENTER, point] as const),
  ...SYNAPSE_OUTER.map((point, i) => [SYNAPSE_INNER[Math.floor(i / 2)], point] as const),
];
const SYNAPSE_NODES = [SYNAPSE_CENTER, ...SYNAPSE_INNER, ...SYNAPSE_OUTER];

function Scene({ progress, start, end, label, title, children }: SceneProps) {
  const opacity = useTransform(progress, [start, start + 0.035, end - 0.035, end], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + 0.06, end - 0.06, end], [20, 0, 0, -20]);

  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      {children}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        style={{ y }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
          {label}
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-light text-[var(--color-text-primary)] max-w-2xl">
          {title}
        </h2>
      </motion.div>
    </motion.div>
  );
}

function SynapseConnectionLine({
  connection,
  index,
  progress,
}: {
  connection: SynapseConnection;
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.69 + index * 0.006;
  const pathLength = useTransform(progress, [start, start + 0.12], [0, 1]);
  const opacity = useTransform(progress, [start, start + 0.05], [0, 0.95]);
  const [[x1, y1], [x2, y2]] = connection;

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={index % 5 === 0 ? "#f87171" : "var(--color-accent)"}
      strokeWidth={index < 10 ? 0.4 : 0.24}
      filter="url(#signal-glow)"
      style={{ pathLength, opacity }}
    />
  );
}

function SynapseNode({ node, index, progress }: { node: Point; index: number; progress: MotionValue<number> }) {
  const start = 0.7 + index * 0.005;
  const opacity = useTransform(progress, [start, start + 0.06], [0, 1]);
  const scale = useTransform(progress, [start, start + 0.06], [0, 1]);
  const [cx, cy] = node;
  const isHub = index === 0;
  const isTerminal = index > 10 && index % 4 === 0;

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={isHub ? 1.45 : isTerminal ? 0.9 : 0.58}
      fill={isTerminal ? "#f87171" : "var(--color-accent)"}
      filter="url(#signal-glow)"
      style={{ opacity, scale }}
      animate={{ opacity: [0.45, 1, 0.45], scale: [1, isHub ? 1.9 : 1.5, 1] }}
      transition={{ duration: isHub ? 1.1 : 1.6 + (index % 3) * 0.2, delay: index * 0.1, repeat: Infinity }}
    />
  );
}

function SignalWave({ progress }: { progress: MotionValue<number> }) {

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="signal-glow" x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="0.65" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {SYNAPSE_CONNECTIONS.map(([[x1, y1], [x2, y2]], i) => (
        <line key={`glow-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-accent)" strokeWidth={i < 10 ? 1.35 : 0.9} opacity="0.16" filter="url(#signal-glow)" />
      ))}
      {SYNAPSE_CONNECTIONS.map((connection, i) => (
        <SynapseConnectionLine key={`connection-${i}`} connection={connection} index={i} progress={progress} />
      ))}
      {SYNAPSE_NODES.map((node, i) => (
        <SynapseNode key={`node-${i}`} node={node} index={i} progress={progress} />
      ))}
    </svg>
  );
}

export function NeuralExperimentsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [visualReady, setVisualReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  useEffect(() => {
    setVisualReady(true);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-[340vh] bg-[var(--color-bg)]"
      aria-label="Neuroscience interaction concepts"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0, 229, 255, 0.09), transparent 72%)",
          }}
        />

        {visualReady && <Scene progress={scrollYProgress} start={0} end={0.58} label="Curiosity in motion" title="Making neuroscience accessible, one question at a time.">
          <div className="absolute inset-0" aria-hidden="true">
            {driftNodes.map((node, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${node.red ? "bg-red-400" : "bg-[var(--color-accent)]"}`}
                style={{ left: `${node.left}%`, top: `${node.top}%`, width: node.size, height: node.size }}
                animate={{ x: [0, i % 2 ? 90 : -90, 0], y: [0, i % 3 ? -55 : 55, 0], opacity: [0.25, 0.95, 0.25], scale: [1, i % 4 === 0 ? 2 : 1.45, 1] }}
                transition={{ duration: 3.2 + (i % 4) * 0.55, delay: i * 0.07, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        </Scene>}

        {visualReady && <Scene progress={scrollYProgress} start={0.68} end={1} label="Knowledge in connection" title="Every discovery begins with a shared spark.">
          <SignalWave progress={scrollYProgress} />
        </Scene>}
      </div>
    </section>
  );
}
