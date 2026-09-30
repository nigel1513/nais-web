import { describe, expect, test } from "vitest";
import { HOME_SECTIONS, NEWS, MISSIONS, PLATFORM_CARDS, AUTONOMOUS_POINTS } from "@/content/home";
import { INSTITUTES } from "@/content/institutes";
import outline from "@/content/korea-outline.json";

describe("home content", () => {
  test("seven sections in particle-state order", () => {
    expect(HOME_SECTIONS.map((s) => s.id)).toEqual(["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"]);
  });
  test("news sorted by date descending with ISO dates", () => {
    const dates = NEWS.map((n) => n.date);
    dates.forEach((d) => expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/));
    expect([...dates].sort().reverse()).toEqual(dates);
  });
  test("missions are placeholders only", () => {
    expect(MISSIONS).toHaveLength(12);
    MISSIONS.forEach((m, i) => expect(m).toBe(`Mission ${String(i + 1).padStart(2, "0")}`));
  });
  test("platform has five cards", () => expect(PLATFORM_CARDS).toHaveLength(5));
  test("autonomous cards carry only confirmed items (consortium claim is unverified)", () => {
    expect(AUTONOMOUS_POINTS.map((c) => c.label)).toEqual(["UNIT", "PLATFORM"]);
  });
});

describe("geo data", () => {
  test("institutes inside South Korea bounds", () => {
    expect(INSTITUTES.length).toBeGreaterThanOrEqual(20);
    INSTITUTES.forEach((i) => {
      expect(i.lon).toBeGreaterThan(124.5); expect(i.lon).toBeLessThan(130);
      expect(i.lat).toBeGreaterThan(33); expect(i.lat).toBeLessThan(38.7);
    });
  });
  test("korea outline rings are within peninsula bbox", () => {
    const rings = outline as number[][][];
    expect(rings.length).toBeGreaterThan(0);
    rings.flat().forEach(([lon, lat]) => {
      expect(lon).toBeGreaterThan(124); expect(lon).toBeLessThan(131.5);
      expect(lat).toBeGreaterThan(33); expect(lat).toBeLessThan(43.1);
    });
  });
});
