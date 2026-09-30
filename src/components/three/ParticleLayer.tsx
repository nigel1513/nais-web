"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { invalidate } from "@react-three/fiber";
import { particleCount } from "@/lib/particles/count";
import { useSectionScroll } from "@/lib/scroll/useSectionScroll";
import { particleStore } from "@/lib/scroll/store";

const ParticleScene = dynamic(() => import("./ParticleScene"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

export function ParticleLayer({ sectionIds }: { sectionIds: readonly string[] }) {
  useSectionScroll(sectionIds);
  const [cfg, setCfg] = useState<{ count: number; reduced: boolean } | null>(null);
  const [labelEl, setLabelEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!hasWebGL()) { root.dataset.webgl = "off"; return; }
    root.dataset.webgl = "on";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCfg({ count: particleCount({ width: window.innerWidth, cores: navigator.hardwareConcurrency, reducedMotion: reduced }), reduced });
  }, []);

  useEffect(() => particleStore.subscribe(() => invalidate()), []);

  if (!cfg) return null;
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <ParticleScene count={cfg.count} reducedMotion={cfg.reduced} labelContainer={labelEl} />
      </div>
      <div ref={setLabelEl} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] hidden lg:block" />
    </>
  );
}
