import { test, expect } from "@playwright/test";

const PAGES = [
  { name: "home", path: "/" },
  { name: "archive-works", path: "/works/" },
];

for (const { name, path } of PAGES) {
  test(`${name}: no PHP fatal or parse error`, async ({ page }) => {
    await page.goto(path);
    const body = page.locator("body");
    await expect(body).not.toContainText("Fatal error");
    await expect(body).not.toContainText("Parse error");
    await expect(body).not.toContainText("Warning:");
  });
}

test("single-works: no PHP error", async ({ page }) => {
  await page.goto("/works/");
  const link = page.locator(".work-card-title a").first();
  await expect(link).toBeVisible();
  await link.click();
  const body = page.locator("body");
  await expect(body).not.toContainText("Fatal error");
  await expect(body).not.toContainText("Parse error");
});

test("home: no broken images", async ({ page }) => {
  const broken: string[] = [];
  page.on("response", (res) => {
    if (res.request().resourceType() === "image" && res.status() >= 400) {
      broken.push(res.url());
    }
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(broken, `Broken images: ${broken.join(", ")}`).toHaveLength(0);
});
