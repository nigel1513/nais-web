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
