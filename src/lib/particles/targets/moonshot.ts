import { mulberry32, clamp3 } from "../rng";
import type { Vec3 } from "../transform";

const RING = 2.1;
export const MOONSHOT_NODES: Vec3[] = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  return [Math.cos(a) * RING, 0, Math.sin(a) * RING];
});

/** 중앙 NAIS 코어(25%) + 얇은 궤도 링(25%) + 12개 노드 클러스터(50%). XZ 평면. */
export function moonshot(count: number, seed = 5): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const ball = (r: number): Vec3 => {
    const u = rand() * Math.PI * 2, v = Math.acos(2 * rand() - 1), d = Math.cbrt(rand()) * r;
    return [d * Math.sin(v) * Math.cos(u), d * Math.cos(v), d * Math.sin(v) * Math.sin(u)];
  };
  for (let i = 0; i < count; i++) {
    const r = rand();
    let p: Vec3;
    if (r < 0.25) p = ball(0.38);
    else if (r < 0.5) { const a = rand() * Math.PI * 2, j = (rand() - 0.5) * 0.04; p = [Math.cos(a) * (RING + j), j, Math.sin(a) * (RING + j)]; }
    else { const n = MOONSHOT_NODES[Math.floor(rand() * 12)], b = ball(0.15); p = [n[0] + b[0], n[1] + b[1], n[2] + b[2]]; }
    out[i * 3] = clamp3(p[0]); out[i * 3 + 1] = clamp3(p[1]); out[i * 3 + 2] = clamp3(p[2]);
  }
  return out;
}
