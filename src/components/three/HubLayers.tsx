"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { INSTITUTE_NODES, MISSION_NODES, SHELLS, LOOP_STATIONS, loopPoint, layerWeights, sweepPolar, NODE_R } from "@/lib/particles/hub";
import { currentState, CYAN } from "./ParticleSystem";
import { glowPoints } from "./glow";

const ICE = new THREE.Color("#e6f8ff");
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function lines(pairs: number[], color: THREE.Color) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pairs), 3));
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
}

const shellPoints = (r: number, n: number) => Array.from({ length: n }, (_, i) => {
  const y = 1 - ((i + 0.5) / n) * 2, k = Math.sqrt(1 - y * y), t = GOLDEN * i;
  return [Math.cos(t) * k * r, y * r, Math.sin(t) * k * r];
});

/** NAIS 허브 구체의 의미 레이어: 코어·기관 노드·연결선(항상), 플랫폼 껍질, 데이터 흐름, 연구 순환 궤도, 미션 노드(섹션별). */
export function HubLayers({ reducedMotion }: { reducedMotion: boolean }) {
  const { gl } = useThree();
  const parts = useMemo(() => {
    const core = glowPoints([[0, 0, 0]], 260, ICE);
    const halo = glowPoints([[0, 0, 0]], 900, CYAN);
    const nodes = glowPoints(INSTITUTE_NODES.map((n) => n.p), 46, ICE);
    const spokes = lines(INSTITUTE_NODES.flatMap((n) => [...n.p, 0, 0, 0]), CYAN);
    const shells = SHELLS.map((s, i) => glowPoints(shellPoints(s.r, 90 + i * 60), 20, CYAN));
    const flowCount = INSTITUTE_NODES.length * 4;
    const flow = glowPoints(Array.from({ length: flowCount }, () => [0, 0, 0]), 30, ICE);
    const ringPts: number[] = [];
    for (let i = 0; i < 128; i++) ringPts.push(...loopPoint(i / 128), ...loopPoint((i + 1) / 128));
    const ring = lines(ringPts, CYAN);
    const stations = glowPoints(LOOP_STATIONS.map((s) => s.p), 56, ICE);
    const comet = glowPoints([loopPoint(0)], 120, ICE);
    const missions = glowPoints(MISSION_NODES.map((m) => m.p), 64, ICE);
    const missionSpokes = lines(MISSION_NODES.flatMap((m) => [...m.p, ...m.p.map((v) => v * 1.18)]), ICE);
    const nodePolar = INSTITUTE_NODES.map((n) => Math.acos(n.p[1] / NODE_R));
    return { core, halo, nodes, spokes, shells, flow, flowCount, ring, stations, comet, missions, missionSpokes, nodePolar };
  }, []);

  useFrame(({ clock }) => {
    const s = currentState(reducedMotion);
    const w = layerWeights(s);
    const t = reducedMotion ? 0 : clock.elapsedTime;
    const pr = gl.getPixelRatio();
    const set = (o: THREE.Points, op: number) => {
      const u = (o.material as THREE.ShaderMaterial).uniforms;
      u.uOpacity.value = op; u.uPixelRatio.value = pr; o.visible = op > 0.005;
    };
    const setLine = (o: THREE.LineSegments, op: number) => { (o.material as THREE.LineBasicMaterial).opacity = op; o.visible = op > 0.005; };

    const beat = reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t * 2.2);
    set(parts.core, w.hub * (0.85 + 0.15 * beat));
    set(parts.halo, w.hub * 0.18 * (1 + w.closing * 0.8));
    (parts.core.material as THREE.ShaderMaterial).uniforms.uScale.value = 1 + 0.12 * beat + w.convergence * 0.35;
    set(parts.nodes, w.hub * (0.6 + 0.4 * Math.max(w.hero, w.closing, w.convergence)) * (1 - 0.6 * Math.max(w.moonshot, w.platform)));
    // 스크롤을 따라 기초(위) → 응용(아래) 순서로 기관 노드가 차례로 밝아진다
    const sweep = sweepPolar(s);
    const sizes = parts.nodes.geometry.attributes.aSize as THREE.BufferAttribute;
    parts.nodePolar.forEach((p, i) => sizes.setX(i, 40 + 70 * Math.exp(-Math.pow((p - sweep) / 0.18, 2))));
    sizes.needsUpdate = true;
    setLine(parts.spokes, w.hub * (0.12 + 0.3 * Math.max(w.hero, w.convergence, w.closing)));

    parts.shells.forEach((sh, i) => {
      set(sh, w.platform * (0.95 - i * 0.08));
      sh.rotation.y = t * (0.05 + i * 0.03) * (i % 2 ? -1 : 1);
    });

    // 기관 노드 → 코어로 흘러드는 데이터
    set(parts.flow, w.convergence);
    if (w.convergence > 0.005) {
      const pos = parts.flow.geometry.attributes.position as THREE.BufferAttribute;
      INSTITUTE_NODES.forEach((n, i) => {
        for (let k = 0; k < 4; k++) {
          const j = i * 4 + k, u = ((t * 0.28 + k / 4 + i * 0.137) % 1);
          const f = 1 - u * u;
          pos.setXYZ(j, n.p[0] * f, n.p[1] * f, n.p[2] * f);
        }
      });
      pos.needsUpdate = true;
    }

    setLine(parts.ring, w.autonomous * 0.85);
    set(parts.stations, w.autonomous);
    set(parts.comet, w.autonomous);
    const c = loopPoint((t * 0.12) % 1);
    (parts.comet.geometry.attributes.position as THREE.BufferAttribute).setXYZ(0, c[0], c[1], c[2]);
    parts.comet.geometry.attributes.position.needsUpdate = true;

    set(parts.missions, w.moonshot * (0.75 + 0.25 * beat));
    setLine(parts.missionSpokes, w.moonshot * 0.5);
  });

  return (
    <group name="hub" scale={[1, 1, 1]} userData={{ radius: NODE_R }}>
      <primitive object={parts.halo} />
      <primitive object={parts.spokes} />
      {parts.shells.map((sh, i) => <primitive key={i} object={sh} />)}
      <primitive object={parts.flow} />
      <primitive object={parts.ring} />
      <primitive object={parts.stations} />
      <primitive object={parts.comet} />
      <primitive object={parts.missionSpokes} />
      <primitive object={parts.missions} />
      <primitive object={parts.nodes} />
      <primitive object={parts.core} />
    </group>
  );
}
