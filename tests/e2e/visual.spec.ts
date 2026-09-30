import { test } from "@playwright/test";
const IDS = ["hero", "platform", "convergence", "autonomous", "moonshot", "ecosystem", "news"];
test("section screenshots", async ({ page }, info) => {
  await page.goto("/");
  for (const id of IDS) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `test-results/visual/${info.project.name}-${id}.png` });
  }
});
