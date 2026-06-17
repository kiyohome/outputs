import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const outDir = path.join(__dirname, "screenshots/task12");
fs.mkdirSync(outDir, { recursive: true });

test("top page full screenshot", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: path.join(outDir, "top-full.png"),
    fullPage: true,
  });
});

test("top page header", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const header = page.locator("header").first();
  await header.screenshot({ path: path.join(outDir, "top-header.png") });
});

test("top page footer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const footer = page.locator("footer").first();
  await footer.screenshot({ path: path.join(outDir, "top-footer.png") });
});

test("top page sec01 FV", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const sec = page.locator("#sec01, .sec01, section").first();
  await page.screenshot({
    path: path.join(outDir, "top-sec01-fv.png"),
    clip: { x: 0, y: 82, width: 1440, height: 920 },
  });
});

test("top page sec02 Works", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const sec = page.locator(".sec02, #works, [id*='works']").first();
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await sec.boundingBox();
  if (box) {
    await page.screenshot({
      path: path.join(outDir, "top-sec02-works.png"),
      clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 1800) },
    });
  }
});

test("top page sec03 Voice", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const sec = page.locator(".sec03, #voice, [id*='voice']").first();
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await sec.boundingBox();
  if (box) {
    await page.screenshot({
      path: path.join(outDir, "top-sec03-voice.png"),
      clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 1000) },
    });
  }
});

test("top page sec04 Service", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const sec = page.locator(".sec04, #service, [id*='service']").first();
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await sec.boundingBox();
  if (box) {
    await page.screenshot({
      path: path.join(outDir, "top-sec04-service.png"),
      clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 1300) },
    });
  }
});

test("top page sec06 Profile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const sec = page.locator(".sec06, #profile, [id*='profile']").first();
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await sec.boundingBox();
  if (box) {
    await page.screenshot({
      path: path.join(outDir, "top-sec06-profile.png"),
      clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 1200) },
    });
  }
});

test("top page sec07 Flow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const sec = page.locator(".sec07, #flow, [id*='flow']").first();
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await sec.boundingBox();
  if (box) {
    await page.screenshot({
      path: path.join(outDir, "top-sec07-flow.png"),
      clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 1100) },
    });
  }
});

test("top page sec08 Contact", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const sec = page.locator(".sec08, #contact, [id*='contact']").first();
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const box = await sec.boundingBox();
  if (box) {
    await page.screenshot({
      path: path.join(outDir, "top-sec08-contact.png"),
      clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 1800) },
    });
  }
});
