export const STATES = ["sphere", "mesh", "convergence", "loop", "moonshot", "korea", "sphereFinal"] as const;
export type StateName = (typeof STATES)[number];

export interface LineConfig { anchors: number; k: number; maxDist: number }
export interface StateConfig { spin: number; tilt: number; offsetX: number; brightness: number; lines: LineConfig | null }

// spin: rad/s (y축), tilt: rad (x축), offsetX: 데스크톱에서 오브젝트를 오른쪽으로 미는 거리
export const STATE_CONFIG: Record<StateName, StateConfig> = {
  sphere:      { spin: 0.06, tilt: 0.25, offsetX: 1.3, brightness: 1.0, lines: { anchors: 180, k: 2, maxDist: 0.9 } },
  mesh:        { spin: 0,    tilt: 1.05, offsetX: 1.5, brightness: 0.95, lines: { anchors: 220, k: 2, maxDist: 0.55 } },
  convergence: { spin: 0,    tilt: 0,    offsetX: 1.55, brightness: 1.0, lines: null },
  loop:        { spin: 0.12, tilt: 1.1,  offsetX: 1.2, brightness: 1.0, lines: null },
  moonshot:    { spin: 0.04, tilt: 1.2,  offsetX: 1.6, brightness: 1.0, lines: null },
  korea:       { spin: 0,    tilt: -0.75, offsetX: 1.5, brightness: 0.75, lines: null },
  sphereFinal: { spin: 0.09, tilt: 0.25, offsetX: 1.1, brightness: 1.35, lines: { anchors: 260, k: 3, maxDist: 1.0 } },
};
