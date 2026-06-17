import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const outDir = path.join(__dirname, "screenshots/task12");
fs.mkdirSync(outDir, { recursive: true });

test("header with active nav on Works section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator("#works").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const header = page.locator("header").first();
  await header.screenshot({ path: path.join(outDir, "header-active-works.png") });
});

test("header with active nav on Voice section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator("#voice").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const header = page.locator("header").first();
  await header.screenshot({ path: path.join(outDir, "header-active-voice.png") });
});
