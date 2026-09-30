import { expect, test } from "@playwright/test";

test("canvas mounts and scroll advances particle state", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-particle-to", "0");
  await page.locator("#autonomous").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await expect(page.locator("html")).toHaveAttribute("data-particle-to", "3");
  // 3D는 지연 로드된다(데스크톱: 유휴 시점, 모바일: 첫 스크롤 후)
  await expect(page.locator("canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("mobile defers 3D until the first scroll", async ({ page, isMobile }) => {
  test.skip(!isMobile, "모바일 전용 동작");
  await page.goto("/");
  await page.waitForTimeout(1000);
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.mouse.wheel(0, 400);
  await expect(page.locator("canvas")).toHaveCount(1);
});
