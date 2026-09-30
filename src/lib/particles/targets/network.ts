import { mulberry32, clamp3 } from "../rng";
import { INSTITUTE_NODES } from "../hub";

/**
 * 행성처럼 표면에 몰린 구 대신, 연구기관 노드를 중심으로 모이는 네트워크 구름.
 * 기관 노드 주변 40% · 코어로 가는 연결선 위 22% · 안쪽 부피 23% · 코어 주변 10% · 옅은 바깥 5%.
 */
export function network(count: number, seed = 7): Float32Array {
  const rand = mulberry32(seed);
  const out = new Float32Array(count * 3);
  const gauss = () => { let u = 0; for (let k = 0; k < 3; k++) u += rand(); return (u - 1.5) / 0.5; }; // 근사 정규분포
  const nodes = INSTITUTE_NODES.map((n) => n.p);
  for (let i = 0; i < count; i++) {
    const r = rand();
    let x: number, y: number, z: number;
    if (r < 0.4) {
      const n = nodes[Math.floor(rand() * nodes.length)], s = 0.1;
      x = n[0] + gauss() * s; y = n[1] + gauss() * s; z = n[2] + gauss() * s;
    } else if (r < 0.62) {
      const n = nodes[Math.floor(rand() * nodes.length)], t = Math.pow(rand(), 0.7), j = 0.035;
      x = n[0] * t + gauss() * j; y = n[1] * t + gauss() * j; z = n[2] * t + gauss() * j;
    } else if (r < 0.85) {
      const u = rand() * Math.PI * 2, v = Math.acos(2 * rand() - 1), d = 1.45 * Math.cbrt(rand());
      x = d * Math.sin(v) * Math.cos(u); y = d * Math.cos(v); z = d * Math.sin(v) * Math.sin(u);
    } else if (r < 0.95) {
      const s = 0.2; x = gauss() * s; y = gauss() * s; z = gauss() * s;
    } else {
      const u = rand() * Math.PI * 2, v = Math.acos(2 * rand() - 1), d = 1.55 + rand() * 0.35;
      x = d * Math.sin(v) * Math.cos(u); y = d * Math.cos(v); z = d * Math.sin(v) * Math.sin(u);
    }
    out[i * 3] = clamp3(x); out[i * 3 + 1] = clamp3(y); out[i * 3 + 2] = clamp3(z);
  }
  return out;
}
