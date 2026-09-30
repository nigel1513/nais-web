import { mulberry32, clamp3 } from "../rng";
import type { Vec3 } from "../transform";

const W = 3.6, D = 2.4, COLS = 11, ROWS = 7; // XZ 평면 격자 (tilt로 카메라를 향하게 함)
const gx = (c: number) => -W / 2 + (c / (COLS - 1)) * W;
const gz = (r: number) => -D / 2 + (r / (ROWS - 1)) * D;

export const MESH_LABEL_ANCHORS: { text: string; p: Vec3 }[] = [
  { text: "AI-OS", p: [gx(2), 0, gz(1)] },
  { text: "GPU", p: [gx(8), 0, gz(1)] },
  { text: "MODEL", p: [gx(5), 0, gz(3)] },
  { text: "DATA", p: [gx(2), 0, gz(5)] },
  { text: "API", p: [gx(8), 0, gz(5)] },
];

/** 70%는 격자선 위, 30%는 교차점 주변 클러스터 */
export function mesh(count: number, seed = 2): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x: number, z: number, y: number;
    if (rand() < 0.7) {
      if (rand() < 0.5) { x = gx(Math.floor(rand() * COLS)); z = -D / 2 + rand() * D; }
      else { z = gz(Math.floor(rand() * ROWS)); x = -W / 2 + rand() * W; }
      y = (rand() - 0.5) * 0.02;
    } else {
      const c = Math.floor(rand() * COLS), r = Math.floor(rand() * ROWS);
      const a = rand() * Math.PI * 2, d = Math.pow(rand(), 2) * 0.09;
      x = gx(c) + Math.cos(a) * d; z = gz(r) + Math.sin(a) * d; y = (rand() - 0.5) * 0.06;
    }
    out[i * 3] = clamp3(x); out[i * 3 + 1] = clamp3(y); out[i * 3 + 2] = clamp3(z);
  }
  return out;
}
