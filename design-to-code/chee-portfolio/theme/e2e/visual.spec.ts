import { test, expect } from "@playwright/test";

test.describe("visual regression — PC (1440px)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("home full page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-full-pc.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  // FV excluded: Splide auto-scroll carousel never stabilizes for pixel comparison.
  // FV is covered by the full-page screenshot test above.
  for (const id of ["works", "voice", "service", "cta", "profile", "flow", "contact"]) {
    test(`section #${id}`, async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const el = page.locator(`#${id}`);
      await expect(el).toBeAttached();
      await expect(el).toHaveScreenshot(`sec-${id}-pc.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });
  }

  test("archive-works page", async ({ page }) => {
    await page.goto("/works/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("archive-works-pc.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test("single-works page", async ({ page }) => {
    await page.goto("/works/");
    await page.locator(".work-card-title a").first().click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("single-works-pc.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});

test.describe("visual regression — mobile (375px)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("home full page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("home-full-mobile.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  test("archive-works page", async ({ page }) => {
    await page.goto("/works/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("archive-works-mobile.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
