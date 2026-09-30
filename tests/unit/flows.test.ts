import { describe, expect, test } from "vitest";
import { HUB, flowSources, buildArcs, bezier, arcPolyline, packetAttributes } from "@/lib/particles/flows";
import { insideKorea } from "@/lib/particles/targets/korea";

describe("flows", () => {
  test("sources exclude the Daedeok hub cluster and lie inside Korea", () => {
    const s = flowSources();
    expect(s.length).toBeGreaterThanOrEqual(30);
    for (const [x, y] of s) {
      expect(Math.hypot(x - HUB[0], y - HUB[1])).toBeGreaterThan(0.08);
      expect(insideKorea(x, y)).toBe(true);
    }
  });
  test("sources are deterministic", () => expect(flowSources()).toEqual(flowSources()));
  test("every arc ends at the hub and lifts toward the viewer mid-way", () => {
    const arcs = buildArcs(flowSources());
    for (const a of arcs) {
      const end = bezier(a, 1);
      expect(end[0]).toBeCloseTo(HUB[0]); expect(end[1]).toBeCloseTo(HUB[1]); expect(end[2]).toBeCloseTo(0);
      expect(bezier(a, 0.5)[2]).toBeGreaterThan(0.1);
    }
  });
  test("arcPolyline emits segment pairs", () => {
    const arcs = buildArcs(flowSources()).slice(0, 3);
    expect(arcPolyline(arcs, 10)).toHaveLength(3 * 10 * 6);
  });
  test("packetAttributes sizes match arcs × perArc", () => {
    const arcs = buildArcs(flowSources());
    const p = packetAttributes(arcs, 4);
    expect(p.phase).toHaveLength(arcs.length * 4);
    expect(p.p0).toHaveLength(arcs.length * 4 * 3);
    for (const v of p.speed) { expect(v).toBeGreaterThan(0); }
  });
});
