import { expect, test } from "@playwright/test";

test("organization page shows only the chart until a unit is chosen", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("조직도");
  await expect(page.locator("main")).not.toContainText("AI로 과학을, 과학으로 미래를");
  await expect(page.locator("main table")).toHaveCount(0);
  for (const name of ["국가과학AI연구센터", "K-문샷추진지원단", "과학AI본부", "자율형AI과학자연구단", "경영전략부", "연구AX팀", "AI과학자팀", "AI자원팀"]) {
    await expect(page.locator("#organization").getByRole("button", { name, exact: true })).toBeVisible();
  }
});

test("choosing a team opens its staff table (role, duties, phone; no names)", async ({ page }) => {
  await page.goto("/about/");
  const btn = page.locator("#organization").getByRole("button", { name: "연구AX팀", exact: true });
  await btn.click();
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  await expect(page).toHaveURL(/#unit-ax-team$/);
  const table = page.locator("#unit-panel table");
  for (const h of ["직위", "담당업무", "전화"]) await expect(table.getByRole("columnheader", { name: h })).toBeVisible();
  await expect(table).toContainText("자율실험실 확산계획 수립 및 실행");
  await expect(table).toContainText("042-288-7291");
  await expect(page.locator("main")).not.toContainText("김덕환");
  await expect(page.locator("main table")).toHaveCount(1);
});

test("a unit without published staff opens its name and parent, without a table", async ({ page }) => {
  await page.goto("/about/");
  await page.locator("#organization").getByRole("button", { name: "AI자원팀", exact: true }).click();
  await expect(page.locator("#unit-panel h2")).toHaveText("AI자원팀");
  await expect(page.locator("#unit-panel")).toContainText("과학AI통합플랫폼운영단");
  await expect(page.locator("main table")).toHaveCount(0);
});

test("deep link opens that unit's panel", async ({ page }) => {
  await page.goto("/about/#unit-platform-team");
  await expect(page.locator("#unit-panel")).toContainText("AI-OS 설계 및 구축");
});

test("closing the panel returns to the chart only", async ({ page }) => {
  await page.goto("/about/#unit-ax-team");
  await page.getByRole("button", { name: "닫기" }).click();
  await expect(page.locator("main table")).toHaveCount(0);
});

test("organization page has no dated source note", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator("main")).not.toContainText("2026년 9월 기준");
});
