import { describe, expect, test } from "vitest";
import { project, pointInRing, samplePerimeter } from "@/lib/particles/geo";
import { convergence } from "@/lib/particles/targets/convergence";
import { moonshot, MOONSHOT_NODES } from "@/lib/particles/targets/moonshot";
import { korea } from "@/lib/particles/targets/korea";
import { buildAllTargets } from "@/lib/particles/targets";
import { STATE_LABELS } from "@/lib/particles/labels";

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

describe.each([["convergence", convergence], ["moonshot", moonshot], ["korea", korea]] as const)("%s", (_, gen) => {
  test.each([1, 2, 1001, 40000])("count %i", (count) => {
    const a = gen(count);
    expect(a).toHaveLength(count * 3);
    for (const v of a) { expect(Number.isFinite(v)).toBe(true); expect(Math.abs(v)).toBeLessThanOrEqual(3); }
  });
  test("deterministic", () => expect(gen(400, 9)).toEqual(gen(400, 9)));
});

test("korea puts the brightest cluster in Daedeok", () => {
  const a = korea(20000);
  const [dx, dy] = project(127.36, 36.38);
  let near = 0;
  for (let i = 0; i < 20000; i++) if (Math.hypot(a[i * 3] - dx, a[i * 3 + 1] - dy) < 0.12) near++;
  expect(near / 20000).toBeGreaterThan(0.08);
});

test("moonshot has 12 nodes", () => expect(MOONSHOT_NODES).toHaveLength(12));

test("targets are all distinct after replacement", () => {
  const t = buildAllTargets(200);
  const keys = t.map((a) => a.slice(0, 6).join(","));
  expect(new Set(keys.slice(0, 6)).size).toBe(6);
});

test("labels cover mesh, convergence, loop, moonshot", () => {
  expect(Object.keys(STATE_LABELS).sort()).toEqual(["convergence", "loop", "mesh", "moonshot"]);
  expect(STATE_LABELS.moonshot).toHaveLength(12);
  expect(STATE_LABELS.loop?.map((l) => l.text)).toEqual(["질문", "탐색", "가설", "실험", "분석", "학습"]);
});
