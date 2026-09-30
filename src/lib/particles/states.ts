/** 섹션 순서와 같은 7개 상태. 형태는 구 하나(생태계 섹션만 한반도)이고, 섹션마다 '분위기'만 바뀐다. */
export const STATES = ["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "closing"] as const;
export type StateName = (typeof STATES)[number];

export interface Look {
  offsetX: number;    // 데스크톱에서 오른쪽으로 미는 거리
  scale: number;      // 오브젝트 크기
  yaw: number;        // y축 회전(rad). 섹션을 지날수록 누적되어 천천히 돌아가는 느낌을 준다
  tilt: number;       // x축 기울기(rad)
  spin: number;       // 정지 상태에서의 y축 회전 속도(rad/s)
  flow: number;       // curl noise 유체 흐름의 세기
  swirl: number;      // 중심축 소용돌이의 세기
  size: number;       // 입자 크기 배율
  brightness: number;
  hue: number;        // 0=청록 중심, 1=옅은 빛(흰색 쪽) 비중
}

export const STATE_CONFIG: Record<StateName, Look> = {
  hero:        { offsetX: 1.3,  scale: 1.0,  yaw: 0.0, tilt: 0.25,  spin: 0.05, flow: 0.12, swirl: 0.0, size: 0.8,  brightness: 0.5,  hue: 0.1 },
  platform:    { offsetX: 1.45, scale: 0.92, yaw: 1.1, tilt: 0.7,   spin: 0.03, flow: 0.05, swirl: 0.0, size: 0.7,  brightness: 0.32,  hue: 0.0 },
  convergence: { offsetX: 1.5,  scale: 0.85, yaw: 2.2, tilt: 0.1,   spin: 0.05, flow: 0.3,  swirl: 0.0, size: 0.8,  brightness: 0.42, hue: 0.25 },
  autonomous:  { offsetX: 1.4,  scale: 1.0,  yaw: 3.1, tilt: 0.95,  spin: 0.04, flow: 0.12, swirl: 1.0, size: 0.7,  brightness: 0.34,  hue: 0.4 },
  moonshot:    { offsetX: 1.55, scale: 1.15, yaw: 4.2, tilt: 0.35,  spin: 0.03, flow: 0.08, swirl: 0.25, size: 0.8, brightness: 0.42, hue: 0.6 },
  ecosystem:   { offsetX: 1.5,  scale: 1.0,  yaw: 6.2832, tilt: -0.75, spin: 0,  flow: 0.0,  swirl: 0.0, size: 1.0,  brightness: 0.75, hue: 0.0 },
  closing:     { offsetX: 1.2,  scale: 1.1,  yaw: 7.2, tilt: 0.25,  spin: 0.08, flow: 0.18, swirl: 0.15, size: 0.9, brightness: 0.7, hue: 0.3 },
};

const KEYS = Object.keys(STATE_CONFIG.hero) as (keyof Look)[];

/** 두 상태 사이의 분위기를 부드럽게 보간한다(t는 0~1, smoothstep 적용). */
export function lookAt(from: number, to: number, t: number): Look {
  const a = STATE_CONFIG[STATES[from]], b = STATE_CONFIG[STATES[to]];
  if (from === to) return a;
  const e = t * t * (3 - 2 * t);
  return Object.fromEntries(KEYS.map((k) => [k, a[k] + (b[k] - a[k]) * e])) as unknown as Look;
}
