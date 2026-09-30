import { mulberry32, clamp3 } from "../rng";
import type { Vec3 } from "../transform";

const R = 1.55, TUBE = 0.1, N_STATIONS = 6;

export const LOOP_STATIONS: Vec3[] = Array.from({ length: N_STATIONS }, (_, i) => {
  const a = (i / N_STATIONS) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(a) * R, 0, Math.sin(a) * R];
});

/** XZ 평면의 원형 루프(연구 순환). 25%는 6개 스테이션 주변에 밀집. */
export function loop(count: number, seed = 4): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number;
    if (rand() < 0.25) {
      const s = LOOP_STATIONS[Math.floor(rand() * N_STATIONS)];
      const u = rand() * Math.PI * 2, v = Math.acos(2 * rand() - 1), d = Math.cbrt(rand()) * 0.16;
      x = s[0] + d * Math.sin(v) * Math.cos(u); y = d * Math.cos(v); z = s[2] + d * Math.sin(v) * Math.sin(u);
    } else {
      const a = rand() * Math.PI * 2, t = rand() * Math.PI * 2, d = TUBE * Math.sqrt(rand());
      const rr = R + Math.cos(t) * d;
      x = Math.cos(a) * rr; y = Math.sin(t) * d; z = Math.sin(a) * rr;
    }
    out[i * 3] = clamp3(x); out[i * 3 + 1] = clamp3(y); out[i * 3 + 2] = clamp3(z);
  }
  return out;
}
