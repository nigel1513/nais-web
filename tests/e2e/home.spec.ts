import { expect, test } from "@playwright/test";

test("hero shows official slogan as h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("AI로 과학을, 과학으로 미래를");
});

test("all seven sections are labelled regions in order", async ({ page }) => {
  await page.goto("/");
  const ids = await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"]);
  for (const id of ids) await expect(page.locator(`#${id}`)).toHaveAttribute("aria-labelledby", `${id}-title`);
});

test("What We Do wording, no '4대 추진과제'", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("What We Do")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("4대 추진과제");
});

test("news lists three real items and careers CTA", async ({ page }) => {
  await page.goto("/");
  const items = page.locator("#news li");
  await expect(items).toHaveCount(3);
  await expect(page.getByRole("link", { name: /Join NAIS/ })).toHaveAttribute("href", "/careers/");
});

test("no horizontal overflow", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
