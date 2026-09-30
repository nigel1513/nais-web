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


test("03 autonomous shows only animated English stages", async ({ page }) => {
  await page.goto("/");
  const stages = page.locator('#autonomous ol[aria-label="Research loop"] li');
  await expect(stages).toHaveText(["Question", "Search", "Hypothesis", "Experiment", "Analysis", "Learning"]);
  await expect(page.locator("#autonomous")).not.toContainText("→");
  await page.waitForTimeout(1500);
  await expect(page.locator('#autonomous ol[aria-label="Research loop"] li.text-cyan')).toHaveCount(1);
});

test("no placeholder wording anywhere on home or organization", async ({ page }) => {
  for (const path of ["/", "/about/", "/about/organization/", "/research/", "/programs/", "/news/"]) {
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

test("institute logos close the page after the news, with no Next Steps band", async ({ page }) => {
  await page.goto("/");
  const top = (sel: string) => page.locator(sel).evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  expect(await top("#institutes")).toBeGreaterThan(await top("#news"));
  await expect(page.locator("#next-steps")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText("Next Steps");
});

test("ecosystem list uses the same official names and order as the institute CI list", async ({ page }) => {
  await page.goto("/");
  const names = await page.locator('#ecosystem ul[aria-label="소관 연구기관 25곳"] li').allTextContents();
  const alts = await page.locator("#institutes img").evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt")));
  expect(names).toHaveLength(25);
  expect(names).toEqual(alts);
  const right = await page.locator('#ecosystem ul[aria-label="소관 연구기관 25곳"]').evaluate((el) => el.getBoundingClientRect().right);
  expect(right).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
});

test("every careers link goes to the NST recruitment site in a new tab", async ({ page, isMobile }) => {
  await page.goto("/");
  const links = [page.locator("footer").getByRole("link", { name: "채용 안내" })];
  if (!isMobile) links.push(page.getByRole("navigation", { name: "주 메뉴" }).getByRole("link", { name: "Careers" }));
  for (const l of links) {
    await expect(l).toHaveAttribute("href", "https://nst.fairy.im/");
    await expect(l).toHaveAttribute("target", "_blank");
  }
  // 소식의 채용 공고는 상세 페이지를 거쳐 채용 사이트로 이어진다
  await page.goto("/news/recruit-3rd/");
  const go = page.getByRole("link", { name: "채용 사이트 바로가기" });
  await expect(go).toHaveAttribute("href", "https://nst.fairy.im/");
  await expect(go).toHaveAttribute("target", "_blank");
});
