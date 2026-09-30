import { expect, test } from "vitest";
import { particleCount } from "@/lib/particles/count";
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
test("buildAllTargets returns 7 arrays of count*3", () => {
  const t = buildAllTargets(300);
  expect(t).toHaveLength(7);
  t.forEach((a) => expect(a).toHaveLength(900));
});
