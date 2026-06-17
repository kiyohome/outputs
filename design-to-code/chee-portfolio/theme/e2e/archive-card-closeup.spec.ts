import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const outDir = path.join(__dirname, "screenshots/task12");

test("archive card closeup", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");

  const card = page.locator(".work-card").first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await card.boundingBox();
  if (box) {
    await page.screenshot({
      path: path.join(outDir, "archive-card-closeup.png"),
      clip: { x: 200, y: box.y - 10, width: 1040, height: box.height + 20 },
    });
  }
});

test("archive CTA button closeup", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/works/");
  await page.waitForLoadState("networkidle");

  const cta = page.locator(".page-cta");
  await cta.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await cta.boundingBox();
  if (box) {
    await page.screenshot({
      path: path.join(outDir, "archive-cta.png"),
      clip: { x: 200, y: box.y - 20, width: 1040, height: box.height + 40 },
    });
  }
});
