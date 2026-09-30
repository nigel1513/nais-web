import { expect, test } from "@playwright/test";

test("during the call: programs and home show it as open", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-05T10:00:00+09:00"));
  await page.goto("/programs/");
  await expect(page.locator("#seed [data-status]")).toHaveText("진행 중");
  await page.goto("/");
  await expect(page.locator("#convergence [data-status]")).toHaveText("모집 중");
});

test("after the deadline: status flips to 마감 and the program stays listed", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-21T09:00:00+09:00"));
  await page.goto("/programs/");
  await expect(page.locator("#seed [data-status]")).toHaveText("마감");
  await expect(page.locator("#hackathon [data-status]")).toHaveText("마감");
  await expect(page.locator("#seed h2")).toBeVisible();
  await page.goto("/");
  await expect(page.locator("#convergence [data-status]")).toHaveText("모집 마감");
});

test("before opening: 예정", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-20T09:00:00+09:00"));
  await page.goto("/programs/");
  await expect(page.locator("#seed [data-status]")).toHaveText("예정");
});

test("programs page no longer shows source links", async ({ page }) => {
  await page.goto("/programs/");
  await expect(page.locator("main")).not.toContainText("출처");
});
