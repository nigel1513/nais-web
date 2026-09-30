import { describe, expect, test } from "vitest";
import { project, pointInRing, samplePerimeter } from "@/lib/particles/geo";
import { korea } from "@/lib/particles/targets/korea";
import { buildAllTargets } from "@/lib/particles/targets";

describe("geo", () => {
  const square: [number, number][] = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]];
  test("pointInRing", () => {
    expect(pointInRing(0.5, 0.5, square)).toBe(true);
    expect(pointInRing(1.5, 0.5, square)).toBe(false);
  });
  test("samplePerimeter walks the ring", () => {
    expect(samplePerimeter(square, 0)).toEqual([0, 0]);
    const [x, y] = samplePerimeter(square, 0.5);
    expect(x).toBeCloseTo(1); expect(y).toBeCloseTo(1);
  });
  test("project centers the peninsula within ±3", () => {
    for (const [lon, lat] of [[124.6, 33.1], [130.9, 43.0], [127.36, 36.37]]) {
      const [x, y] = project(lon, lat);
      expect(Math.abs(x)).toBeLessThan(3); expect(Math.abs(y)).toBeLessThan(3);
    }
  });
});

describe.each([["korea", korea]] as const)("%s", (_, gen) => {
  test.each([1, 2, 1001, 40000])("count %i", (count) => {
    const a = gen(count);
    expect(a).toHaveLength(count * 3);
    for (const v of a) { expect(Number.isFinite(v)).toBe(true); expect(Math.abs(v)).toBeLessThanOrEqual(3); }
  });
  test("deterministic", () => expect(gen(400, 9)).toEqual(gen(400, 9)));
});

test("targets: the single sphere everywhere except the ecosystem map", () => {
  const t = buildAllTargets(200);
  expect(t).toHaveLength(7);
  for (const i of [0, 1, 2, 3, 4, 6]) expect(t[i]).toBe(t[0]);
  expect(t[5]).not.toBe(t[0]);
});

