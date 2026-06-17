import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

test("archive-works detailed CSS check", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");

  const results = await page.evaluate(() => {
    const data: Record<string, string> = {};
    const px = (el: Element, prop: string) => getComputedStyle(el).getPropertyValue(prop).trim();

    // Header background
    const header = document.querySelector("header");
    if (header) {
      data["header_bg"] = px(header, "background-color");
      data["header_height"] = px(header, "height");
    }

    // Page title area
    const pta = document.querySelector(".page-title-area");
    if (pta) {
      data["pta_bg"] = px(pta, "background-color");
      data["pta_height"] = px(pta, "height");
    }

    // Card count
    const cards = document.querySelectorAll(".work-card");
    data["card_count"] = String(cards.length);

    if (cards.length > 0) {
      const card = cards[0] as HTMLElement;
      data["card_width"] = px(card, "width");
      // border-bottom
      data["card_border_bottom"] = px(card, "border-bottom");
    }

    // Category label
    const catLabel = document.querySelector(".work-card-catlabel");
    if (catLabel) {
      data["cat_label_text"] = catLabel.textContent?.trim() || "";
      data["cat_label_font_size"] = px(catLabel, "font-size");
      data["cat_label_font_weight"] = px(catLabel, "font-weight");
    }

    // Title link (contains cat label + client name)
    const titleLink = document.querySelector(".work-card-title a");
    if (titleLink) {
      data["title_font_size"] = px(titleLink, "font-size");
      data["title_font_weight"] = px(titleLink, "font-weight");
    }

    // Description
    const desc = document.querySelector(".work-card-desc");
    if (desc) {
      data["desc_font_size"] = px(desc, "font-size");
      data["desc_font_weight"] = px(desc, "font-weight");
    }

    // Pill
    const pill = document.querySelector(".work-pill");
    if (pill) {
      data["pill_bg"] = px(pill, "background-color");
      data["pill_color"] = px(pill, "color");
      data["pill_font_size"] = px(pill, "font-size");
      data["pill_font_weight"] = px(pill, "font-weight");
      data["pill_padding"] = px(pill, "padding");
      data["pill_border_radius"] = px(pill, "border-radius");
    }

    // Arrow
    const arrow = document.querySelector(".work-card-arrow");
    if (arrow) {
      data["arrow_stroke"] = arrow.getAttribute("viewBox") || "";
    }
    const arrowCircle = document.querySelector(".work-card-arrow circle");
    if (arrowCircle) {
      data["arrow_circle_stroke"] = arrowCircle.getAttribute("stroke") || "";
    }

    // Thumbnail image
    const thumbImg = document.querySelector(".work-card-image img");
    if (thumbImg) {
      data["thumb_height"] = px(thumbImg, "height");
      data["thumb_width"] = px(thumbImg, "width");
      data["thumb_object_fit"] = px(thumbImg, "object-fit");
    }

    // CTA button
    const cta = document.querySelector(".page-cta__link");
    if (cta) {
      data["cta_text"] = cta.textContent?.trim() || "";
      data["cta_bg"] = px(cta, "background-color");
      data["cta_color"] = px(cta, "color");
      data["cta_border_radius"] = px(cta, "border-radius");
      data["cta_padding"] = px(cta, "padding");
    }

    return data;
  });

  console.log("Detailed CSS check:", JSON.stringify(results, null, 2));
  fs.writeFileSync(
    path.join(__dirname, "screenshots/task12/archive-css-detail.json"),
    JSON.stringify(results, null, 2)
  );
});
