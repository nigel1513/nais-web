import type { LineConfig } from "./states";

/** 균등 간격으로 뽑은 앵커 점들 사이를 k-최근접(maxDist 이내)으로 연결. 중복 세그먼트 제거. */
export function nearestNeighborSegments(points: Float32Array, o: LineConfig): Float32Array {
  const n = points.length / 3;
  const m = Math.min(o.anchors, n);
  if (m < 2) return new Float32Array(0);
  const stride = n / m;
  const idx = Array.from({ length: m }, (_, i) => Math.floor(i * stride));
  const seen = new Set<string>();
  const out: number[] = [];
  const p = (i: number) => [points[i * 3], points[i * 3 + 1], points[i * 3 + 2]];
  for (let a = 0; a < m; a++) {
    const pa = p(idx[a]);
    const d: [number, number][] = [];
    for (let b = 0; b < m; b++) {
      if (a === b) continue;
      const pb = p(idx[b]);
      const dist = Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]);
      if (dist <= o.maxDist) d.push([dist, b]);
    }
    d.sort((x, y) => x[0] - y[0]);
    for (const [, b] of d.slice(0, o.k)) {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(...pa, ...p(idx[b]));
    }
  }
  return new Float32Array(out);
}
