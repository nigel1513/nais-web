"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { HUB_LABELS, layerWeights, type Layer } from "@/lib/particles/hub";
import { currentState } from "./ParticleSystem";

const STYLE: Partial<Record<Layer, string>> = {
  hub: "font-mono text-[13px] font-semibold tracking-[0.2em] text-fg",
  hero: "font-mono text-[10px] tracking-wider text-fg/60",
  axis: "font-mono text-[11px] uppercase tracking-[0.22em] text-cyan",
  institute: "rounded bg-ink-950/80 px-1 py-px font-mono text-[10px] tracking-wide text-fg/85",
  callout: "w-[228px] rounded-md border border-cyan/30 bg-ink-950/85 px-3 py-2.5 font-mono text-[10.5px] leading-[1.7] tracking-wide text-fg/80",
  ecosystem: "rounded-full bg-ink-950/80 px-2.5 py-1 text-[12px] font-semibold text-fg ring-1 ring-cyan/40",
  moonshot: "text-[13px] font-semibold text-fg",
};
const DEFAULT = "font-mono text-[11px] tracking-wider text-cyan";
// 구 표면의 라벨은 뒤쪽으로 돌아가면 숨긴다
const SURFACE: Layer[] = ["hero", "moonshot", "autonomous"];

/** 허브 레이어 라벨을 particles 그룹 좌표계에서 화면 좌표로 투영한다. 섹션 가중치와 앞뒤 방향에 따라 투명도가 바뀐다. */
export function ProjectedLabels({ container, reducedMotion }: { container: HTMLDivElement; reducedMotion: boolean }) {
  const { camera, scene, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  const center = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    container.replaceChildren(...HUB_LABELS.map((l) => {
      const el = document.createElement("span");
      if (l.layer === "callout") {
        // 첫 단어(대덕연구개발특구)를 제목으로, 나머지 약칭을 목록으로
        const [head, ...rest] = l.text.split(" ");
        const title = document.createElement("span");
        title.className = "mb-1 block font-sans text-[12px] font-semibold tracking-normal text-fg";
        title.textContent = head;
        const grid = document.createElement("span");
        grid.className = "grid grid-cols-4 gap-x-3 gap-y-0.5";
        grid.append(...rest.filter((w) => w !== "·").map((code) => { const c = document.createElement("span"); c.textContent = code; return c; }));
        el.append(title, grid);
      } else el.textContent = l.text;
      el.className = `absolute left-0 top-0 will-change-transform ${l.layer === "callout" ? "" : "whitespace-nowrap"} ${STYLE[l.layer] ?? DEFAULT}`;
      el.style.opacity = "0";
      return el;
    }));
    return () => container.replaceChildren();
  }, [container]);

  useFrame(() => {
    const group = scene.getObjectByName("particles");
    if (!group) return;
    const w = layerWeights(currentState(reducedMotion));
    group.getWorldPosition(center);
    HUB_LABELS.forEach((l, i) => {
      const el = container.children[i] as HTMLElement | undefined;
      if (!el) return;
      let op = w[l.layer];
      if (op < 0.01) { el.style.opacity = "0"; return; }
      v.set(l.p[0], l.p[1], l.p[2]);
      group.localToWorld(v);
      if (SURFACE.includes(l.layer)) op *= THREE.MathUtils.smoothstep(v.z - center.z, -0.2, 0.5);
      v.project(camera);
      const center0 = l.layer === "hub" || l.layer === "ecosystem" || l.layer === "axis";
      const dx = l.layer === "institute" ? 6 : l.layer === "callout" ? 0 : center0 ? 18 : 12, dy = l.layer === "institute" ? 7 : l.layer === "callout" ? 0 : center0 ? 26 : 8;
      const sx = ((v.x + 1) / 2) * size.width, sy = ((1 - v.y) / 2) * size.height - dy;
      el.style.transform = l.align === "right" ? `translate(${sx - dx}px, ${sy}px) translateX(-100%)` : `translate(${sx + dx}px, ${sy}px)`;
      el.style.opacity = String(op);
    });
  });
  return null;
}
