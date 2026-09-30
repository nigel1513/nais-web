import { chromium, expect, test } from "@playwright/test";

test("webgl-off: content readable, no canvas, no errors", async ({ baseURL }) => {
  const browser = await chromium.launch({ args: ["--disable-webgl", "--disable-webgl2", "--disable-gpu"] });
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(baseURL + "/");
  await expect(page.locator("html")).toHaveAttribute("data-webgl", "off");
  await expect(page.locator("canvas")).toHaveCount(0);
  for (const id of ["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"]) {
    await expect(page.locator(`#${id}-title`)).toBeVisible();
  }
  expect(errors).toEqual([]);
  await browser.close();
});

test("webgl1-only: renderer needs WebGL2, page must still render all content", async ({ baseURL }) => {
  const browser = await chromium.launch({ args: ["--disable-webgl2"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(baseURL + "/");
  await page.waitForTimeout(1500);
  for (const id of ["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"]) {
    await expect(page.locator(`#${id}-title`)).toBeVisible();
  }
  await expect(page.locator("html")).toHaveAttribute("data-webgl", "off");
  expect(errors).toEqual([]);
  await browser.close();
});

test("deep-link: /#moonshot resolves straight to state 4", async ({ page }) => {
  await page.goto("/#moonshot");
  await page.waitForTimeout(400);
  await expect(page.locator("html")).toHaveAttribute("data-particle-to", "4");
});

test("resize: 1440 → 390 keeps no overflow and re-measures", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator("#ecosystem").scrollIntoViewIfNeeded();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await page.locator("#ecosystem").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await expect(page.locator("html")).toHaveAttribute("data-particle-to", "5");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("reduced-motion: flagged and never mid-transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("#platform-title")).toBeVisible();
});
