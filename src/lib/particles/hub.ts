import type { Vec3 } from "./transform";
import type { ResolvedState } from "@/lib/scroll/resolve";
import { STATES } from "./states";
import { HUB } from "./flows";
import { INSTITUTES } from "@/content/institutes";
import { MISSIONS, LOOP_STAGES } from "@/content/home";

/** NAIS 허브 구체의 의미 레이어. 모든 좌표는 particles 그룹(구 반지름 1.6)의 로컬 좌표다. */
export const NODE_R = 1.62;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

function fib(n: number, i: number, offset = 0): Vec3 {
  const y = 1 - ((i + 0.5) / n) * 2;
  const r = Math.sqrt(1 - y * y);
  const th = GOLDEN * i + offset;
  return [Math.cos(th) * r * NODE_R, y * NODE_R, Math.sin(th) * r * NODE_R];
}

export const INSTITUTE_NODES = INSTITUTES.map((ins, i) => ({ code: ins.code, p: fib(INSTITUTES.length, i) }));
// 기관 노드와 최대한 떨어지도록 고른 회전 오프셋(최소 간격 약 0.42)
export const MISSION_NODES = MISSIONS.map((m, i) => ({ name: m.name, p: fib(MISSIONS.length, i, 5.44) }));

export const SHELLS = ["AI-OS", "GPU", "MODEL", "DATA", "MARKET"].map((label, i) => ({ label, r: 0.35 + i * 0.24 }));

const LOOP_R = 1.28, LOOP_TILT = 0.45;
export function loopPoint(u: number): Vec3 {
  const a = u * Math.PI * 2 - Math.PI / 2;
  const x = Math.cos(a) * LOOP_R, z = Math.sin(a) * LOOP_R;
  return [x, -Math.sin(LOOP_TILT) * z, Math.cos(LOOP_TILT) * z];
}
export const LOOP_STATIONS = LOOP_STAGES.map((label, i) => ({ label, p: loopPoint(i / LOOP_STAGES.length) }));

export type Layer = "hub" | "hero" | "platform" | "convergence" | "autonomous" | "moonshot" | "ecosystem" | "closing";

/** 스크롤 상태에서 각 레이어의 보이는 정도(0~1). hub(코어·기관 노드·연결선)는 한반도 지도 장면에서만 사라진다. */
export function layerWeights(s: ResolvedState): Record<Layer, number> {
  const e = s.t * s.t * (3 - 2 * s.t);
  const at = (i: number) => (s.from === s.to ? (s.from === i ? 1 : 0) : (s.to === i ? e : 0) + (s.from === i ? 1 - e : 0));
  const w = Object.fromEntries(STATES.map((name, i) => [name, at(i)])) as Record<Exclude<Layer, "hub">, number>;
  return { ...w, hub: 1 - w.ecosystem };
}

const SHELL_DIR: Vec3 = [0.93, 0.28, 0.24];
export const HUB_LABELS: { text: string; p: Vec3; layer: Layer }[] = [
  { text: "NAIS", p: [0, 0, 0], layer: "hub" },
  ...INSTITUTE_NODES.map((n) => ({ text: n.code, p: n.p, layer: "hero" as const })),
  ...SHELLS.map((s) => ({ text: s.label, p: SHELL_DIR.map((v) => v * s.r) as Vec3, layer: "platform" as const })),
  { text: "Science × AI", p: [0, 0.32, 0], layer: "convergence" },
  ...LOOP_STATIONS.map((s) => ({ text: s.label, p: s.p, layer: "autonomous" as const })),
  ...MISSION_NODES.map((m) => ({ text: m.name, p: m.p, layer: "moonshot" as const })),
  { text: "NAIS", p: [HUB[0], HUB[1], 0], layer: "ecosystem" },
];
