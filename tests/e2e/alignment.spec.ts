import { expect, test } from "@playwright/test";

/** 헤더·본문·띠·푸터의 왼쪽 기준선이 모두 같아야 한다. */
const LEFT_EDGES = [
  "header a[aria-label*='홈']",
  "#hero .eyebrow",
  "#platform .eyebrow",
  "#news .eyebrow",
  "#institutes .eyebrow",
  "#next-steps .eyebrow",
  "footer .wordmark",
];

for (const width of [1440, 1024, 390]) {
  test(`home shares one left edge at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const xs: number[] = [];
    for (const sel of LEFT_EDGES) xs.push(await page.locator(sel).first().evaluate((el) => Math.round(el.getBoundingClientRect().left)));
    expect(new Set(xs).size, `left edges: ${xs.join(", ")}`).toBe(1);
  });
}

test("organization page shares the same left edge as the header", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about/");
  const header = await page.locator("header a[aria-label*='홈']").evaluate((el) => Math.round(el.getBoundingClientRect().left));
  const title = await page.locator("#organization .eyebrow").evaluate((el) => Math.round(el.getBoundingClientRect().left));
  expect(title).toBe(header);
});
