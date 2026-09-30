import { describe, expect, test } from "vitest";
import { HOME_SECTIONS, NEWS, MISSIONS, PLATFORM_ITEMS } from "@/content/home";
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
  test("missions: 11 official names from the NST org page, 12th pending", () => {
    expect(MISSIONS).toHaveLength(12);
    expect(MISSIONS.slice(0, 11).map((m) => m.name)).toEqual(["AI과학자", "반도체", "신약", "태양전지", "핵융합", "휴머노이드", "SMR선박", "소재", "양자", "우주", "BCI"]);
    expect(MISSIONS[11].name).toBe("명칭 확인 중");
  });
  test("platform lists the five official AI플랫폼팀 duties", () => {
    expect(PLATFORM_ITEMS.map((i) => i.title)).toEqual(["AI-OS", "AI 플랫폼", "GPU 자원", "AI-ready 데이터", "AI 마켓플레이스"]);
  });
  test("home copy drops the unverified consortium claim", () => {
    expect(JSON.stringify(PLATFORM_ITEMS) + JSON.stringify(NEWS)).not.toContain("컨소시엄");
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
