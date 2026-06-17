import { test, expect } from "@playwright/test";

test("archive arrow click navigates to detail", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");

  const arrowLink = page.locator(".work-card-arrow-link").first();
  await arrowLink.click();
  await page.waitForLoadState("networkidle");
  expect(page.url()).toMatch(/\/works\/.+/);
});

test("archive thumbnail click navigates to detail", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");

  const thumbLink = page.locator(".work-card-image a").first();
  await thumbLink.click();
  await page.waitForLoadState("networkidle");
  expect(page.url()).toMatch(/\/works\/.+/);
});
