"use client";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { buildAllTargets } from "@/lib/particles/targets";
import { ParticleSystem } from "./ParticleSystem";
import { ParticleLines } from "./ParticleLines";
import { ProjectedLabels } from "./ProjectedLabels";

export default function ParticleScene({ count, reducedMotion, labelContainer }: { count: number; reducedMotion: boolean; labelContainer: HTMLDivElement | null }) {
  const targets = useMemo(() => buildAllTargets(count), [count]);
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <ParticleSystem targets={targets} reducedMotion={reducedMotion} />
      <ParticleLines targets={targets} reducedMotion={reducedMotion} />
      {labelContainer && <ProjectedLabels container={labelContainer} reducedMotion={reducedMotion} />}
    </Canvas>
  );
}
