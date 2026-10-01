"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { STATES, lookAt } from "@/lib/particles/states";
import { mulberry32 } from "@/lib/particles/rng";
import { particleStore } from "@/lib/scroll/store";
import { snapForReducedMotion, toPosition, fromPosition, dampPosition, type ResolvedState } from "@/lib/scroll/resolve";
import { pointsVertex, pointsFragment } from "./shaders";

export const CYAN = new THREE.Color("#3fd0d4");
export const BLUE = new THREE.Color("#4a8dff");
const ICE = new THREE.Color("#d9f4ff");
const MAP = STATES.indexOf("ecosystem");
const TAU = Math.PI * 2;

// 장면이 실제로 그리는 상태. 스크롤이 정한 상태를 매 프레임 부드럽게 따라간다(ParticleSystem이 갱신).
let shown: { p: number; s: ResolvedState } | null = null;

export function currentState(reduced: boolean) {
  const s = particleStore.getState();
  if (reduced) return snapForReducedMotion(s);
  return shown?.s ?? s;
}

function advanceShown(dt: number) {
  const target = toPosition(particleStore.getState());
  const p = shown ? dampPosition(shown.p, target, dt) : target;
  if (!shown || p !== shown.p) shown = { p, s: fromPosition(p) };
}

/** 하나의 점구름. 섹션에 따라 크기·회전·기울기·흐름·소용돌이·색조가 부드럽게 바뀐다. 자식(한반도 흐름·라벨)은 같은 변환을 따른다. */
export function ParticleSystem({ targets, reducedMotion, children }: { targets: Float32Array[]; reducedMotion: boolean; children?: React.ReactNode }) {
  const count = targets[0].length / 3;
  const { gl } = useThree();
  const attrs = useMemo(() => {
    const cache = new Map<Float32Array, THREE.BufferAttribute>();
    return targets.map((a) => { if (!cache.has(a)) cache.set(a, new THREE.BufferAttribute(a, 3)); return cache.get(a)!; });
  }, [targets]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const rand = mulberry32(99);
    const seed = new Float32Array(count);
    const scatter = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      seed[i] = rand();
      scatter[i * 3] = rand() * 2 - 1; scatter[i * 3 + 1] = rand() * 2 - 1; scatter[i * 3 + 2] = rand() * 2 - 1;
    }
    g.setAttribute("position", attrs[0]);
    g.setAttribute("aFrom", attrs[0]);
    g.setAttribute("aTo", attrs[0]);
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    return g;
  }, [attrs, count]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uProgress: { value: 1 }, uFlowTime: { value: 0 }, uSwirl: { value: 0 }, uPixelRatio: { value: 1 }, uSize: { value: 26 },
      uFlow: { value: 0 }, uBrightness: { value: 1 }, uHue: { value: 0 }, uCrisp: { value: 0 },
      uColorA: { value: CYAN }, uColorB: { value: BLUE }, uColorC: { value: ICE },
    },
  }), []);
  const cur = useRef({ from: 0, to: 0 });
  const group = useRef<THREE.Group>(null);
  const spinAngle = useRef(0);

  useEffect(() => () => { shown = null; }, []);

  // 우선순위 -1: 같은 프레임의 다른 레이어(허브·한반도·라벨)보다 먼저 상태를 갱신한다
  useFrame((_, dt) => { if (!reducedMotion) advanceShown(Math.min(dt, 0.05)); }, -1);

  useFrame((state, dt) => {
    const s = currentState(reducedMotion);
    if (s.from !== cur.current.from) { geometry.setAttribute("aFrom", attrs[s.from]); cur.current.from = s.from; }
    if (s.to !== cur.current.to) { geometry.setAttribute("aTo", attrs[s.to]); cur.current.to = s.to; }
    const look = lookAt(s.from, s.to, s.t);
    const u = material.uniforms;
    const step = reducedMotion ? 0 : Math.min(dt, 0.05);
    u.uProgress.value = s.t;
    u.uFlowTime.value += step;
    u.uSwirl.value = look.swirl;
    u.uFlow.value = reducedMotion ? 0 : look.flow;
    u.uSize.value = 26 * look.size;
    u.uBrightness.value = look.brightness;
    u.uHue.value = look.hue;
    u.uCrisp.value = look.crisp;
    u.uPixelRatio.value = gl.getPixelRatio();
    // 한반도 장면에서는 지도가 정면을 향해야 하므로, 그 장면에 가까울수록 누적 회전의 영향을 0으로 줄인다
    const e = s.t * s.t * (3 - 2 * s.t);
    const mapWeight = (s.to === MAP ? e : 0) + (s.from === MAP ? 1 - e : 0);
    spinAngle.current += step * look.spin;
    if (mapWeight === 0 && Math.abs(spinAngle.current) > Math.PI) spinAngle.current -= Math.sign(spinAngle.current) * TAU; // 한 바퀴 차이는 보이지 않는다
    const g = group.current;
    if (g) {
      g.position.x = state.size.width >= 1024 ? look.offsetX : 0;
      g.scale.setScalar(look.scale);
      g.rotation.set(look.tilt, look.yaw + spinAngle.current * (1 - Math.min(1, mapWeight)), 0);
    }
  });

  return (
    <group ref={group} name="particles">
      <points geometry={geometry} material={material} frustumCulled={false} />
      {children}
    </group>
  );
}
