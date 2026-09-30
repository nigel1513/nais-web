"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { STATES } from "@/lib/particles/states";
import { HUB, flowSources, buildArcs, arcPolyline, packetAttributes } from "@/lib/particles/flows";
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
  gl_PointSize = (38.0 + 46.0 * t) * uPixelRatio / -mv.z;
  vT = t;
}`;

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

  const { arcLines, packets, packetMat, core, rings } = useMemo(() => {
    const arcs = buildArcs(flowSources());
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(arcPolyline(arcs), 3));
    const arcLines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));

    const attr = packetAttributes(arcs, 5);
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(attr.p0, 3));
    pg.setAttribute("aP0", new THREE.BufferAttribute(attr.p0, 3));
    pg.setAttribute("aC", new THREE.BufferAttribute(attr.c, 3));
    pg.setAttribute("aP1", new THREE.BufferAttribute(attr.p1, 3));
    pg.setAttribute("aPhase", new THREE.BufferAttribute(attr.phase, 1));
    pg.setAttribute("aSpeed", new THREE.BufferAttribute(attr.speed, 1));
    const packetMat = new THREE.ShaderMaterial({
      vertexShader: packetVertex, fragmentShader: packetFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uColor: { value: CYAN }, uOpacity: { value: 0 } },
    });
    const packets = new THREE.Points(pg, packetMat);
    packets.frustumCulled = false;

    const core = new THREE.Mesh(new THREE.CircleGeometry(0.07, 32), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    core.position.set(HUB[0], HUB[1], 0.01);
    const rings = Array.from({ length: RINGS }, () => {
      const m = new THREE.Mesh(new THREE.RingGeometry(0.94, 1, 64), new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      m.position.set(HUB[0], HUB[1], 0.01);
      return m;
    });
    return { arcLines, packets, packetMat, core, rings };
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
    (arcLines.material as THREE.LineBasicMaterial).opacity = 0.4 * arrive;
    const beat = reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t * 3);
    (core.material as THREE.MeshBasicMaterial).opacity = (0.6 + 0.4 * beat) * arrive;
    core.scale.setScalar(1 + 0.25 * beat);
    rings.forEach((r, i) => {
      const ph = reducedMotion ? (i + 0.5) / RINGS : (t * 0.45 + i / RINGS) % 1;
      r.scale.setScalar(0.08 + ph * 0.55);
      (r.material as THREE.MeshBasicMaterial).opacity = (1 - ph) * 0.55 * arrive;
    });
  });

  return (
    <group ref={group} visible={false}>
      <primitive object={arcLines} />
      <primitive object={packets} />
      <primitive object={core} />
      {rings.map((r, i) => <primitive key={i} object={r} />)}
    </group>
  );
}
