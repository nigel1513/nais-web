import { mulberry32 } from "./rng";
import { project } from "./geo";
import { INSTITUTES } from "@/content/institutes";
import { insideKorea, KOREA_BBOX } from "./targets/korea";
import type { Vec3 } from "./transform";

/** 대덕(NAIS 허브) 위치. 지도 좌표계(XY 평면, z=0). */
export const HUB: [number, number] = project(127.36, 36.38);
const SOUTH_LIMIT_Y = project(127, 38.3)[1]; // 남한 영역 위쪽 한계

export interface Arc { p0: Vec3; c: Vec3; p1: Vec3 }

/** 흐름의 출발점: 대덕 밖 출연연 + 대학·산업 거점을 나타내는 남한 내 예시 지점(결정적 난수). */
export function flowSources(extra = 44, seed = 11): [number, number][] {
  const far = (x: number, y: number, d: number) => Math.hypot(x - HUB[0], y - HUB[1]) > d;
  const out: [number, number][] = INSTITUTES.map((i) => project(i.lon, i.lat)).filter(([x, y]) => far(x, y, 0.08));
  const rand = mulberry32(seed);
  for (let tries = 0; out.length < extra + 8 && tries < 5000; tries++) {
    const x = KOREA_BBOX[0] + rand() * (KOREA_BBOX[2] - KOREA_BBOX[0]);
    const y = KOREA_BBOX[1] + rand() * (SOUTH_LIMIT_Y - KOREA_BBOX[1]);
    if (insideKorea(x, y) && far(x, y, 0.3)) out.push([x, y]);
  }
  return out;
}

/** 출발점에서 허브까지 화면 쪽(+z)으로 솟은 2차 베지어 곡선. 멀수록 높게 솟는다. */
export function buildArcs(sources: [number, number][]): Arc[] {
  return sources.map(([x, y]) => {
    const d = Math.hypot(x - HUB[0], y - HUB[1]);
    return { p0: [x, y, 0], c: [(x + HUB[0]) / 2, (y + HUB[1]) / 2, 0.25 + d * 0.6], p1: [HUB[0], HUB[1], 0] };
  });
}

export function bezier(a: Arc, t: number): Vec3 {
  const u = 1 - t;
  return [0, 1, 2].map((k) => u * u * a.p0[k] + 2 * u * t * a.c[k] + t * t * a.p1[k]) as Vec3;
}

/** LineSegments용 선분 쌍 배열 */
export function arcPolyline(arcs: Arc[], segs = 24): Float32Array {
  const out = new Float32Array(arcs.length * segs * 6);
  let o = 0;
  for (const a of arcs) {
    for (let i = 0; i < segs; i++) {
      out.set(bezier(a, i / segs), o); out.set(bezier(a, (i + 1) / segs), o + 3); o += 6;
    }
  }
  return out;
}

/** 곡선 위를 흐르는 데이터 패킷의 셰이더 속성 */
export function packetAttributes(arcs: Arc[], perArc = 5, seed = 21) {
  const n = arcs.length * perArc;
  const rand = mulberry32(seed);
  const p0 = new Float32Array(n * 3), c = new Float32Array(n * 3), p1 = new Float32Array(n * 3);
  const phase = new Float32Array(n), speed = new Float32Array(n);
  arcs.forEach((a, i) => {
    for (let k = 0; k < perArc; k++) {
      const j = i * perArc + k;
      p0.set(a.p0, j * 3); c.set(a.c, j * 3); p1.set(a.p1, j * 3);
      phase[j] = (k + rand() * 0.6) / perArc;
      speed[j] = 0.22 + rand() * 0.18;
    }
  });
  return { p0, c, p1, phase, speed };
}
