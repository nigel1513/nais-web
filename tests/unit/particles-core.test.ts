import { describe, expect, test } from "vitest";
import { mulberry32 } from "@/lib/particles/rng";
import { STATES, STATE_CONFIG } from "@/lib/particles/states";
import { applyStateTransform } from "@/lib/particles/transform";
import { sphere } from "@/lib/particles/targets/sphere";
import { mesh, MESH_LABEL_ANCHORS } from "@/lib/particles/targets/mesh";
import { loop, LOOP_STATIONS } from "@/lib/particles/targets/loop";

const generators = { sphere, mesh, loop };

describe("rng", () => {
  test("deterministic and in [0,1)", () => {
    const a = mulberry32(7), b = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThan(1);
    }
  });
});

describe("states", () => {
  test("seven states, sphereFinal brighter than sphere", () => {
    expect(STATES).toHaveLength(7);
    expect(STATE_CONFIG.sphereFinal.brightness).toBeGreaterThan(STATE_CONFIG.sphere.brightness);
  });
});

describe("transform", () => {
  test("identity when spin and tilt are zero", () => {
    expect(applyStateTransform([1, 2, 3], 0, 0, 10)).toEqual([1, 2, 3]);
  });
  test("tilt of 90deg maps +y to +z", () => {
    const [x, y, z] = applyStateTransform([0, 1, 0], 0, Math.PI / 2, 0);
    expect(x).toBeCloseTo(0); expect(y).toBeCloseTo(0); expect(z).toBeCloseTo(1);
  });
  test("spin rotates around y by time*spin", () => {
    const [x, , z] = applyStateTransform([1, 0, 0], 1, 0, Math.PI / 2);
    expect(x).toBeCloseTo(0); expect(z).toBeCloseTo(-1);
  });
});

describe.each(Object.entries(generators))("%s target", (_, gen) => {
  test.each([1, 2, 997, 40000])("count %i → length, finite, bounded", (count) => {
    const arr = gen(count);
    expect(arr).toHaveLength(count * 3);
    for (const v of arr) { expect(Number.isFinite(v)).toBe(true); expect(Math.abs(v)).toBeLessThanOrEqual(3); }
  });
  test("deterministic for same seed", () => expect(gen(500, 3)).toEqual(gen(500, 3)));
});

test("label anchors exist", () => {
  expect(MESH_LABEL_ANCHORS.map((a) => a.text)).toEqual(["AI-OS", "GPU", "MODEL", "DATA", "API"]);
  expect(LOOP_STATIONS).toHaveLength(6);
});
