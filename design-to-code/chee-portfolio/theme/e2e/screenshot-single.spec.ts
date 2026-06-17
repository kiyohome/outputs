import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const outDir = path.join(__dirname, "screenshots/task12");

test.beforeAll(() => {
  fs.mkdirSync(outDir, { recursive: true });
});

async function getSingleWorksUrl(page: import("@playwright/test").Page): Promise<string> {
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");
  // Get the first works post link
  const link = page.locator("article a, .works-card a, a[href*='/works/']").first();
  const href = await link.getAttribute("href");
  return href || "/works/pojijob/";
}

test("single-works full screenshot", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const url = await getSingleWorksUrl(page);
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: path.join(outDir, "single-full.png"),
    fullPage: true,
  });
});

test("single-works header", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const url = await getSingleWorksUrl(page);
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  const header = page.locator("header").first();
  await header.screenshot({ path: path.join(outDir, "single-header.png") });
});

test("single-works page title area", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const url = await getSingleWorksUrl(page);
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: path.join(outDir, "single-page-title.png"),
    clip: { x: 0, y: 82, width: 1440, height: 220 },
  });
});

test("single-works content area", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const url = await getSingleWorksUrl(page);
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: path.join(outDir, "single-content.png"),
    clip: { x: 0, y: 300, width: 1440, height: 3000 },
    fullPage: false,
  });
});

test("single-works CSS check", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const url = await getSingleWorksUrl(page);
  await page.goto(url);
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
    const pageTitleArea = document.querySelector(".page-title-area, .single-page-header, .wp-block-cover");
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

    // Breadcrumb
    const breadcrumb = document.querySelector(".breadcrumb, nav[aria-label*='breadcrumb'], .breadcrumbs");
    if (breadcrumb) {
      data["breadcrumb_text"] = breadcrumb.textContent?.trim() || "";
      const bcs = getComputedStyle(breadcrumb);
      data["breadcrumb_font_size"] = bcs.fontSize;
    }

    // Main visual image
    const mainVisual = document.querySelector(".single-works-hero img, .works-hero img, .entry-thumbnail img, article .wp-block-image img");
    if (mainVisual) {
      const cs = getComputedStyle(mainVisual);
      data["main_visual_width"] = cs.width;
      data["main_visual_height"] = cs.height;
    }

    // Blue border line
    const border = document.querySelector(".works-border, .content-border, hr");
    if (border) {
      const cs = getComputedStyle(border);
      data["border_color"] = cs.borderColor || cs.backgroundColor;
    }

    // Category label
    const catLabel = document.querySelector(".category-label, .works-category, .single-category");
    if (catLabel) {
      const cs = getComputedStyle(catLabel);
      data["cat_label_font_size"] = cs.fontSize;
      data["cat_label_font_weight"] = cs.fontWeight;
      data["cat_label_text"] = catLabel.textContent?.trim() || "";
    }

    // Client name
    const clientName = document.querySelector(".client-name, .works-client");
    if (clientName) {
      const cs = getComputedStyle(clientName);
      data["client_name_font_size"] = cs.fontSize;
      data["client_name_font_weight"] = cs.fontWeight;
    }

    // Section headings (目的/担当範囲/etc)
    const sectionHeadings = document.querySelectorAll(".works-section-title, .entry-content h3, .entry-content h4");
    if (sectionHeadings.length > 0) {
      const cs = getComputedStyle(sectionHeadings[0]);
      data["section_heading_font_size"] = cs.fontSize;
      data["section_heading_font_weight"] = cs.fontWeight;
      data["section_heading_count"] = String(sectionHeadings.length);
    }

    // Blue square before section title
    const sectionTitle = document.querySelector(".works-section-title, .entry-content h3");
    if (sectionTitle) {
      const before = window.getComputedStyle(sectionTitle, "::before");
      data["before_content"] = before.content;
      data["before_bg"] = before.backgroundColor;
      data["before_width"] = before.width;
      data["before_height"] = before.height;
    }

    // Body text
    const bodyText = document.querySelector(".entry-content p, .works-description");
    if (bodyText) {
      const cs = getComputedStyle(bodyText);
      data["body_text_font_size"] = cs.fontSize;
      data["body_text_font_weight"] = cs.fontWeight;
    }

    // Pills
    const pill = document.querySelector(".pill, .tag");
    if (pill) {
      const cs = getComputedStyle(pill);
      data["pill_bg"] = cs.backgroundColor;
      data["pill_color"] = cs.color;
      data["pill_font_size"] = cs.fontSize;
      data["pill_font_weight"] = cs.fontWeight;
      data["pill_padding"] = cs.padding;
      data["pill_radius"] = cs.borderRadius;
    }

    // CTA button
    const ctaBtn = document.querySelector(".cta-button, .contact-cta, a[href*='contact']");
    if (ctaBtn) {
      const cs = getComputedStyle(ctaBtn);
      data["cta_bg"] = cs.backgroundColor;
      data["cta_color"] = cs.color;
      data["cta_text"] = (ctaBtn as HTMLElement).textContent?.trim() || "";
      data["cta_border_radius"] = cs.borderRadius;
    }

    // Detail images gallery
    const detailImages = document.querySelectorAll(".detail-images img, .works-gallery img, .wp-block-gallery img");
    data["detail_image_count"] = String(detailImages.length);

    // Current URL
    data["current_url"] = window.location.href;

    return data;
  });

  console.log("CSS check results:", JSON.stringify(results, null, 2));

  fs.writeFileSync(
    path.join(outDir, "single-css-check.json"),
    JSON.stringify(results, null, 2)
  );
});
