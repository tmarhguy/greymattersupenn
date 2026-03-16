"use client";

import { Suspense, useRef } from "react";
import type { Group } from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

const BRAIN_MODEL_URL = "/models/brain/scene.gltf";

// Preload for faster display
useGLTF.preload(BRAIN_MODEL_URL);

function BrainModel() {
  const { scene } = useGLTF(BRAIN_MODEL_URL);
  const groupRef = useRef<Group>(null);

  return (
    <group ref={groupRef} scale={0.6} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function BrainFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-accent)]/40 border-t-[var(--color-accent)] rounded-full animate-spin" />
    </div>
  );
}

const BRAIN_CREDIT =
  '"Human Brain" 3D model by Yash_Dandavate, licensed under CC BY 4.0. Original on Sketchfab.';

export function BrainCanvas() {
  return (
    <div className="relative w-full min-h-[400px] rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-accent)]/20 bg-[var(--color-surface)]">
      <Suspense fallback={<BrainFallback />}>
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            color="#00E5FF"
          />
          <directionalLight
            position={[-3, -2, 2]}
            intensity={0.6}
            color="#ffffff"
          />
          <BrainModel />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minDistance={1.2}
            maxDistance={5}
            autoRotate
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </Suspense>
      <div className="absolute bottom-0 left-0 right-0 pt-12 pb-2 px-2 bg-gradient-to-t from-[var(--color-surface)]/95 to-transparent pointer-events-none">
        <p className="text-center font-mono text-[10px] text-[var(--color-text-muted)]">
          {BRAIN_CREDIT}
        </p>
      </div>
    </div>
  );
}
