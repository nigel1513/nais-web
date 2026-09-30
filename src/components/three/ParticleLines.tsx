"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { STATES, STATE_CONFIG } from "@/lib/particles/states";
import { nearestNeighborSegments } from "@/lib/particles/lines";
import { linesVertex, linesFragment } from "./shaders";
import { CYAN, currentState } from "./ParticleSystem";

export function ParticleLines({ targets, reducedMotion }: { targets: Float32Array[]; reducedMotion: boolean }) {
  const { scene } = useThree();
  const geos = useMemo(() => STATES.map((name, i) => {
    const cfg = STATE_CONFIG[name].lines;
    if (!cfg) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(nearestNeighborSegments(targets[i], cfg), 3));
    return g;
  }), [targets]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: linesVertex, fragmentShader: linesFragment, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uSpin: { value: 0 }, uTilt: { value: 0 }, uColor: { value: CYAN }, uOpacity: { value: 0 } },
  }), []);
  const lines = useMemo(() => new THREE.LineSegments(new THREE.BufferGeometry(), material), [material]);

  useFrame((_, dt) => {
    const s = currentState(reducedMotion);
    const geo = geos[s.to];
    const cfg = STATE_CONFIG[STATES[s.to]];
    if (!reducedMotion) material.uniforms.uTime.value += dt;
    if (!geo) { material.uniforms.uOpacity.value = 0; return; }
    if (lines.geometry !== geo) lines.geometry = geo;
    const arrive = s.from === s.to ? 1 : THREE.MathUtils.smoothstep(s.t, 0.85, 1);
    material.uniforms.uOpacity.value = 0.3 * cfg.brightness * arrive;
    material.uniforms.uSpin.value = reducedMotion ? 0 : cfg.spin;
    material.uniforms.uTilt.value = cfg.tilt;
    const particles = scene.getObjectByName("particles");
    if (particles) lines.position.copy(particles.position);
  });

  return <primitive object={lines} />;
}
