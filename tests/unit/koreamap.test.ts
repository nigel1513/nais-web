import { describe, expect, test } from "vitest";
import { korea, koreaDotGrid, insideSouth, insideNorth, DOT_SPACING, NORTH_RINGS } from "@/lib/particles/targets/korea";
import { project } from "@/lib/particles/geo";
import { HUB } from "@/lib/particles/flows";
import { HUB_LABELS, MAP_MARKERS } from "@/lib/particles/hub";
import { INSTITUTES } from "@/content/institutes";
import outline from "@/content/korea-outline.json";

describe("Korea dot-matrix map", () => {
  const grid = koreaDotGrid();
  test("South Korea is filled with an evenly spaced dot grid", () => {
    expect(grid.length).toBeGreaterThan(1500);
    for (const [x, y] of grid) expect(insideSouth(x, y)).toBe(true);
    // 가까운 이웃과의 거리가 격자 간격보다 작아지지 않는다(뭉침 없음)
    for (let i = 0; i < 300; i++) {
      const [x, y] = grid[i];
      let m = Infinity;
      for (let j = 0; j < grid.length; j++) if (j !== i) m = Math.min(m, Math.hypot(grid[j][0] - x, grid[j][1] - y));
      expect(m).toBeGreaterThanOrEqual(DOT_SPACING * 0.99);
    }
  });
  test("North Korea gets only a faint outline, no fill", () => {
    const a = korea(20000);
    let fill = 0;
    const outlinePts = NORTH_RINGS.flat();
    const onOutline = (x: number, y: number) => outlinePts.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < 0.03);
    for (let i = 0; i < 20000; i++) { const x = a[i * 3], y = a[i * 3 + 1]; if (insideNorth(x, y) && !onOutline(x, y)) fill++; }
    expect(fill / 20000).toBeLessThan(0.01);
  });
  test("the Daedeok hub is compact, not a blown-out blob", () => {
    const a = korea(20000);
    let near = 0;
    for (let i = 0; i < 20000; i++) if (Math.hypot(a[i * 3] - HUB[0], a[i * 3 + 1] - HUB[1]) < 0.12) near++;
    expect(near / 20000).toBeLessThan(0.12);
    expect(near / 20000).toBeGreaterThan(0.02);
  });
  test("outline rings carry a country code", () => {
    const rings = outline as { country: string; points: number[][] }[];
    expect(new Set(rings.map((r) => r.country))).toEqual(new Set(["KOR", "PRK"]));
    const [x, y] = project(126.978, 37.566);
    expect(insideSouth(x, y)).toBe(true); // 서울
  });
});

test("map shows every 소관 연구기관: hub label counts all 25 and each code is labelled", () => {
  const eco = HUB_LABELS.filter((l) => l.layer === "ecosystem").map((l) => l.text);
  const inst = HUB_LABELS.filter((l) => l.layer === "institute" || l.layer === "callout").map((l) => l.text).join(" · ");
  expect(eco).toEqual([`NAIS · 소관 연구기관 ${INSTITUTES.length}곳`]);
  for (const i of INSTITUTES) expect(inst).toContain(i.code);
});

test("Daedeok institutes are listed together in one callout beside the map", () => {
  const callout = HUB_LABELS.filter((l) => l.layer === "callout");
  expect(callout).toHaveLength(1);
  expect(callout[0].text).toMatch(/^대덕연구개발특구/);
  for (const i of INSTITUTES.filter((i) => i.city === "대전")) expect(callout[0].text).toContain(i.code);
  // 상자는 지도 오른쪽(바다) 바깥에 둔다
  expect(callout[0].p[0]).toBeGreaterThan(0.55);
  expect(MAP_MARKERS).toHaveLength(INSTITUTES.length);
});
