"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { STATES, STATE_CONFIG } from "@/lib/particles/states";
import { mulberry32 } from "@/lib/particles/rng";
import { particleStore } from "@/lib/scroll/store";
import { snapForReducedMotion } from "@/lib/scroll/resolve";
import { pointsVertex, pointsFragment } from "./shaders";

export const CYAN = new THREE.Color("#3fd0d4");
export const BLUE = new THREE.Color("#4a8dff");

export function currentState(reduced: boolean) {
  const s = particleStore.getState();
  return reduced ? snapForReducedMotion(s) : s;
}

export function ParticleSystem({ targets, reducedMotion }: { targets: Float32Array[]; reducedMotion: boolean }) {
  const count = targets[0].length / 3;
  const { gl } = useThree();
  const attrs = useMemo(() => targets.map((a) => new THREE.BufferAttribute(a, 3)), [targets]);
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
      uProgress: { value: 1 }, uTime: { value: 0 }, uPixelRatio: { value: 1 }, uSize: { value: 26 },
      uFromSpin: { value: 0 }, uToSpin: { value: 0 }, uFromTilt: { value: 0 }, uToTilt: { value: 0 },
      uBrightness: { value: 1 }, uColorA: { value: CYAN }, uColorB: { value: BLUE },
    },
  }), []);
  const cur = useRef({ from: 0, to: 0 });
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const s = currentState(reducedMotion);
    if (s.from !== cur.current.from) { geometry.setAttribute("aFrom", attrs[s.from]); cur.current.from = s.from; }
    if (s.to !== cur.current.to) { geometry.setAttribute("aTo", attrs[s.to]); cur.current.to = s.to; }
    const f = STATE_CONFIG[STATES[s.from]], t = STATE_CONFIG[STATES[s.to]];
    const u = material.uniforms;
    u.uProgress.value = s.t;
    if (!reducedMotion) u.uTime.value += dt;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uFromSpin.value = reducedMotion ? 0 : f.spin; u.uToSpin.value = reducedMotion ? 0 : t.spin;
    u.uFromTilt.value = f.tilt; u.uToTilt.value = t.tilt;
    u.uBrightness.value = THREE.MathUtils.lerp(f.brightness, t.brightness, s.t);
    if (group.current) {
      const desktop = state.size.width >= 1024;
      group.current.position.x = desktop ? THREE.MathUtils.lerp(f.offsetX, t.offsetX, s.t) : 0;
    }
  });

  return <group ref={group} name="particles"><points geometry={geometry} material={material} frustumCulled={false} /></group>;
}
