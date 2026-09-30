import { mulberry32, clamp3 } from "../rng";
import { project, pointInRing, samplePerimeter } from "../geo";
import { INSTITUTES } from "@/content/institutes";
import outlineJson from "@/content/korea-outline.json";

const RINGS = (outlineJson as number[][][]).map((r) => r.map(([lon, lat]) => project(lon, lat)));
const RING_LEN = RINGS.map((r) => r.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - r[i - 1][0], p[1] - r[i - 1][1]) : 0), 0));
const TOTAL = RING_LEN.reduce((a, b) => a + b, 0);
const NODES = INSTITUTES.map((i) => project(i.lon, i.lat));
const BBOX = RINGS.flat().reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [9, 9, -9, -9]);

/** 윤곽선(55%) + 내부 채움(20%) + 기관 소재지 클러스터(25%). XY 평면. */
export function korea(count: number, seed = 6): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const pickRing = () => { let t = rand() * TOTAL; for (let k = 0; k < RINGS.length; k++) { if (t <= RING_LEN[k]) return k; t -= RING_LEN[k]; } return 0; };
  for (let i = 0; i < count; i++) {
    const r = rand();
    let x: number, y: number;
    if (r < 0.55) { [x, y] = samplePerimeter(RINGS[pickRing()], rand()); }
    else if (r < 0.75) {
      x = 0; y = 0;
      for (let tries = 0; tries < 30; tries++) {
        const cx = BBOX[0] + rand() * (BBOX[2] - BBOX[0]), cy = BBOX[1] + rand() * (BBOX[3] - BBOX[1]);
        if (RINGS.some((ring) => pointInRing(cx, cy, ring))) { x = cx; y = cy; break; }
      }
    } else {
      const n = NODES[Math.floor(rand() * NODES.length)], a = rand() * Math.PI * 2, d = Math.pow(rand(), 2) * 0.07;
      x = n[0] + Math.cos(a) * d; y = n[1] + Math.sin(a) * d;
    }
    out[i * 3] = clamp3(x); out[i * 3 + 1] = clamp3(y); out[i * 3 + 2] = clamp3((rand() - 0.5) * 0.05);
  }
  return out;
}
