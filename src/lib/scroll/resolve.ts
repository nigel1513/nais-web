export interface ResolvedState { from: number; to: number; t: number }

export function resolveState(scrollY: number, boundaries: number[], zone: number): ResolvedState {
  const z = Math.max(0, zone);
  for (let i = 0; i < boundaries.length; i++) {
    const end = boundaries[i];
    const start = end - z;
    if (scrollY < start) return { from: i, to: i, t: 1 };
    if (scrollY < end) return { from: i, to: i + 1, t: (scrollY - start) / z };
  }
  return { from: boundaries.length, to: boundaries.length, t: 1 };
}

export function snapForReducedMotion(s: ResolvedState): ResolvedState {
  const k = s.t >= 0.5 ? s.to : s.from;
  return { from: k, to: k, t: 1 };
}

export const sameState = (a: ResolvedState, b: ResolvedState) => a.from === b.from && a.to === b.to && a.t === b.t;

/** 상태를 한 줄 위의 위치로 바꾼다: 상태 i에 머물면 i, i→i+1 전환 중이면 i+t */
export const toPosition = (s: ResolvedState) => (s.from === s.to ? s.from : s.from + s.t);

export function fromPosition(p: number): ResolvedState {
  const from = Math.floor(p), t = p - from;
  return t < 1e-4 ? { from, to: from, t: 1 } : { from, to: from + 1, t };
}

/**
 * 스크롤 위치를 바로 따르지 않고 시간 상수 tau(초)로 따라간다. 휠 한 칸이 장면을 뚝 끊지 않게 한다.
 * 한 상태 이상 떨어진 이동(앵커 이동, 중간에서 새로 고침)은 지나가는 장면을 훑지 않도록 바로 맞춘다.
 */
export function dampPosition(cur: number, target: number, dt: number, tau = 0.12): number {
  const d = target - cur;
  if (Math.abs(d) > 1 || Math.abs(d) < 1e-4) return target;
  return cur + d * (1 - Math.exp(-dt / tau));
}
