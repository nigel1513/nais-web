import { expect, test } from "@playwright/test";

const ABOUT_PAGES = [
  { path: "/about/", title: "센터 소개" },
  { path: "/about/history/", title: "연혁" },
  { path: "/about/organization/", title: "조직도" },
  { path: "/about/contact/", title: "문의" },
];

for (const p of ABOUT_PAGES) {
  test(`${p.path} is its own page with the shared about menu`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.title);
    const nav = page.getByRole("navigation", { name: "센터 소개 메뉴" });
    for (const q of ABOUT_PAGES) await expect(nav.getByRole("link", { name: q.title, exact: true })).toHaveAttribute("href", q.path);
    await expect(nav.getByRole("link", { name: p.title, exact: true })).toHaveAttribute("aria-current", "page");
  });
}

test("history lists milestones only, no recruitment notices", async ({ page }) => {
  await page.goto("/about/history/");
  const items = page.locator("main ol li");
  expect(await items.count()).toBeGreaterThanOrEqual(6);
  await expect(page.locator("main")).toContainText("2026.05");
  await expect(page.locator("main")).not.toContainText("채용");
});

test("contact page shows the contact person", async ({ page }) => {
  await page.goto("/about/contact/");
  await expect(page.locator("main")).toContainText("ygyu@nst.re.kr");
});

test("organization lives at /about/organization as a centered top-down chart", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about/organization/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("조직도");
  const chart = page.locator("#organization");
  const root = await chart.getByRole("button", { name: "국가과학AI연구센터", exact: true }).boundingBox();
  const wrap = await chart.boundingBox();
  expect(Math.abs(root!.x + root!.width / 2 - (wrap!.x + wrap!.width / 2))).toBeLessThan(40);
  const branches = await Promise.all(["K-문샷추진지원단", "과학AI본부", "자율형AI과학자연구단", "경영전략부"].map((n) => chart.getByRole("button", { name: n, exact: true }).boundingBox()));
  const ys = branches.map((b) => Math.round(b!.y));
  expect(Math.max(...ys) - Math.min(...ys)).toBeLessThan(4);
  expect(ys[0]).toBeGreaterThan(root!.y);
});

test("research: four areas with anchors and official duties", async ({ page }) => {
  await page.goto("/research/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("연구");
  for (const id of ["platform", "convergence", "autonomous", "moonshot"]) await expect(page.locator(`#${id} h2`)).toBeVisible();
  await expect(page.locator("#platform")).toContainText("AI-OS 설계 및 구축");
  await expect(page.locator("#moonshot")).toContainText("반도체");
  await expect(page.locator("#moonshot")).toContainText("첨단바이오");
});

test("programs: Seed program and hackathon with dates and status", async ({ page }) => {
  await page.goto("/programs/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("사업");
  await expect(page.locator("#seed")).toContainText("2억 원");
  await expect(page.locator("#seed")).toContainText("10.20");
  await expect(page.locator("#hackathon")).toContainText("성과 작성·연구행정");
});

test("news: filter by category and open a detail page with its source", async ({ page }) => {
  await page.goto("/news/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("소식");
  const items = page.locator("#news-list article");
  const all = await items.count();
  expect(all).toBeGreaterThanOrEqual(4);
  await page.getByRole("tab", { name: "채용" }).click();
  await expect(items).toHaveCount(1);
  await page.getByRole("tab", { name: "전체" }).click();
  await expect(items).toHaveCount(all);
  await items.first().getByRole("link").first().click();
  await expect(page).toHaveURL(/\/news\/[a-z0-9-]+\/$/);
  await expect(page.getByRole("link", { name: /출처/ })).toHaveAttribute("target", "_blank");
});

test("privacy page and sitemap", async ({ page, request }) => {
  const res = await page.goto("/privacy/");
  expect(res?.status()).toBe(200);
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("<urlset");
  for (const p of ["/about/", "/about/history/", "/about/organization/", "/about/contact/", "/research/", "/programs/", "/news/"]) expect(xml).toContain(p);
});
