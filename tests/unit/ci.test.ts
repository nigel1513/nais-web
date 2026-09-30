import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { ciSize, CI_MAX_WIDTH } from "@/lib/ci";
import { INSTITUTES } from "@/content/institutes";

const pngSize = (file: string) => { const b = readFileSync(file); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; };

describe("ciSize (optical normalization)", () => {
  test("keeps the aspect ratio", () => {
    const s = ciSize(200, 25);
    expect(s.width / s.height).toBeCloseTo(8, 1);
  });
  test("wide and compact logos end up with similar visual area", () => {
    const areas = [[86, 67], [157, 68], [199, 41], [200, 22]].map(([w, h]) => { const s = ciSize(w, h); return s.width * s.height; });
    const max = Math.max(...areas), min = Math.min(...areas);
    expect(max / min).toBeLessThan(1.6);
  });
  test("never wider than the column", () => {
    expect(ciSize(400, 20).width).toBeLessThanOrEqual(CI_MAX_WIDTH);
  });
});

test("institute CI dimensions match the files", () => {
  for (const i of INSTITUTES) {
    const { w, h } = pngSize(`public/ci/${i.code}.png`);
    expect([i.ci.width, i.ci.height]).toEqual([w, h]);
  }
});
