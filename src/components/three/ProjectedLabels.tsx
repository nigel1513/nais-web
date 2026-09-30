"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { STATES } from "@/lib/particles/states";
import { STATE_LABELS } from "@/lib/particles/labels";
import { currentState } from "./ParticleSystem";

/** 도착한 상태(t ≥ 0.9)의 라벨을 particles 그룹 좌표계에서 화면 좌표로 투영해 표시한다. */
export function ProjectedLabels({ container, reducedMotion }: { container: HTMLDivElement; reducedMotion: boolean }) {
  const { camera, scene, size } = useThree();
  const shown = useRef<number>(-1);
  const v = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => () => { container.replaceChildren(); }, [container]);

  useFrame(() => {
    const s = currentState(reducedMotion);
    const target = s.t >= 0.9 ? s.to : -1;
    const labels = target >= 0 ? STATE_LABELS[STATES[target]] : undefined;
    if (target !== shown.current) {
      container.replaceChildren(...(labels ?? []).map((l) => {
        const el = document.createElement("span");
        el.textContent = l.text;
        el.className = "absolute left-0 top-0 whitespace-nowrap rounded bg-ink-950/75 px-1.5 py-0.5 font-mono text-[11px] tracking-wider text-cyan";
        return el;
      }));
      shown.current = target;
    }
    const group = scene.getObjectByName("particles");
    if (!labels || !group) return;
    const opacity = String(Math.min(1, (s.t - 0.9) / 0.1 + (s.from === s.to ? 1 : 0)));
    labels.forEach((l, i) => {
      v.set(l.p[0], l.p[1], l.p[2]);
      group.localToWorld(v).project(camera);
      const el = container.children[i] as HTMLElement | undefined;
      if (!el) return;
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width + 16}px, ${((1 - v.y) / 2) * size.height - 20}px)`;
      el.style.opacity = v.z < 1 ? opacity : "0";
    });
  });
  return null;
}
