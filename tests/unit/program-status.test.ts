import { describe, expect, test } from "vitest";
import { PROGRAMS, programStatus } from "@/content/pages";

const seed = PROGRAMS.find((p) => p.id === "seed")!;
const hack = PROGRAMS.find((p) => p.id === "hackathon")!;
const kst = (s: string) => new Date(`${s}+09:00`);

describe("programStatus follows the viewer's current time (KST boundaries)", () => {
  test("before the call opens → 예정", () => expect(programStatus(seed, kst("2026-09-28T23:59:00"))).toBe("예정"));
  test("opening moment → 진행 중", () => expect(programStatus(seed, kst("2026-09-29T00:00:00"))).toBe("진행 중"));
  test("deadline day before 18:00 → 진행 중", () => expect(programStatus(seed, kst("2026-10-20T17:59:00"))).toBe("진행 중"));
  test("after 18:00 on the deadline → 마감", () => expect(programStatus(seed, kst("2026-10-20T18:00:01"))).toBe("마감"));
  test("hackathon closes after its last day", () => {
    expect(programStatus(hack, kst("2026-10-01T23:00:00"))).toBe("진행 중");
    expect(programStatus(hack, kst("2026-10-02T00:00:01"))).toBe("마감");
  });
  test("closed programs stay listed", () => expect(PROGRAMS.map((p) => p.id)).toEqual(["seed", "hackathon"]));
  test("no fixed default date: the caller must pass now", () => expect(programStatus.length).toBe(2));
});
