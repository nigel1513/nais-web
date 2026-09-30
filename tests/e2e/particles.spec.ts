import { expect, test } from "@playwright/test";

test("canvas mounts and scroll advances particle state", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator("html")).toHaveAttribute("data-particle-to", "0");
  await page.locator("#autonomous").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await expect(page.locator("html")).toHaveAttribute("data-particle-to", "3");
  expect(errors).toEqual([]);
});
