import { describe, expect, test } from "vitest";
import { INSTITUTE_NODES, MISSION_NODES, SHELLS, LOOP_STATIONS, loopPoint, layerWeights, HUB_LABELS, DOMAINS, spectrumPolar, sweepPolar, NODE_R } from "@/lib/particles/hub";
import { INSTITUTES } from "@/content/institutes";
import { MISSIONS, LOOP_STAGES } from "@/content/home";

const len = (p: number[]) => Math.hypot(p[0], p[1], p[2]);

describe("hub geometry", () => {
  test("every institute is classified into a domain and a basic→applied spectrum value", () => {
    expect(DOMAINS).toHaveLength(6);
    for (const i of INSTITUTES) {
      expect(DOMAINS.map((d) => d.id)).toContain(i.field);
      expect(i.spectrum).toBeGreaterThanOrEqual(0); expect(i.spectrum).toBeLessThanOrEqual(1);
    }
  });
  test("basic science sits north, applied science south", () => {
    const y = (code: string) => INSTITUTE_NODES.find((n) => n.code === code)!.p[1];
    expect(y("KBSI")).toBeGreaterThan(y("KRISS"));
    expect(y("KRISS")).toBeGreaterThan(y("ETRI"));
    expect(y("ETRI")).toBeGreaterThan(y("KRRI"));
    expect(spectrumPolar(0)).toBeLessThan(spectrumPolar(1));
  });
  test("institutes of the same domain share a longitude sector", () => {
    const lon = (p: number[]) => Math.atan2(p[2], p[0]);
    const phys = INSTITUTE_NODES.filter((n) => INSTITUTES.find((i) => i.code === n.code)!.field === "physics").map((n) => lon(n.p));
    const spread = Math.max(...phys) - Math.min(...phys);
    expect(spread).toBeLessThan((2 * Math.PI) / 6);
  });
  test("the highlight moves from basic (north) to applied (south) as the page scrolls", () => {
    expect(sweepPolar({ from: 0, to: 0, t: 1 })).toBeCloseTo(spectrumPolar(0));
    expect(sweepPolar({ from: 6, to: 6, t: 1 })).toBeCloseTo(spectrumPolar(1));
    expect(sweepPolar({ from: 2, to: 3, t: 0.5 })).toBeGreaterThan(sweepPolar({ from: 1, to: 1, t: 1 }));
  });
  test("one node per institute on the sphere surface", () => {
    expect(INSTITUTE_NODES).toHaveLength(INSTITUTES.length);
    INSTITUTE_NODES.forEach((n) => expect(len(n.p)).toBeCloseTo(NODE_R, 2));
  });
  test("one node per official mission, not overlapping institute nodes", () => {
    expect(MISSION_NODES).toHaveLength(MISSIONS.length);
    for (const m of MISSION_NODES) for (const n of INSTITUTE_NODES) expect(Math.hypot(m.p[0] - n.p[0], m.p[1] - n.p[1], m.p[2] - n.p[2])).toBeGreaterThan(0.12);
  });
  test("five platform shells, growing radius, inside the sphere", () => {
    expect(SHELLS.map((s) => s.label)).toEqual(["AI-OS", "GPU", "MODEL", "DATA", "MARKET"]);
    for (let i = 1; i < SHELLS.length; i++) expect(SHELLS[i].r).toBeGreaterThan(SHELLS[i - 1].r);
    expect(SHELLS[SHELLS.length - 1].r).toBeLessThan(1.5);
    expect(NODE_R).toBeLessThan(1.45);
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
    expect(layerWeights({ from: 6, to: 6, t: 1 }).axis).toBe(0);
    expect(layerWeights({ from: 0, to: 0, t: 1 }).axis).toBe(1);
  });
});

test("labels carry a layer and cover every section meaning", () => {
  const layers = new Set(HUB_LABELS.map((l) => l.layer));
  for (const l of ["hub", "hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem"]) expect(layers.has(l as never)).toBe(true);
  const texts = HUB_LABELS.map((l) => l.text);
  expect(texts).toContain("Fundamental Science");
  expect(texts).toContain("Applied Science");
  // 지구본처럼 보이는 적도 분야명은 두지 않는다
  for (const d of DOMAINS) expect(texts).not.toContain(d.label);
  expect(HUB_LABELS.filter((l) => l.layer === "moonshot").map((l) => l.text)).toEqual(MISSIONS.map((m) => m.name));
});
