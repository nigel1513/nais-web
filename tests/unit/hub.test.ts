import { describe, expect, test } from "vitest";
import { INSTITUTE_NODES, MISSION_NODES, SHELLS, LOOP_STATIONS, loopPoint, layerWeights, HUB_LABELS } from "@/lib/particles/hub";
import { INSTITUTES } from "@/content/institutes";
import { MISSIONS, LOOP_STAGES } from "@/content/home";

const len = (p: number[]) => Math.hypot(p[0], p[1], p[2]);

describe("hub geometry", () => {
  test("one node per institute on the sphere surface", () => {
    expect(INSTITUTE_NODES).toHaveLength(INSTITUTES.length);
    INSTITUTE_NODES.forEach((n) => expect(len(n.p)).toBeCloseTo(1.62, 2));
  });
  test("one node per official mission, not overlapping institute nodes", () => {
    expect(MISSION_NODES).toHaveLength(MISSIONS.length);
    for (const m of MISSION_NODES) for (const n of INSTITUTE_NODES) expect(Math.hypot(m.p[0] - n.p[0], m.p[1] - n.p[1], m.p[2] - n.p[2])).toBeGreaterThan(0.12);
  });
  test("five platform shells, growing radius, inside the sphere", () => {
    expect(SHELLS.map((s) => s.label)).toEqual(["AI-OS", "GPU", "MODEL", "DATA", "MARKET"]);
    for (let i = 1; i < SHELLS.length; i++) expect(SHELLS[i].r).toBeGreaterThan(SHELLS[i - 1].r);
    expect(SHELLS[SHELLS.length - 1].r).toBeLessThan(1.5);
  });
  test("research loop has six stations on its ring", () => {
    expect(LOOP_STATIONS.map((s) => s.label)).toEqual([...LOOP_STAGES]);
    LOOP_STATIONS.forEach((s, i) => expect(s.p).toEqual(loopPoint(i / 6)));
  });
});

describe("layerWeights", () => {
  test("at rest on a section only that section's layer and the hub are on", () => {
    const w = layerWeights({ from: 1, to: 1, t: 1 });
    expect(w.platform).toBe(1); expect(w.hub).toBe(1);
    expect(w.convergence).toBe(0); expect(w.moonshot).toBe(0);
  });
  test("cross-fades between neighbouring sections", () => {
    const w = layerWeights({ from: 3, to: 4, t: 0.5 });
    expect(w.autonomous).toBeCloseTo(0.5); expect(w.moonshot).toBeCloseTo(0.5);
  });
  test("the hub fades out on the Korea map and back after it", () => {
    expect(layerWeights({ from: 5, to: 5, t: 1 }).hub).toBe(0);
    expect(layerWeights({ from: 5, to: 5, t: 1 }).ecosystem).toBe(1);
    expect(layerWeights({ from: 6, to: 6, t: 1 }).hub).toBe(1);
  });
});

test("labels carry a layer and cover every section meaning", () => {
  const layers = new Set(HUB_LABELS.map((l) => l.layer));
  for (const l of ["hub", "hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem"]) expect(layers.has(l as never)).toBe(true);
  expect(HUB_LABELS.filter((l) => l.layer === "moonshot").map((l) => l.text)).toEqual(MISSIONS.map((m) => m.name));
});
