"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { STATES } from "@/lib/particles/states";
import { HUB, flowSources, buildArcs, arcPolyline, packetAttributes } from "@/lib/particles/flows";
import { SOUTH_RINGS, NORTH_RINGS } from "@/lib/particles/targets/korea";
import { MAP_MARKERS, CALLOUT } from "@/lib/particles/markers";
import { glowPoints } from "./glow";
import { BLUE, CYAN, currentState } from "./ParticleSystem";

const KOREA = STATES.indexOf("ecosystem");
const RINGS = 3;

const packetVertex = /* glsl */ `
uniform float uTime, uPixelRatio;
attribute vec3 aP0; attribute vec3 aC; attribute vec3 aP1; attribute float aPhase; attribute float aSpeed;
varying float vT;
void main(){
  float t = fract(uTime * aSpeed + aPhase);
  float u = 1.0 - t;
  vec3 p = u * u * aP0 + 2.0 * u * t * aC + t * t * aP1;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (28.0 + 30.0 * t) * uPixelRatio / -mv.z;
  vT = t;
}`;

const arcVertex = /* glsl */ `
attribute float aT;
varying float vT;
void main(){ vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const arcFragment = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity;
varying float vT;
void main(){ gl_FragColor = vec4(uColor, uOpacity * (0.08 + 0.92 * vT * vT)); }`;

const ringLines = (rings: [number, number][][]) => {
  const pts: number[] = [];
  for (const r of rings) for (let i = 1; i < r.length; i++) pts.push(r[i - 1][0], r[i - 1][1], 0.002, r[i][0], r[i][1], 0.002);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
};

const packetFragment = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity;
varying float vT;
void main(){
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.0, r) * smoothstep(0.0, 0.08, vT) * (1.0 - smoothstep(0.93, 1.0, vT));
  gl_FragColor = vec4(uColor, a * uOpacity);
}`;

/** particles 그룹의 자식으로 같은 변환을 따른다. 한반도 상태에서 각 연구 거점의 데이터가 대덕 NAIS 허브로 모여드는 흐름(곡선·패킷·허브 파동). */
export function KoreaFlows({ reducedMotion }: { reducedMotion: boolean }) {
  const { gl } = useThree();
  const group = useRef<THREE.Group>(null);
  const time = useRef(0);

  const { arcLines, southLines, northLines, markers, fan, packets, packetMat, core, rings } = useMemo(() => {
    const arcs = buildArcs(flowSources());
    const lineGeo = new THREE.BufferGeometry();
    const segs = 24;
    lineGeo.setAttribute("position", new THREE.BufferAttribute(arcPolyline(arcs, segs), 3));
    // 선분 양 끝점의 곡선 위 위치(0=출발, 1=허브)로 밝기를 점점 올린다
    const aT = new Float32Array(arcs.length * segs * 2);
    for (let a = 0; a < arcs.length; a++) for (let i = 0; i < segs; i++) { aT[(a * segs + i) * 2] = i / segs; aT[(a * segs + i) * 2 + 1] = (i + 1) / segs; }
    lineGeo.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
    const arcLines = new THREE.LineSegments(lineGeo, new THREE.ShaderMaterial({
      vertexShader: arcVertex, fragmentShader: arcFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: BLUE }, uOpacity: { value: 0 } },
    }));
    // 25개 기관 마커(실제 소재지)
    const markers = glowPoints(MAP_MARKERS.map((m) => [m.p[0], m.p[1], 0.004]), 46, new THREE.Color("#e6f8ff"));
    // 대덕 허브 → 대덕연구개발특구 설명 상자로 이어지는 지시선
    const fanPts: number[] = [HUB[0], HUB[1], 0.003, CALLOUT[0], CALLOUT[1], 0.003];
    const fanGeo = new THREE.BufferGeometry();
    fanGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(fanPts), 3));
    const fan = new THREE.LineSegments(fanGeo, new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    const southLines = ringLines(SOUTH_RINGS);
    const northLines = ringLines(NORTH_RINGS);

    const attr = packetAttributes(arcs, 7);
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(attr.p0, 3));
    pg.setAttribute("aP0", new THREE.BufferAttribute(attr.p0, 3));
    pg.setAttribute("aC", new THREE.BufferAttribute(attr.c, 3));
    pg.setAttribute("aP1", new THREE.BufferAttribute(attr.p1, 3));
    pg.setAttribute("aPhase", new THREE.BufferAttribute(attr.phase, 1));
    pg.setAttribute("aSpeed", new THREE.BufferAttribute(attr.speed, 1));
    const packetMat = new THREE.ShaderMaterial({
      vertexShader: packetVertex, fragmentShader: packetFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uColor: { value: new THREE.Color("#e6f8ff") }, uOpacity: { value: 0 } },
    });
    const packets = new THREE.Points(pg, packetMat);
    packets.frustumCulled = false;

    const core = new THREE.Mesh(new THREE.CircleGeometry(0.03, 32), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    core.position.set(HUB[0], HUB[1], 0.01);
    const rings = Array.from({ length: RINGS }, () => {
      const m = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 96), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      m.position.set(HUB[0], HUB[1], 0.01);
      return m;
    });
    return { arcLines, southLines, northLines, markers, fan, packets, packetMat, core, rings };
  }, []);

  useFrame((_, dt) => {
    const s = currentState(reducedMotion);
    const arrive = s.to === KOREA
      ? (s.from === s.to ? 1 : THREE.MathUtils.smoothstep(s.t, 0.8, 1))
      : s.from === KOREA ? 1 - THREE.MathUtils.smoothstep(s.t, 0, 0.2) : 0;
    const g = group.current;
    if (!g) return;
    g.visible = arrive > 0.001;
    if (!g.visible) return;
    if (!reducedMotion) time.current += dt;
    const t = time.current;

    packetMat.uniforms.uTime.value = t;
    packetMat.uniforms.uPixelRatio.value = gl.getPixelRatio();
    packetMat.uniforms.uOpacity.value = arrive;
    (arcLines.material as THREE.ShaderMaterial).uniforms.uOpacity.value = 0.95 * arrive;
    (southLines.material as THREE.LineBasicMaterial).opacity = 0.7 * arrive;
    (northLines.material as THREE.LineBasicMaterial).opacity = 0.1 * arrive;
    (fan.material as THREE.LineBasicMaterial).opacity = 0.5 * arrive;
    const mu = (markers.material as THREE.ShaderMaterial).uniforms;
    mu.uOpacity.value = arrive; mu.uPixelRatio.value = gl.getPixelRatio();
    const beat = reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t * 3);
    (core.material as THREE.MeshBasicMaterial).opacity = (0.6 + 0.4 * beat) * arrive;
    core.scale.setScalar(1 + 0.3 * beat);
    rings.forEach((r, i) => {
      const ph = reducedMotion ? (i + 0.5) / RINGS : (t * 0.45 + i / RINGS) % 1;
      r.scale.setScalar(0.05 + ph * 0.42);
      (r.material as THREE.MeshBasicMaterial).opacity = (1 - ph) * 0.55 * arrive;
    });
  });

  return (
    <group ref={group} visible={false}>
      <primitive object={northLines} />
      <primitive object={southLines} />
      <primitive object={arcLines} />
      <primitive object={fan} />
      <primitive object={markers} />
      <primitive object={packets} />
      <primitive object={core} />
      {rings.map((r, i) => <primitive key={i} object={r} />)}
    </group>
  );
}
