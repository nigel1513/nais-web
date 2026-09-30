import { expect, test } from "vitest";
import { network } from "@/lib/particles/targets/network";
import { INSTITUTE_NODES } from "@/lib/particles/hub";

const N = 20000;
const a = network(N);
const at = (i: number) => [a[i * 3], a[i * 3 + 1], a[i * 3 + 2]];

test("length, finite, bounded, deterministic", () => {
  expect(a).toHaveLength(N * 3);
  for (const v of a) { expect(Number.isFinite(v)).toBe(true); expect(Math.abs(v)).toBeLessThanOrEqual(3); }
  expect(network(500, 3)).toEqual(network(500, 3));
});

test("not a planet: few particles sit on an outer shell", () => {
  let shell = 0;
  for (let i = 0; i < N; i++) if (Math.hypot(...at(i)) > 1.5) shell++;
  expect(shell / N).toBeLessThan(0.25);
});

test("a network: many particles gather around institute nodes", () => {
  let near = 0;
  for (let i = 0; i < N; i++) {
    const p = at(i);
    if (INSTITUTE_NODES.some((n) => Math.hypot(p[0] - n.p[0], p[1] - n.p[1], p[2] - n.p[2]) < 0.28)) near++;
  }
  expect(near / N).toBeGreaterThan(0.3);
});
