import { test, expect } from "@playwright/test";

test.describe("header navigation (top page)", () => {
  test("all header nav links point to top-page anchors", async ({ page }) => {
    await page.goto("/");
    const expected: Record<string, string> = {
      Home: "/",
      Works: "/#works",
      Voice: "/#voice",
      Service: "/#service",
      Profile: "/#profile",
    };
    for (const [label, href] of Object.entries(expected)) {
      const link = page.locator("header a.wp-block-navigation-item__content", {
        hasText: label,
      });
      await expect(link, `"${label}" link should exist`).toBeVisible();
      const actual = await link.getAttribute("href");
      expect(actual, `"${label}" href`).toBe(href);
    }
  });

  test("Contact button links to /#contact", async ({ page }) => {
    await page.goto("/");
    const btn = page.locator("header .wp-block-button__link");
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute("href", "/#contact");
  });

  test("Works link is NOT /works/ (must be /#works)", async ({ page }) => {
    await page.goto("/");
    const link = page.locator("header a.wp-block-navigation-item__content", {
      hasText: "Works",
    });
    const href = await link.getAttribute("href");
    expect(href).not.toBe("/works/");
    expect(href).toBe("/#works");
  });
});

test.describe("footer navigation", () => {
  test("footer nav links have correct hrefs", async ({ page }) => {
    await page.goto("/");
    const expected: Record<string, string> = {
      ホーム: "/",
      制作実績: "/works/",
      "お客様の声": "/#voice",
      サービス: "/#service",
      プロフィール: "/#profile",
      お問合せ: "/#contact",
    };
    for (const [label, href] of Object.entries(expected)) {
      const link = page.locator(
        ".footer-nav a.wp-block-navigation-item__content",
        { hasText: label }
      );
      await expect(link, `footer "${label}" link`).toBeVisible();
      const actual = await link.getAttribute("href");
      expect(actual, `footer "${label}" href`).toBe(href);
    }
  });
});

test.describe("sec02 → transitions", () => {
  test("work card links go to single-works detail page", async ({ page }) => {
    await page.goto("/");
    const card = page.locator(".sec-works .work-card-title a").first();
    await expect(card).toBeVisible();
    const href = await card.getAttribute("href");
    expect(href).toMatch(/^https?:\/\/[^/]+\/works\/.+\/$/);
  });

  test('"制作実績の一覧へ" links to /works/', async ({ page }) => {
    await page.goto("/");
    const link = page.locator('.works-more-link');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/works/");
  });
});

test.describe("archive-works → single-works transition", () => {
  test("clicking archive card navigates to detail page", async ({ page }) => {
    await page.goto("/works/");
    const card = page.locator(".work-card-title a").first();
    await card.click();
    await expect(page).toHaveURL(/\/works\/.+\//);
    await expect(page.locator(".breadcrumb")).toContainText("HOME");
    await expect(page.locator(".breadcrumb")).toContainText("制作実績一覧");
    const segments = page.locator(".breadcrumb__current");
    await expect(segments).toBeVisible();
  });
});

test.describe("breadcrumb links", () => {
  test("archive breadcrumb: HOME links to /", async ({ page }) => {
    await page.goto("/works/");
    const homeLink = page.locator(".breadcrumb a").first();
    await expect(homeLink).toHaveText("HOME");
    await expect(homeLink).toHaveAttribute("href", "/");
  });

  test("single breadcrumb: 制作実績一覧 links to /works/", async ({
    page,
  }) => {
    await page.goto("/works/");
    await page.locator(".work-card-title a").first().click();
    const links = page.locator(".breadcrumb a");
    const archiveLink = links.nth(1);
    await expect(archiveLink).toHaveText("制作実績一覧");
    await expect(archiveLink).toHaveAttribute("href", "/works/");
  });
});
