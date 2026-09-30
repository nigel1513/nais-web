import { expect, test } from "@playwright/test";

test("sections use editorial lists, not bordered card grids", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main li.rounded-lg")).toHaveCount(0);
  await expect(page.locator("#platform ol > li")).toHaveCount(5);
});

test("K-Moonshot lists official mission names", async ({ page }) => {
  await page.goto("/");
  const list = page.locator("#moonshot ol");
  for (const m of ["AI과학자", "반도체", "신약", "휴머노이드", "BCI"]) await expect(list).toContainText(m);
});

test("next-steps band links to careers, programs and the org chart", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /조직도 보기/ })).toHaveAttribute("href", "/about/");
  await expect(page.getByRole("link", { name: "사업 공고 보기" })).toHaveAttribute("href", "/programs/");
  await expect(page.locator("#convergence").getByRole("link", { name: "Seed형 공모 안내" })).toHaveAttribute("href", "/programs/");
});

test("mobile menu exposes every section", async ({ page, isMobile }) => {
  test.skip(!isMobile, "모바일 전용");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "메뉴 열기" });
  await toggle.click();
  await expect(page.getByRole("button", { name: "메뉴 닫기" })).toHaveAttribute("aria-expanded", "true");
  const menu = page.getByRole("navigation", { name: "모바일 메뉴" });
  for (const name of ["About", "Research", "Programs", "News", "Careers"]) await expect(menu.getByRole("link", { name })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("home has no owner lines, vertical bars or row dividers", async ({ page }) => {
  await page.goto("/");
  const main = page.locator("main");
  await expect(main).not.toContainText("담당");
  await expect(main.locator('[class*="border-l"]')).toHaveCount(0);
  await expect(main.locator('li[class*="border-b"], article[class*="border-b"], div[class*="border-b"]')).toHaveCount(0);
});

test("section titles are split into animated words", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("#platform-title [data-word]").count()).toBeGreaterThan(2);
  await expect(page.locator("#platform-title")).toHaveAccessibleName("과학 AI를 위한 하나의 공통 기반");
});

test("seed facts count up to their final values", async ({ page }) => {
  await page.goto("/");
  await page.locator("#convergence").scrollIntoViewIfNeeded();
  const values = page.locator("#convergence [data-countup]");
  await expect(values).toHaveCount(2); // 날짜(10.20)는 카운트업하지 않는다
  await expect(values.nth(0)).toHaveText("2", { timeout: 4000 });
  await expect(values.nth(1)).toHaveText("15", { timeout: 4000 });
});

test("ecosystem lists the 25 institute CIs instead of a text marquee", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#ecosystem [data-marquee]")).toHaveCount(0);
  const logos = page.locator("#institutes img");
  await expect(logos).toHaveCount(25);
  await expect(page.locator('#institutes img[alt="한국원자력연구원"]')).toHaveCount(1);
});

test("next steps sit on their own solid band, not over the sphere", async ({ page }) => {
  await page.goto("/");
  const bg = await page.locator("#next-steps").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe("rgba(0, 0, 0, 0)");
});

test("03 autonomous shows only animated English stages", async ({ page }) => {
  await page.goto("/");
  const stages = page.locator('#autonomous ol[aria-label="Research loop"] li');
  await expect(stages).toHaveText(["Question", "Search", "Hypothesis", "Experiment", "Analysis", "Learning"]);
  await expect(page.locator("#autonomous")).not.toContainText("→");
  await page.waitForTimeout(1500);
  await expect(page.locator('#autonomous ol[aria-label="Research loop"] li.text-cyan')).toHaveCount(1);
});

test("no placeholder wording anywhere on home or organization", async ({ page }) => {
  for (const path of ["/", "/about/"]) {
    await page.goto(path);
    await expect(page.locator("main")).not.toContainText(/명칭 확인 중|구성 중|공개되지 않았|준비 중/);
  }
});

test("institute CI list has a real section heading", async ({ page }) => {
  await page.goto("/");
  const h = page.locator("#institutes h2");
  await expect(h).toHaveText("소관 연구기관");
  const size = await h.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(28);
});

test("institute CIs render with a consistent optical size", async ({ page }) => {
  await page.goto("/");
  await page.locator("#institutes").scrollIntoViewIfNeeded();
  const areas = await page.locator("#institutes img").evaluateAll((imgs) =>
    imgs.map((i) => { const r = i.getBoundingClientRect(); return r.width * r.height; }));
  expect(areas).toHaveLength(25);
  expect(Math.max(...areas) / Math.min(...areas)).toBeLessThan(1.8);
});

test("institute logos sit after the news and before next steps", async ({ page }) => {
  await page.goto("/");
  const top = (sel: string) => page.locator(sel).evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const [news, inst, next] = [await top("#news"), await top("#institutes"), await top("#next-steps")];
  expect(inst).toBeGreaterThan(news);
  expect(next).toBeGreaterThan(inst);
});
