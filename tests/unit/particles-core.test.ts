import { describe, expect, test } from "vitest";
import { mulberry32 } from "@/lib/particles/rng";
import { STATES, STATE_CONFIG, lookAt } from "@/lib/particles/states";
import { applyStateTransform, applyLook } from "@/lib/particles/transform";
import { sphere } from "@/lib/particles/targets/sphere";

describe("rng", () => {
  test("deterministic and in [0,1)", () => {
    const a = mulberry32(7), b = mulberry32(7);
    for (let i = 0; i < 1000; i++) { const x = a(); expect(x).toBe(b()); expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThan(1); }
  });
});

describe("looks (one object, per-section mood)", () => {
  test("seven section states in page order", () => {
    expect(STATES).toEqual(["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "closing"]);
  });
  test("closing is brighter than hero", () => expect(STATE_CONFIG.closing.brightness).toBeGreaterThan(STATE_CONFIG.hero.brightness));
  test("lookAt interpolates every numeric field between two states", () => {
    const l = lookAt(0, 1, 0.5);
    const a = STATE_CONFIG.hero, b = STATE_CONFIG.platform;
    expect(l.scale).toBeCloseTo((a.scale + b.scale) / 2);
    expect(l.flow).toBeCloseTo((a.flow + b.flow) / 2);
    expect(l.yaw).toBeCloseTo((a.yaw + b.yaw) / 2);
  });
  test("lookAt at rest returns that state's look", () => expect(lookAt(3, 3, 1)).toEqual(STATE_CONFIG.autonomous));
});

describe("transform", () => {
  test("identity when spin and tilt are zero", () => expect(applyStateTransform([1, 2, 3], 0, 0, 10)).toEqual([1, 2, 3]));
  test("tilt of 90deg maps +y to +z", () => {
    const [x, y, z] = applyStateTransform([0, 1, 0], 0, Math.PI / 2, 0);
    expect(x).toBeCloseTo(0); expect(y).toBeCloseTo(0); expect(z).toBeCloseTo(1);
  });
  test("applyLook scales before rotating", () => {
    const [x] = applyLook([1, 0, 0], { ...STATE_CONFIG.hero, scale: 2, yaw: 0, tilt: 0 });
    expect(x).toBeCloseTo(2);
  });
});

describe("sphere target", () => {
  test.each([1, 2, 997, 40000])("count %i → length, finite, bounded", (count) => {
    const arr = sphere(count);
    expect(arr).toHaveLength(count * 3);
    for (const v of arr) { expect(Number.isFinite(v)).toBe(true); expect(Math.abs(v)).toBeLessThanOrEqual(3); }
  });
  test("deterministic for same seed", () => expect(sphere(500, 3)).toEqual(sphere(500, 3)));
});
