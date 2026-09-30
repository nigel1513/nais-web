import { mulberry32, clamp3 } from "../rng";
import type { Vec3 } from "../transform";

export const CONVERGENCE_LABELS: { text: string; p: Vec3 }[] = [
  { text: "Materials", p: [-1.8, 0.18, 0] },
  { text: "Biology", p: [1.75, 0.3, 0] },
  { text: "Energy", p: [0.25, 1.95, 0] },
  { text: "AI", p: [0.18, -1.95, 0] },
  { text: "Science × AI", p: [0, 0.62, 0] },
];

/** 네 방향 흐름(각 15%)이 중앙의 정렬 격자 블록(40%)으로 모인다. XY 평면. */
export function convergence(count: number, seed = 3): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const B = 0.45;
  for (let i = 0; i < count; i++) {
    const r = rand();
    let x: number, y: number, z = (rand() - 0.5) * 0.08;
    const u = rand(); // 흐름 위치 0(바깥)~1(중앙)
    if (r < 0.15) { x = -1.85 + u * 1.4; y = (rand() - 0.5) * 0.05; }                                   // 왼쪽: 점열
    else if (r < 0.3) { x = 1.85 - u * 1.4; y = Math.sin(u * 14) * 0.18 * (1 - u); }                   // 오른쪽: 사인파
    else if (r < 0.45) { y = 2.05 - u * 1.55; x = ((Math.floor(u * 12) % 2 ? 1 : -1) * ((u * 12) % 1) - 0.5) * 0.25 * (1 - u); } // 위: 지그재그
    else if (r < 0.6) { y = -2.05 + u * 1.55; x = (rand() - 0.5) * 0.3 * (1 - u); }                      // 아래: 미세 점
    else {
      const n = 9, gx = Math.floor(rand() * n), gy = Math.floor(rand() * n);
      x = -B + (gx / (n - 1)) * 2 * B + (rand() - 0.5) * 0.03;
      y = -B + (gy / (n - 1)) * 2 * B + (rand() - 0.5) * 0.03;
      z = (rand() - 0.5) * 0.3;
    }
    out[i * 3] = clamp3(x); out[i * 3 + 1] = clamp3(y); out[i * 3 + 2] = clamp3(z);
  }
  return out;
}
