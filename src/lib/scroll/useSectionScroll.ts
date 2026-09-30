"use client";
import { useEffect } from "react";
import { particleStore } from "./store";
import { resolveState, sameState } from "./resolve";

/** 섹션 i+1의 top이 뷰포트 35% 지점에 올 때 상태 i→i+1 전환이 끝나고, 그 앞 60vh가 전환 구간이다. */
export function useSectionScroll(ids: readonly string[]) {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let boundaries: number[] = [];
    let zone = 0;
    let raf = 0;

    const update = () => {
      raf = 0;
      const next = resolveState(window.scrollY, boundaries, zone);
      if (!sameState(next, particleStore.getState())) particleStore.setState(next, true);
      root.dataset.particleFrom = String(next.from);
      root.dataset.particleTo = String(next.to);
      root.dataset.motion = reduced.matches ? "reduced" : "full";
    };
    const measure = () => {
      const vh = window.innerHeight;
      zone = vh * 0.6;
      boundaries = ids.slice(1).map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY - vh * 0.35 : Number.POSITIVE_INFINITY;
      });
      update();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    reduced.addEventListener("change", update);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids]);
}
