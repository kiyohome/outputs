import { test, expect } from "@playwright/test";

test.describe("front-page sections", () => {
  test("all 8 sections present", async ({ page }) => {
    await page.goto("/");
    const ids = ["fv", "works", "voice", "service", "cta", "profile", "flow", "contact"];
    for (const id of ids) {
      await expect(
        page.locator(`#${id}`),
        `section #${id} should exist`
      ).toBeAttached();
    }
  });

  test("sec02 shows exactly 2 work cards", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator(".sec-works .work-card");
    await expect(cards).toHaveCount(2);
  });

  test("sec02 work cards have required elements", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(".sec-works .work-card").first();
    await expect(card.locator(".work-card-title a").first()).toBeVisible();
    await expect(card.locator(".work-card-pills")).toBeVisible();
    await expect(card.locator(".work-card-image img")).toBeVisible();
  });
});

test.describe("archive-works content", () => {
  test("breadcrumb shows correct text", async ({ page }) => {
    await page.goto("/works/");
    await expect(page.locator(".breadcrumb")).toContainText("HOME");
    await expect(page.locator(".breadcrumb")).toContainText("制作実績一覧");
  });

  test("h1 is 制作実績一覧", async ({ page }) => {
    await page.goto("/works/");
    await expect(page.locator("h1")).toHaveText("制作実績一覧");
  });

  test("work cards have category_label, client_name, image", async ({
    page,
  }) => {
    await page.goto("/works/");
    const cards = page.locator(".work-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = cards.nth(i);
      await expect(
        card.locator(".work-card-title a").first(),
        `card ${i}: title link`
      ).toBeVisible();
      await expect(
        card.locator(".work-card-arrow-link"),
        `card ${i}: arrow link`
      ).toBeVisible();
      await expect(
        card.locator(".work-card-image a img"),
        `card ${i}: thumbnail image link`
      ).toBeVisible();
      const imgSrc = await card
        .locator(".work-card-image img")
        .getAttribute("src");
      expect(imgSrc, `card ${i}: image src not empty`).toBeTruthy();
    }
  });

  test("bottom CTA exists and links to /#contact", async ({ page }) => {
    await page.goto("/works/");
    const cta = page.locator(".page-cta__link");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/#contact");
    await expect(cta).toContainText("ご相談・お問合せはこちら");
  });
});

test.describe("single-works content", () => {
  test("shows breadcrumb with post title", async ({ page }) => {
    await page.goto("/works/");
    await page.locator(".work-card-title a").first().click();
    const breadcrumb = page.locator(".breadcrumb");
    await expect(breadcrumb).toContainText("HOME");
    await expect(breadcrumb).toContainText("制作実績一覧");
    const current = page.locator(".breadcrumb__current");
    await expect(current).toBeVisible();
    const text = await current.textContent();
    expect(text!.trim().length, "breadcrumb current segment should not be empty").toBeGreaterThan(0);
  });

  test("shows client_name and category_label", async ({ page }) => {
    await page.goto("/works/");
    await page.locator(".work-card-title a").first().click();
    await expect(page.locator(".single-works-card__client")).toBeVisible();
    await expect(page.locator(".single-works-card__label")).toBeVisible();
  });

  test("has post content", async ({ page }) => {
    await page.goto("/works/");
    await page.locator(".work-card-title a").first().click();
    const content = page.locator(".entry-content, .wp-block-post-content");
    await expect(content).toBeVisible();
    const text = await content.textContent();
    expect(text!.trim().length).toBeGreaterThan(0);
  });

  test("bottom CTA exists and links to /#contact", async ({ page }) => {
    await page.goto("/works/");
    await page.locator(".work-card-title a").first().click();
    const cta = page.locator(".page-cta__link");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/#contact");
  });
});
