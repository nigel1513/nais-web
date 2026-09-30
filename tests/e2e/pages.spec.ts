import { expect, test } from "@playwright/test";

for (const [path, title] of [["/about/", "About"], ["/research/", "Research"], ["/programs/", "Programs"], ["/news/", "News"], ["/careers/", "Careers"]]) {
  test(`${path} renders coming-soon page`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.getByRole("link", { name: "홈으로" })).toHaveAttribute("href", "/");
  });
}

test("sitemap lists home and five pages", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain("<urlset");
  for (const p of ["/about/", "/research/", "/programs/", "/news/", "/careers/"]) expect(xml).toContain(p);
});
