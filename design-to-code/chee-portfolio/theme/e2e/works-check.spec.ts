import { test, expect, Page } from "@playwright/test";

async function getCss(page: Page, selector: string, prop: string): Promise<string | null> {
  return page.evaluate(([s, p]) => {
    const el = document.querySelector(s);
    if (!el) return null;
    return window.getComputedStyle(el).getPropertyValue(p).trim();
  }, [selector, prop]);
}

test.describe("12.3 Works checklist", () => {
  test("W-1〜W-10: Works section computed styles", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const failures: string[] = [];
    function check(id: string, actual: string | null, expected: string, desc: string) {
      if (actual === null) { failures.push(`[${id}] SKIP — element not found: ${desc}`); return; }
      const a = actual.replace(/\s+/g, " ").trim();
      const e = expected.replace(/\s+/g, " ").trim();
      if (a !== e) failures.push(`[${id}] ${desc}\n  expected: ${e}\n  actual:   ${a}`);
    }

    // W-1: Container
    check("W-1-2a", await getCss(page, ".sec-works", "padding-top"), "80px", "Works padding-top");
    check("W-1-2b", await getCss(page, ".sec-works", "padding-bottom"), "80px", "Works padding-bottom");
    const worksId = await page.locator(".sec-works").getAttribute("id");
    if (worksId !== "works") failures.push(`[W-1-4] id should be "works", got: "${worksId}"`);

    // W-2: Heading
    check("W-2-3", await getCss(page, ".sec-works .sec-title", "font-size"), "36px", "Works title font-size");
    check("W-2-5", await getCss(page, ".sec-works .sec-title", "font-weight"), "500", "Works title font-weight");
    check("W-2-6", await getCss(page, ".sec-works .sec-title", "color"), "rgb(17, 17, 17)", "Works title color");
    check("W-2-7", await getCss(page, ".sec-works .sec-title", "margin-bottom"), "48px", "Works title margin-bottom");

    // W-3: Card count
    const cardCount = await page.locator(".sec-works .work-card").count();
    if (cardCount !== 2) failures.push(`[W-3-1] Expected 2 work cards, got: ${cardCount}`);

    // W-4: Card header
    check("W-4-3", await getCss(page, ".work-card-header", "padding-bottom"), "12px", "Card header padding-bottom");
    check("W-4-4", await getCss(page, ".work-card-header", "margin-bottom"), "16px", "Card header margin-bottom");

    // W-5: Card title
    check("W-5-1", await getCss(page, ".work-card-title", "font-size"), "20px", "Card title font-size");
    check("W-5-2", await getCss(page, ".work-card-title", "font-weight"), "500", "Card title font-weight");

    // W-7: Pills
    const pillSel = ".sec-works .work-pill";
    check("W-7-4a", await getCss(page, pillSel, "padding-top"), "5px", "Pill padding-top");
    check("W-7-4b", await getCss(page, pillSel, "padding-left"), "10px", "Pill padding-left");
    check("W-7-5", await getCss(page, pillSel, "font-size"), "15px", "Pill font-size");
    check("W-7-6", await getCss(page, pillSel, "font-weight"), "500", "Pill font-weight");

    // W-8: Description
    check("W-8-1", await getCss(page, ".work-card-desc", "font-size"), "16px", "Desc font-size");
    check("W-8-4", await getCss(page, ".work-card-desc", "margin-bottom"), "16px", "Desc margin-bottom");

    // W-10: More link
    check("W-10-2", await getCss(page, ".works-more-wrap", "margin-top"), "48px", "More wrap margin-top");
    check("W-10-7a", await getCss(page, ".works-more-link", "padding-top"), "12px", "More link padding-top");
    check("W-10-7b", await getCss(page, ".works-more-link", "padding-left"), "32px", "More link padding-left");
    check("W-10-8", await getCss(page, ".works-more-link", "font-size"), "16px", "More link font-size");
    check("W-10-9", await getCss(page, ".works-more-link", "font-weight"), "500", "More link font-weight");

    const moreHref = await page.locator(".works-more-link").getAttribute("href");
    if (moreHref !== "/works/") failures.push(`[W-10-10] More link href should be "/works/", got: "${moreHref}"`);

    // Screenshot
    await page.locator(".sec-works").screenshot({ path: "test-results/works-section.png" });

    if (failures.length > 0) {
      console.log("\n=== WORKS FAILURES ===");
      failures.forEach(f => console.log(f));
      throw new Error(`${failures.length} Works check(s) failed`);
    }
  });
});
