import { test, expect, Page } from "@playwright/test";

async function getCss(page: Page, selector: string, prop: string): Promise<string | null> {
  return page.evaluate(([s, p]) => {
    const el = document.querySelector(s);
    if (!el) return null;
    return window.getComputedStyle(el).getPropertyValue(p).trim();
  }, [selector, prop]);
}

test.describe("12.2 FV checklist", () => {
  test("FV-1〜FV-9: FV section computed styles", async ({ page }) => {
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

    // FV-1: Text area
    check("FV-1-2", await getCss(page, ".fv-text-area", "padding-top"), "80px", "FV text-area padding-top");
    check("FV-1-3", await getCss(page, ".fv-text-area", "padding-bottom"), "60px", "FV text-area padding-bottom");

    // FV-2: Catchcopy
    const ccFamily = await getCss(page, ".fv-catchcopy", "font-family");
    if (ccFamily && !ccFamily.toLowerCase().includes("arial")) {
      failures.push(`[FV-2-1] Catchcopy font-family should include Arial, got: ${ccFamily}`);
    }
    check("FV-2-2", await getCss(page, ".fv-catchcopy", "font-size"), "48px", "Catchcopy font-size");
    check("FV-2-3", await getCss(page, ".fv-catchcopy", "font-weight"), "400", "Catchcopy font-weight");
    check("FV-2-4", await getCss(page, ".fv-catchcopy", "color"), "rgb(17, 17, 17)", "Catchcopy color");
    check("FV-2-5", await getCss(page, ".fv-catchcopy", "margin-bottom"), "8px", "Catchcopy margin-bottom");

    // FV-3: h1
    const h1Tag = await page.evaluate(() => {
      const el = document.querySelector(".sec-fv h1");
      return el?.tagName ?? null;
    });
    if (h1Tag !== "H1") failures.push(`[FV-3-1] Expected h1 tag, got: ${h1Tag}`);
    const h1Family = await getCss(page, ".sec-fv h1", "font-family");
    if (h1Family && !h1Family.includes("Noto Sans JP")) {
      failures.push(`[FV-3-2] h1 font-family should include Noto Sans JP, got: ${h1Family}`);
    }
    check("FV-3-3", await getCss(page, ".sec-fv h1", "font-size"), "28px", "h1 font-size");
    check("FV-3-4", await getCss(page, ".sec-fv h1", "font-weight"), "400", "h1 font-weight");
    check("FV-3-7", await getCss(page, ".sec-fv h1", "white-space"), "nowrap", "h1 white-space");

    // FV-4: Divider
    check("FV-4-1", await getCss(page, ".fv-identity-divider", "width"), "24px", "Divider width");
    check("FV-4-2", await getCss(page, ".fv-identity-divider", "height"), "1px", "Divider height");

    // FV-5: Logo text in FV
    const fvSubText = await page.locator(".sec-fv .fv-text-area p.has-jost-font-family").last().textContent();
    if (fvSubText && !fvSubText.includes("LP Design, Meta Ads")) {
      failures.push(`[FV-5-3] FV subtitle should be "LP Design, Meta Ads", got: "${fvSubText}"`);
    }

    // FV-6: Blue area
    check("FV-6-1", await getCss(page, ".fv-lower", "background-color"), "rgb(220, 239, 251)", "FV lower bg-main");
    check("FV-6-4", await getCss(page, ".fv-lower", "padding-top"), "80px", "FV lower padding-top");

    // FV-7: Carousel images (width/height controlled by Splide perPage, check CSS declaration + object-fit)
    const imgSel = ".fv-splide .splide__slide img";
    check("FV-7-3", await getCss(page, imgSel, "object-fit"), "cover", "Mockup object-fit");
    const imgBr = await getCss(page, imgSel, "border-radius");
    if (imgBr && imgBr !== "16px") failures.push(`[FV-7-4] Mockup border-radius expected 16px, got: ${imgBr}`);

    // FV-8: Deco text
    check("FV-8-3", await getCss(page, ".fv-deco-text", "font-weight"), "100", "Deco font-weight");
    check("FV-8-5", await getCss(page, ".fv-deco-text", "position"), "absolute", "Deco position");

    const decoHidden = await page.locator(".fv-deco-text").getAttribute("aria-hidden");
    if (decoHidden !== "true") failures.push(`[FV-8-7] Deco text aria-hidden should be true, got: ${decoHidden}`);

    // FV-9: Overall
    check("FV-9-2", await getCss(page, ".sec-fv", "overflow"), "hidden", "FV overflow hidden");

    // Screenshots
    await page.locator(".sec-fv").screenshot({ path: "test-results/fv-section.png" });

    if (failures.length > 0) {
      console.log("\n=== FV FAILURES ===");
      failures.forEach(f => console.log(f));
      throw new Error(`${failures.length} FV check(s) failed`);
    }
  });
});
