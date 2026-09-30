"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { invalidate } from "@react-three/fiber";
import { particleCount } from "@/lib/particles/count";
import { buildAllTargets } from "@/lib/particles/targets";
import { useSectionScroll } from "@/lib/scroll/useSectionScroll";
import { particleStore } from "@/lib/scroll/store";
import { SceneBoundary } from "./SceneBoundary";

const ParticleScene = dynamic(() => import("./ParticleScene"), { ssr: false });

/** three 0.186 렌더러는 WebGL2만 지원한다. 검사용 컨텍스트는 바로 해제해 컨텍스트 한도를 쓰지 않는다. */
function hasWebGL2(): boolean {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch { return false; }
}

export function ParticleLayer({ sectionIds }: { sectionIds: readonly string[] }) {
  useSectionScroll(sectionIds);
  const [cfg, setCfg] = useState<{ targets: Float32Array[]; reduced: boolean } | null>(null);
  const [labelEl, setLabelEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!hasWebGL2()) { root.dataset.webgl = "off"; return; }
    root.dataset.webgl = "on";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = particleCount({ width: window.innerWidth, cores: navigator.hardwareConcurrency, reducedMotion: reduced });
    // 콘텐츠가 먼저 그려지도록 3D는 늦게 올린다. 데스크톱은 유휴 시점, 모바일은 첫 스크롤이나 4초 후.
    let done = false;
    const start = () => {
      if (done) return;
      done = true;
      cleanup();
      setCfg({ targets: buildAllTargets(count), reduced });
    };
    const idle = (cb: () => void) => (typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(cb, { timeout: 1500 }) : window.setTimeout(cb, 300));
    const mobile = window.innerWidth < 1024;
    const timer = window.setTimeout(() => idle(start), mobile ? 4000 : 0);
    const onScroll = () => idle(start);
    if (mobile) window.addEventListener("scroll", onScroll, { passive: true, once: true });
    const cleanup = () => { window.clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
    return () => { done = true; cleanup(); };
  }, []);

  useEffect(() => particleStore.subscribe(() => invalidate()), []);

  if (!cfg) return null;
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <SceneBoundary>
          <ParticleScene targets={cfg.targets} reducedMotion={cfg.reduced} labelContainer={labelEl} />
        </SceneBoundary>
      </div>
      <div ref={setLabelEl} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] hidden lg:block" />
    </>
  );
}
