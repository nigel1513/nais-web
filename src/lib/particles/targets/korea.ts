import { mulberry32, clamp3 } from "../rng";
import { project, pointInRing, samplePerimeter } from "../geo";
import { INSTITUTES } from "@/content/institutes";
import outlineJson from "@/content/korea-outline.json";

type Ring = [number, number][];
const RINGS = (outlineJson as { country: string; points: number[][] }[]).map((r) => ({
  country: r.country,
  pts: r.points.map(([lon, lat]) => project(lon, lat)) as Ring,
}));
export const SOUTH_RINGS = RINGS.filter((r) => r.country === "KOR").map((r) => r.pts);
export const NORTH_RINGS = RINGS.filter((r) => r.country === "PRK").map((r) => r.pts);

export const insideSouth = (x: number, y: number) => SOUTH_RINGS.some((ring) => pointInRing(x, y, ring));
export const insideNorth = (x: number, y: number) => NORTH_RINGS.some((ring) => pointInRing(x, y, ring));

const bbox = (rings: Ring[]) => rings.flat().reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [9, 9, -9, -9]);
export const KOREA_BBOX = bbox([...SOUTH_RINGS, ...NORTH_RINGS]);
const SOUTH_BBOX = bbox(SOUTH_RINGS);

/** 도트 매트릭스 간격(월드 단위). 입자 수와 무관하게 같은 격자를 쓰고, 남는 입자는 격자 점 위에 겹쳐 밝기를 채운다. */
export const DOT_SPACING = 0.034;

let gridCache: [number, number][] | null = null;
/** 남한 내부를 채우는 육각 격자(행마다 반 칸씩 어긋남) */
export function koreaDotGrid(): [number, number][] {
  if (gridCache) return gridCache;
  const out: [number, number][] = [];
  const dy = DOT_SPACING * Math.sqrt(3) / 2;
  for (let row = 0, y = SOUTH_BBOX[1]; y <= SOUTH_BBOX[3]; row++, y += dy) {
    for (let x = SOUTH_BBOX[0] + (row % 2 ? DOT_SPACING / 2 : 0); x <= SOUTH_BBOX[2]; x += DOT_SPACING) {
      if (insideSouth(x, y)) out.push([x, y]);
    }
  }
  return (gridCache = out);
}

const perimeter = (rings: Ring[]) => rings.map((r) => r.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - r[i - 1][0], p[1] - r[i - 1][1]) : 0), 0));
const SOUTH_LEN = perimeter(SOUTH_RINGS), NORTH_LEN = perimeter(NORTH_RINGS);
const NODES = INSTITUTES.map((i) => project(i.lon, i.lat));

function pickRing(lens: number[], u: number) {
  let t = u * lens.reduce((a, b) => a + b, 0);
  for (let k = 0; k < lens.length; k++) { if (t <= lens[k]) return k; t -= lens[k]; }
  return 0;
}

/** 남한 도트 격자(74%) + 남한 해안선(17%) + 북한 윤곽(2%) + 기관 소재지 작은 점(7%). XY 평면. */
export function korea(count: number, seed = 6): Float32Array {
  const rand = mulberry32(seed);
  const grid = koreaDotGrid();
  const out = new Float32Array(count * 3);
  let g = 0;
  for (let i = 0; i < count; i++) {
    const r = rand();
    let x: number, y: number;
    if (r < 0.74) { [x, y] = grid[g++ % grid.length]; }
    else if (r < 0.91) { [x, y] = samplePerimeter(SOUTH_RINGS[pickRing(SOUTH_LEN, rand())], rand()); }
    else if (r < 0.93) { [x, y] = samplePerimeter(NORTH_RINGS[pickRing(NORTH_LEN, rand())], rand()); }
    else {
      const n = NODES[Math.floor(rand() * NODES.length)], a = rand() * Math.PI * 2, d = rand() * 0.018;
      x = n[0] + Math.cos(a) * d; y = n[1] + Math.sin(a) * d;
    }
    out[i * 3] = clamp3(x); out[i * 3 + 1] = clamp3(y); out[i * 3 + 2] = 0;
  }
  return out;
}
