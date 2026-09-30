import { describe, expect, test } from "vitest";
import { ORG, flattenOrg } from "@/content/organization";

describe("NAIS organization (NST 공식 조직도 기준)", () => {
  test("center has four direct units in official order", () => {
    expect(ORG.name).toBe("국가과학AI연구센터");
    expect(ORG.children.map((u) => u.name)).toEqual(["K-문샷추진지원단", "과학AI본부", "자율형AI과학자연구단", "경영전략부"]);
  });
  test("과학AI본부 holds the platform group and the convergence group with their teams", () => {
    const hq = ORG.children[1];
    expect(hq.children.map((u) => u.name)).toEqual(["과학AI통합플랫폼운영단", "과학AI융합지원단"]);
    expect(hq.children[0].children.map((u) => u.name)).toEqual(["AI플랫폼팀", "AI자원팀", "AI보안팀"]);
    expect(hq.children[1].children.map((u) => u.name)).toEqual(["연구AX팀", "AI융합팀"]);
  });
  test("unique ids", () => {
    const all = flattenOrg(ORG);
    expect(new Set(all.map((u) => u.id)).size).toBe(all.length);
  });
  test("staff rows carry role, duties and office phone but never a person's name", () => {
    for (const u of flattenOrg(ORG)) for (const row of u.staff) {
      expect(Object.keys(row).sort()).toEqual(["duties", "phone", "role"]);
      expect(row.phone).toMatch(/^0(42|44)-28[78]-\d{4}$/);
      expect(row.duties.length).toBeGreaterThan(0);
    }
  });
  test("row counts match the NST page", () => {
    const by = (name: string) => flattenOrg(ORG).find((u) => u.name === name)!.staff.length;
    expect(by("K-문샷추진지원단")).toBe(11);
    expect(by("K-문샷추진지원팀")).toBe(16);
    expect(by("AI플랫폼팀")).toBe(5);
    expect(by("연구AX팀")).toBe(4);
    expect(by("경영지원팀")).toBe(4);
    expect(by("전략협력팀")).toBe(4);
  });
  test("units without published staff keep an empty table", () => {
    expect(flattenOrg(ORG).find((u) => u.name === "AI자원팀")!.staff).toEqual([]);
  });
});
