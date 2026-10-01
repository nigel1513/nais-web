import { describe, expect, test } from "vitest";
import { HOME_SECTIONS, NEWS, MISSIONS, PLATFORM_ITEMS } from "@/content/home";
import { INSTITUTES } from "@/content/institutes";
import { existsSync } from "node:fs";
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
  test("missions: only the 11 official names from the NST org page, no placeholders", () => {
    expect(MISSIONS.map((m) => m.name)).toEqual(["AI과학자", "반도체", "신약", "태양전지", "핵융합", "휴머노이드", "SMR선박", "소재", "양자", "우주", "BCI"]);
  });
  test("platform lists the five official AI플랫폼팀 duties", () => {
    expect(PLATFORM_ITEMS.map((i) => i.title)).toEqual(["AI-OS", "AI 플랫폼", "GPU 자원", "AI-ready 데이터", "AI 마켓플레이스"]);
  });
  test("home copy drops the unverified consortium claim", () => {
    expect(JSON.stringify(PLATFORM_ITEMS) + JSON.stringify(NEWS)).not.toContain("컨소시엄");
  });
});

describe("geo data", () => {
  test("institutes follow the NST 소관연구기관 page order exactly", () => {
    expect(INSTITUTES.map((i) => i.nameKo)).toEqual([
      "한국과학기술연구원", "국가녹색기술연구소", "한국기초과학지원연구원", "한국생명공학연구원",
      "한국과학기술정보연구원", "한국한의학연구원", "한국생산기술연구원", "한국전자통신연구원", "국가보안기술연구소",
      "한국건설기술연구원", "한국철도기술연구원", "한국표준과학연구원", "한국식품연구원", "세계김치연구소",
      "한국지질자원연구원", "한국기계연구원", "한국에너지기술연구원", "한국전기연구원",
      "한국화학연구원", "국가독성과학연구소", "한국원자력연구원", "한국재료연구원", "한국핵융합에너지연구원",
    ]);
  });
  test("institutes are the 23 NST 소관연구기관 and each has a CI file", () => {
    expect(INSTITUTES).toHaveLength(23);
    for (const n of ["한국천문연구원", "한국항공우주연구원"]) expect(INSTITUTES.map((i) => i.nameKo)).not.toContain(n); // 2024년 우주항공청 이관
    for (const n of ["국가녹색기술연구소", "국가독성과학연구소", "한국핵융합에너지연구원"]) expect(INSTITUTES.map((i) => i.nameKo)).toContain(n);
    expect(INSTITUTES.map((i) => i.nameKo)).not.toContain("안전성평가연구소");
    for (const i of INSTITUTES) expect(existsSync(`public/ci/${i.code}.png`)).toBe(true);
  });
  test("every institute links to its own https homepage except NSR (no public site)", () => {
    for (const i of INSTITUTES) {
      if (i.code === "NSR") expect(i.url).toBeUndefined();
      else expect(i.url).toMatch(/^https:\/\/www\.[a-z]+\.re\.kr\/$/);
    }
  });
  test("institutes inside South Korea bounds", () => {
    INSTITUTES.forEach((i) => {
      expect(i.lon).toBeGreaterThan(124.5); expect(i.lon).toBeLessThan(130);
      expect(i.lat).toBeGreaterThan(33); expect(i.lat).toBeLessThan(38.7);
    });
  });
  test("korea outline rings are within peninsula bbox", () => {
    const rings = outline as { country: string; points: number[][] }[];
    expect(rings.length).toBeGreaterThan(0);
    rings.flatMap((r) => r.points).forEach(([lon, lat]) => {
      expect(lon).toBeGreaterThan(124); expect(lon).toBeLessThan(132);
      expect(lat).toBeGreaterThan(33); expect(lat).toBeLessThan(43.1);
    });
  });
});
