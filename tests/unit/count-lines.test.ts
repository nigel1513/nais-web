import { expect, test } from "vitest";
import { particleCount } from "@/lib/particles/count";
import { nearestNeighborSegments } from "@/lib/particles/lines";
import { buildAllTargets } from "@/lib/particles/targets";

test("particleCount tiers", () => {
  expect(particleCount({ width: 1440, reducedMotion: false })).toBe(40000);
  expect(particleCount({ width: 800, reducedMotion: false })).toBe(20000);
  expect(particleCount({ width: 390, reducedMotion: false })).toBe(8000);
});
test("particleCount halves on low core count but never below 5000", () => {
  expect(particleCount({ width: 1440, cores: 4, reducedMotion: false })).toBe(20000);
  expect(particleCount({ width: 390, cores: 2, reducedMotion: false })).toBe(5000);
});
test("particleCount reduced motion uses mobile tier", () => {
  expect(particleCount({ width: 1440, reducedMotion: true })).toBe(8000);
});

test("nearestNeighborSegments connects close points only", () => {
  const pts = new Float32Array([0, 0, 0, 0.1, 0, 0, 5, 5, 5]);
  const seg = nearestNeighborSegments(pts, { anchors: 3, k: 1, maxDist: 0.5 });
  expect(seg.length % 6).toBe(0);
  expect(seg.length / 6).toBe(1);
});
test("nearestNeighborSegments handles anchors > points", () => {
  const seg = nearestNeighborSegments(new Float32Array([0, 0, 0]), { anchors: 50, k: 3, maxDist: 1 });
  expect(seg.length).toBe(0);
});

test("buildAllTargets returns 7 arrays of count*3", () => {
  const t = buildAllTargets(300);
  expect(t).toHaveLength(7);
  t.forEach((a) => expect(a).toHaveLength(900));
});
