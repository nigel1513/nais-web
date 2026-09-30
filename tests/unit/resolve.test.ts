import { describe, expect, test } from "vitest";
import { resolveState, snapForReducedMotion, sameState } from "@/lib/scroll/resolve";
import { particleStore } from "@/lib/scroll/store";

const B = [1000, 2000, 3000, 4000, 5000, 6000]; // 7개 상태 → 전환 6개
const Z = 400;

describe("resolveState", () => {
  test("top of page rests on state 0", () => expect(resolveState(0, B, Z)).toEqual({ from: 0, to: 0, t: 1 }));
  test("inside first transition", () => {
    const s = resolveState(800, B, Z);
    expect(s.from).toBe(0); expect(s.to).toBe(1); expect(s.t).toBeCloseTo(0.5);
  });
  test("between transitions rests on reached state", () => expect(resolveState(1500, B, Z)).toEqual({ from: 1, to: 1, t: 1 }));
  test("exactly at boundary end is next state at rest", () => expect(resolveState(1000, B, Z)).toEqual({ from: 1, to: 1, t: 1 }));
  test("after last boundary rests on final state", () => expect(resolveState(99999, B, Z)).toEqual({ from: 6, to: 6, t: 1 }));
  test("jump: far scroll resolves directly without intermediate states", () => {
    expect(resolveState(4500, B, Z)).toEqual({ from: 4, to: 4, t: 1 });
    const mid = resolveState(4800, B, Z);
    expect(mid.from).toBe(4); expect(mid.to).toBe(5);
  });
  test("negative scroll (overscroll bounce) clamps to state 0", () => expect(resolveState(-120, B, Z)).toEqual({ from: 0, to: 0, t: 1 }));
  test("zero zone switches instantly", () => {
    expect(resolveState(999, B, 0)).toEqual({ from: 0, to: 0, t: 1 });
    expect(resolveState(1000, B, 0)).toEqual({ from: 1, to: 1, t: 1 });
  });
  test("empty boundaries → always state 0", () => expect(resolveState(500, [], Z)).toEqual({ from: 0, to: 0, t: 1 }));
});

describe("snapForReducedMotion", () => {
  test("before halfway keeps source state", () => expect(snapForReducedMotion({ from: 2, to: 3, t: 0.3 })).toEqual({ from: 2, to: 2, t: 1 }));
  test("after halfway shows target state", () => expect(snapForReducedMotion({ from: 2, to: 3, t: 0.7 })).toEqual({ from: 3, to: 3, t: 1 }));
});

test("sameState compares all fields", () => {
  expect(sameState({ from: 1, to: 2, t: 0.5 }, { from: 1, to: 2, t: 0.5 })).toBe(true);
  expect(sameState({ from: 1, to: 2, t: 0.5 }, { from: 1, to: 2, t: 0.6 })).toBe(false);
});

test("store starts at rest on state 0", () => expect(particleStore.getState()).toEqual({ from: 0, to: 0, t: 1 }));
