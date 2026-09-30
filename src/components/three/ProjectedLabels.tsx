"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { STATES, STATE_CONFIG } from "@/lib/particles/states";
import { STATE_LABELS } from "@/lib/particles/labels";
import { applyStateTransform } from "@/lib/particles/transform";
import { currentState } from "./ParticleSystem";

/** 도착한 상태(t ≥ 0.9)의 라벨만 표시. container는 캔버스 위 고정 div. */
export function ProjectedLabels({ container, reducedMotion }: { container: HTMLDivElement; reducedMotion: boolean }) {
  const { camera, scene, size } = useThree();
  const shown = useRef<number>(-1);
  const time = useRef(0);
  const v = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => () => { container.replaceChildren(); }, [container]);

  useFrame((_, dt) => {
    if (!reducedMotion) time.current += dt;
    const s = currentState(reducedMotion);
    const target = s.t >= 0.9 ? s.to : -1;
    const name = target >= 0 ? STATES[target] : null;
    const labels = name ? STATE_LABELS[name] : undefined;
    if (target !== shown.current) {
      container.replaceChildren(...(labels ?? []).map((l) => {
        const el = document.createElement("span");
        el.textContent = l.text;
        el.className = "absolute left-0 top-0 whitespace-nowrap rounded bg-ink-950/75 px-1.5 py-0.5 font-mono text-[11px] tracking-wider text-cyan";
        return el;
      }));
      shown.current = target;
    }
    if (!labels || !name) return;
    const cfg = STATE_CONFIG[name];
    const offset = scene.getObjectByName("particles")?.position.x ?? 0;
    const opacity = String(Math.min(1, (s.t - 0.9) / 0.1 + (s.from === s.to ? 1 : 0)));
    labels.forEach((l, i) => {
      const p = applyStateTransform(l.p, reducedMotion ? 0 : cfg.spin, cfg.tilt, time.current);
      v.set(p[0] + offset, p[1], p[2]).project(camera);
      const el = container.children[i] as HTMLElement | undefined;
      if (!el) return;
      el.style.transform = `translate(${((v.x + 1) / 2) * size.width + 16}px, ${((1 - v.y) / 2) * size.height - 20}px)`;
      el.style.opacity = v.z < 1 ? opacity : "0";
    });
  });
  return null;
}
