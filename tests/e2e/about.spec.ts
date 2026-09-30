import { expect, test } from "@playwright/test";

test("organization page is chart-first with no slogan or vision block", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("조직도");
  const main = page.locator("main");
  await expect(main).not.toContainText("AI로 과학을, 과학으로 미래를");
  await expect(main).not.toContainText("모든 연구자가 하나의 연구소가 되는");
  for (const name of ["국가과학AI연구센터", "K-문샷추진지원단", "과학AI본부", "자율형AI과학자연구단", "경영전략부", "연구AX팀", "AI과학자팀"]) {
    await expect(page.locator("#organization").getByText(name, { exact: true }).first()).toBeVisible();
  }
});

test("a unit in the chart links to its staff table (role, duties, phone; no names)", async ({ page }) => {
  await page.goto("/about/");
  await page.locator("#organization").getByRole("link", { name: "연구AX팀", exact: true }).click();
  await expect(page).toHaveURL(/#unit-ax-team$/);
  const table = page.locator("#unit-ax-team table");
  await expect(table).toBeVisible();
  for (const h of ["직위", "담당업무", "전화"]) await expect(table.getByRole("columnheader", { name: h })).toBeVisible();
  await expect(table).toContainText("자율실험실 확산계획 수립 및 실행");
  await expect(table).toContainText("042-288-7291");
  await expect(page.locator("main")).not.toContainText("김덕환");
});

test("units without published staff are shown but not linked", async ({ page }) => {
  await page.goto("/about/");
  const chart = page.locator("#organization");
  await expect(chart.getByText("AI자원팀", { exact: true })).toBeVisible();
  await expect(chart.getByRole("link", { name: "AI자원팀", exact: true })).toHaveCount(0);
});

test("deep link to the chart", async ({ page }) => {
  await page.goto("/about/#organization");
  await expect(page.locator("#organization")).toBeInViewport();
});
