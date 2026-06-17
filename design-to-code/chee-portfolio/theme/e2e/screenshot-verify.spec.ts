import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const outDir = path.join(__dirname, "screenshots/task12");

test("verify fixes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // Contact section top (heading + yellow + form start)
  const contact = page.locator("#contact");
  await contact.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await contact.boundingBox();
  if (box) {
    await page.screenshot({
      path: path.join(outDir, "verify-contact-top.png"),
      clip: { x: box.x, y: box.y, width: box.width, height: Math.min(600, box.height) },
    });
  }

  // Header height check
  const header = page.locator(".site-header").first();
  const headerBox = await header.boundingBox();
  console.log("Header height:", headerBox?.height);

  // Footer height check
  const footer = page.locator(".site-footer").first();
  await footer.scrollIntoViewIfNeeded();
  const footerBox = await footer.boundingBox();
  console.log("Footer height:", footerBox?.height);

  await footer.screenshot({ path: path.join(outDir, "verify-footer.png") });

  // Yellow element check
  const yellowEl = page.locator(".contact-yellow-highlight");
  const yellowBox = await yellowEl.boundingBox();
  console.log("Yellow highlight:", yellowBox);
});
