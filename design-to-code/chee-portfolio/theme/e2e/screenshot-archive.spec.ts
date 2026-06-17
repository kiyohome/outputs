import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const outDir = path.join(__dirname, "screenshots/task12");

test.beforeAll(() => {
  fs.mkdirSync(outDir, { recursive: true });
});

test("archive-works full screenshot", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: path.join(outDir, "archive-full.png"),
    fullPage: true,
  });
});

test("archive-works header", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");
  const header = page.locator("header").first();
  await header.screenshot({ path: path.join(outDir, "archive-header.png") });
});

test("archive-works page title area", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: path.join(outDir, "archive-page-title.png"),
    clip: { x: 0, y: 82, width: 1440, height: 220 },
  });
});

test("archive-works cards", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");
  // card area after page title
  await page.screenshot({
    path: path.join(outDir, "archive-cards.png"),
    clip: { x: 0, y: 300, width: 1440, height: 3000 },
    fullPage: false,
  });
});

test("archive-works footer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");
  const footer = page.locator("footer").first();
  await footer.screenshot({ path: path.join(outDir, "archive-footer.png") });
});

test("archive-works CSS check", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");

  const results = await page.evaluate(() => {
    const data: Record<string, string> = {};

    // Header
    const header = document.querySelector("header");
    if (header) {
      data["header_height"] = getComputedStyle(header).height;
      data["header_bg"] = getComputedStyle(header).backgroundColor;
    }

    // Page title area
    const pageTitleArea = document.querySelector(".page-title-area, .archive-header, .wp-block-cover");
    if (pageTitleArea) {
      data["page_title_bg"] = getComputedStyle(pageTitleArea).backgroundColor;
      data["page_title_height"] = getComputedStyle(pageTitleArea).height;
    }

    // h1
    const h1 = document.querySelector("h1");
    if (h1) {
      const cs = getComputedStyle(h1);
      data["h1_font_size"] = cs.fontSize;
      data["h1_font_weight"] = cs.fontWeight;
      data["h1_text"] = h1.textContent?.trim() || "";
    }

    // Cards
    const cards = document.querySelectorAll(".works-card, .entry-card, article");
    data["card_count"] = String(cards.length);
    if (cards.length > 0) {
      const card = cards[0] as HTMLElement;
      const cs = getComputedStyle(card);
      data["card_0_width"] = cs.width;
    }

    // Category label
    const catLabel = document.querySelector(".category-label, .works-category");
    if (catLabel) {
      const cs = getComputedStyle(catLabel);
      data["cat_label_font_size"] = cs.fontSize;
      data["cat_label_font_weight"] = cs.fontWeight;
      data["cat_label_text"] = catLabel.textContent?.trim() || "";
    }

    // Pills
    const pill = document.querySelector(".pill, .tag, .wp-block-tag");
    if (pill) {
      const cs = getComputedStyle(pill);
      data["pill_bg"] = cs.backgroundColor;
      data["pill_color"] = cs.color;
      data["pill_font_size"] = cs.fontSize;
      data["pill_font_weight"] = cs.fontWeight;
      data["pill_padding"] = cs.padding;
      data["pill_radius"] = cs.borderRadius;
    }

    // Arrow icon
    const arrow = document.querySelector(".arrow, .works-arrow, .card-arrow");
    if (arrow) {
      data["arrow_color"] = getComputedStyle(arrow).color;
    }

    // Thumbnail image
    const thumb = document.querySelector(".works-thumbnail img, .card-thumbnail img, article img");
    if (thumb) {
      const cs = getComputedStyle(thumb);
      data["thumb_height"] = cs.height;
    }

    // CTA button
    const ctaBtn = document.querySelector(".cta-button, .contact-cta, a[href*='contact']");
    if (ctaBtn) {
      const cs = getComputedStyle(ctaBtn);
      data["cta_bg"] = cs.backgroundColor;
      data["cta_color"] = cs.color;
      data["cta_text"] = (ctaBtn as HTMLElement).textContent?.trim() || "";
    }

    // Breadcrumb
    const breadcrumb = document.querySelector(".breadcrumb, nav[aria-label*='breadcrumb'], .wp-block-breadcrumbs");
    if (breadcrumb) {
      data["breadcrumb_text"] = breadcrumb.textContent?.trim() || "";
      const cs = getComputedStyle(breadcrumb);
      data["breadcrumb_font_size"] = cs.fontSize;
    }

    return data;
  });

  console.log("CSS check results:", JSON.stringify(results, null, 2));

  // Save to file
  const fs = await import("fs");
  const path = await import("path");
  fs.writeFileSync(
    path.join(__dirname, "screenshots/task12/archive-css-check.json"),
    JSON.stringify(results, null, 2)
  );
});
