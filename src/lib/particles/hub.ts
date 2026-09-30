import type { Vec3 } from "./transform";
import type { ResolvedState } from "@/lib/scroll/resolve";
import { STATES } from "./states";
import { HUB } from "./flows";
import { INSTITUTES, type Field } from "@/content/institutes";
import { MISSIONS, LOOP_STAGES } from "@/content/home";

/** NAIS 허브 구체의 의미 레이어. 모든 좌표는 particles 그룹(구 반지름 1.6)의 로컬 좌표다. */
export const NODE_R = 1.62;
const TAU = Math.PI * 2;

/** 경도 = 연구 분야. 6개 분야가 구를 60°씩 나눠 가진다. */
export const DOMAINS: { id: Field; label: string; center: number }[] = [
  { id: "physics", label: "Physics & Space" },
  { id: "chemistry", label: "Chemistry & Materials" },
  { id: "life", label: "Life & Food" },
  { id: "earth", label: "Energy & Earth" },
  { id: "ict", label: "ICT & Data" },
  { id: "engineering", label: "Engineering & Industry" },
].map((d, i) => ({ ...d, id: d.id as Field, center: (i / 6) * TAU }));

/** 위도 = 기초(0, 북쪽) → 응용(1, 남쪽). 극에 너무 붙지 않도록 25°~155° 극각을 쓴다. */
export function onSphereAt(polar: number, lon: number, r = NODE_R): Vec3 { return onSphere(polar, lon, r); }

export const spectrumPolar = (s: number) => ((25 + s * 130) * Math.PI) / 180;

function onSphere(polar: number, lon: number, r = NODE_R): Vec3 {
  return [Math.sin(polar) * Math.cos(lon) * r, Math.cos(polar) * r, Math.sin(polar) * Math.sin(lon) * r];
}
const domainCenter = (f: Field) => DOMAINS.find((d) => d.id === f)!.center;

export const INSTITUTE_NODES = INSTITUTES.map((ins) => {
  const peers = INSTITUTES.filter((o) => o.field === ins.field);
  const k = peers.indexOf(ins), n = peers.length;
  const lon = domainCenter(ins.field) + (n > 1 ? (k / (n - 1) - 0.5) * 0.6 : 0); // 분야 안에서 ±17°로 펼침
  return { code: ins.code, field: ins.field, spectrum: ins.spectrum, p: onSphere(spectrumPolar(ins.spectrum), lon) };
});

// K-문샷 미션: 관련 분야 경도 가장자리(+0.5rad)에, 응용 쪽으로 치우친 위도에 둔다(NAIS 사이트 시각화용 배치).
const MISSION_PLACE: Record<string, [Field, number]> = {
  "AI과학자": ["ict", 0.45], "반도체": ["ict", 0.72], "신약": ["life", 0.62], "태양전지": ["earth", 0.68], "핵융합": ["physics", 0.5],
  "휴머노이드": ["engineering", 0.76], "SMR선박": ["earth", 0.86], "소재": ["chemistry", 0.58], "양자": ["physics", 0.32],
  "우주": ["physics", 0.8], "BCI": ["life", 0.4],
};
export const MISSION_NODES = MISSIONS.map((m) => {
  const [f, s] = MISSION_PLACE[m.name];
  return { name: m.name, p: onSphere(spectrumPolar(s), domainCenter(f) + 0.5) };
});

/** 스크롤 진행(0~6)에 따라 기초(북)에서 응용(남)으로 내려가는 빛의 띠의 극각 */
export function sweepPolar(s: ResolvedState): number {
  const progress = s.from === s.to ? s.from : s.from + (s.to - s.from) * s.t;
  return spectrumPolar(Math.min(1, Math.max(0, progress / 6)));
}

export const SHELLS = ["AI-OS", "GPU", "MODEL", "DATA", "MARKET"].map((label, i) => ({ label, r: 0.35 + i * 0.24 }));

const LOOP_R = 1.28, LOOP_TILT = 0.45;
export function loopPoint(u: number): Vec3 {
  const a = u * Math.PI * 2 - Math.PI / 2;
  const x = Math.cos(a) * LOOP_R, z = Math.sin(a) * LOOP_R;
  return [x, -Math.sin(LOOP_TILT) * z, Math.cos(LOOP_TILT) * z];
}
export const LOOP_STATIONS = LOOP_STAGES.map((label, i) => ({ label, p: loopPoint(i / LOOP_STAGES.length) }));

export type Layer = "hub" | "axis" | "hero" | "platform" | "convergence" | "autonomous" | "moonshot" | "ecosystem" | "closing";

/** 스크롤 상태에서 각 레이어의 보이는 정도(0~1). hub(코어·기관 노드·연결선)는 한반도 지도 장면에서만 사라진다. */
export function layerWeights(s: ResolvedState): Record<Layer, number> {
  const e = s.t * s.t * (3 - 2 * s.t);
  const at = (i: number) => (s.from === s.to ? (s.from === i ? 1 : 0) : (s.to === i ? e : 0) + (s.from === i ? 1 - e : 0));
  const w = Object.fromEntries(STATES.map((name, i) => [name, at(i)])) as Record<Exclude<Layer, "hub">, number>;
  return { ...w, hub: 1 - w.ecosystem, axis: 1 - w.ecosystem };
}

const SHELL_DIR: Vec3 = [0.93, 0.28, 0.24];
export const HUB_LABELS: { text: string; p: Vec3; layer: Layer }[] = [
  { text: "NAIS", p: [0, 0, 0], layer: "hub" },
  { text: "Fundamental Science", p: [0, NODE_R * 1.16, 0], layer: "axis" },
  { text: "Applied Science", p: [0, -NODE_R * 1.16, 0], layer: "axis" },
  ...DOMAINS.map((d) => ({ text: d.label, p: onSphere(Math.PI / 2, d.center, NODE_R * 1.08), layer: "hero" as const })),
  ...INSTITUTE_NODES.map((n) => ({ text: n.code, p: n.p, layer: "hero" as const })),
  ...SHELLS.map((s) => ({ text: s.label, p: SHELL_DIR.map((v) => v * s.r) as Vec3, layer: "platform" as const })),
  { text: "Science × AI", p: [0, 0.32, 0], layer: "convergence" },
  ...LOOP_STATIONS.map((s) => ({ text: s.label, p: s.p, layer: "autonomous" as const })),
  ...MISSION_NODES.map((m) => ({ text: m.name, p: m.p, layer: "moonshot" as const })),
  { text: "NAIS", p: [HUB[0], HUB[1], 0], layer: "ecosystem" },
];
