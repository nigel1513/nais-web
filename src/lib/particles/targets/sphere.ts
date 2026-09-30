import { mulberry32, clamp3 } from "../rng";

/** 밀도가 고르지 않은 네트워크 구. 85%는 껍질, 15%는 내부. */
export function sphere(count: number, seed = 1): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const R = 1.6;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const denom = Math.max(1, count - 1);
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / denom) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    const shell = rand() < 0.15 ? 0.25 + 0.65 * rand() : 0.93 + 0.07 * rand();
    const k = R * shell;
    out[i * 3] = clamp3(Math.cos(th) * r * k);
    out[i * 3 + 1] = clamp3(y * k);
    out[i * 3 + 2] = clamp3(Math.sin(th) * r * k);
  }
  return out;
}
