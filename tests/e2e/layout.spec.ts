import { expect, test } from "@playwright/test";

test("skip link moves focus to main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "본문 바로가기" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("footer states affiliation once and no unofficial label", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer).toContainText("국가과학기술연구회 국가과학AI연구센터");
  await expect(page.locator("body")).not.toContainText(/unofficial/i);
});

test("header navigation lists five sections", async ({ page, isMobile }) => {
  test.skip(isMobile, "모바일은 축약 메뉴");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "주 메뉴" });
  for (const name of ["About", "Research", "Programs", "News", "Careers"]) {
    await expect(nav.getByRole("link", { name })).toBeVisible();
  }
});

test("home loads without console errors (e.g. prefetch 404s)", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

test("footer shows the contact person and the NST family site", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer).toContainText("유용균");
  await expect(footer.getByRole("link", { name: "ygyu@nst.re.kr" })).toHaveAttribute("href", "mailto:ygyu@nst.re.kr");
  const family = footer.getByRole("link", { name: /국가과학기술연구회/ });
  await expect(family).toHaveAttribute("href", "https://www.nst.re.kr/");
  await expect(family).toHaveAttribute("target", "_blank");
});
