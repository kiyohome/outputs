import { test, expect, Page } from "@playwright/test";

async function getCss(page: Page, selector: string, prop: string): Promise<string | null> {
  return page.evaluate(([s, p]) => {
    const el = document.querySelector(s);
    if (!el) return null;
    return window.getComputedStyle(el).getPropertyValue(p).trim();
  }, [selector, prop]);
}

test.describe("12.1 Header checklist", () => {
  test("H-1〜H-7: Top page header computed styles", async ({ page }) => {
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

    // H-1: Container
    check("H-1-1", await getCss(page, ".site-header", "background-color"), "rgb(255, 255, 255)", "Header bg white");
    check("H-1-3", await getCss(page, ".site-header", "position"), "sticky", "Header sticky");
    check("H-1-4", await getCss(page, ".site-header", "z-index"), "100", "Header z-index");
    check("H-1-5", await getCss(page, ".site-header", "box-shadow"), "none", "Header no box-shadow");
    check("H-1-6a", await getCss(page, ".site-header", "padding-top"), "19px", "Header padding-top");
    check("H-1-6b", await getCss(page, ".site-header", "padding-bottom"), "19px", "Header padding-bottom");
    check("H-1-7a", await getCss(page, ".site-header", "padding-left"), "80px", "Header padding-left");
    check("H-1-7b", await getCss(page, ".site-header", "padding-right"), "80px", "Header padding-right");

    // H-2: Logo "Chiaki Itoh"
    const logoSel = ".site-logo-link p:first-of-type";
    const logoFamily = await getCss(page, logoSel, "font-family");
    if (logoFamily && !logoFamily.includes("Jost")) failures.push(`[H-2-1] Logo font-family should contain Jost, got: ${logoFamily}`);
    check("H-2-2", await getCss(page, logoSel, "font-size"), "20px", "Logo font-size");
    check("H-2-3", await getCss(page, logoSel, "font-weight"), "500", "Logo font-weight");
    check("H-2-4", await getCss(page, logoSel, "color"), "rgb(78, 176, 234)", "Logo color accent");
    check("H-2-5", await getCss(page, logoSel, "line-height"), "26px", "Logo line-height (20px*1.3=26px)");
    check("H-2-6", await getCss(page, logoSel, "font-style"), "normal", "Logo font-style");

    // H-3: Subtitle "LP Design, Meta Ads"
    const subSel = ".site-logo-link p:last-of-type";
    const subFamily = await getCss(page, subSel, "font-family");
    if (subFamily && !subFamily.includes("Jost")) failures.push(`[H-3-1] Subtitle font-family should contain Jost, got: ${subFamily}`);
    check("H-3-2", await getCss(page, subSel, "font-size"), "14px", "Subtitle font-size");
    check("H-3-3", await getCss(page, subSel, "font-weight"), "400", "Subtitle font-weight");
    check("H-3-4", await getCss(page, subSel, "color"), "rgb(78, 176, 234)", "Subtitle color accent");
    check("H-3-5", await getCss(page, subSel, "line-height"), "18.2px", "Subtitle line-height (14px*1.3=18.2px)");

    // H-3-6: Text content with comma space
    const subText = await page.locator(".site-header .site-logo-link p:last-of-type").textContent();
    if (subText && !subText.includes("LP Design, Meta Ads")) {
      failures.push(`[H-3-6] Subtitle text should be "LP Design, Meta Ads", got: "${subText}"`);
    }

    // H-4: Logo link
    const logoLink = page.locator(".site-header .site-logo-link");
    await expect(logoLink).toHaveAttribute("href", "/");
    check("H-4-3", await getCss(page, ".site-header .site-logo-link", "text-decoration-line"), "none", "Logo link no underline");

    // H-5: Navigation
    const navItems = page.locator(".site-header .wp-block-navigation-item__content");
    const navCount = await navItems.count();
    if (navCount !== 5) failures.push(`[H-5-1] Nav items should be 5, got: ${navCount}`);

    const navSel = ".site-header .wp-block-navigation-item__content";
    check("H-5-3", await getCss(page, navSel, "font-size"), "14px", "Nav font-size");
    check("H-5-4", await getCss(page, navSel, "font-weight"), "400", "Nav font-weight");
    check("H-5-5", await getCss(page, navSel, "color"), "rgb(17, 17, 17)", "Nav color text-primary");

    // H-6: Contact button
    const btnSel = ".site-header .wp-block-button__link";
    check("H-6-1", await getCss(page, btnSel, "background-color"), "rgb(17, 17, 17)", "Contact bg text-primary");
    check("H-6-2", await getCss(page, btnSel, "color"), "rgb(255, 255, 255)", "Contact text white");
    check("H-6-5", await getCss(page, btnSel, "font-size"), "15px", "Contact font-size");
    check("H-6-6", await getCss(page, btnSel, "font-weight"), "700", "Contact font-weight");
    check("H-6-7", await getCss(page, btnSel, "padding-top"), "8px", "Contact padding-top");
    check("H-6-8", await getCss(page, btnSel, "padding-left"), "24px", "Contact padding-left");

    const btnText = await page.locator(btnSel).textContent();
    if (btnText?.trim() !== "Contact") failures.push(`[H-6-3] Button text should be "Contact", got: "${btnText}"`);

    const btnHref = await page.locator(btnSel).getAttribute("href");
    if (btnHref !== "/#contact") failures.push(`[H-6-10] Button href should be "/#contact", got: "${btnHref}"`);

    // Screenshot for visual comparison
    await page.locator(".site-header").screenshot({ path: "test-results/header-top.png" });

    if (failures.length > 0) {
      console.log("\n=== HEADER FAILURES ===");
      failures.forEach(f => console.log(f));
      throw new Error(`${failures.length} header check(s) failed`);
    }
  });

  test("H-1-2: Single-works header background", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/works/");
    await page.waitForLoadState("networkidle");

    const firstLink = page.locator(".work-card-title a, .work-card a").first();
    if (await firstLink.count() > 0) {
      const href = await firstLink.getAttribute("href");
      if (href) {
        await page.goto(href);
        await page.waitForLoadState("networkidle");

        const bg = await getCss(page, ".site-header", "background-color");
        expect(bg).toBe("rgb(222, 227, 236)");

        await page.locator(".site-header").screenshot({ path: "test-results/header-single.png" });
      }
    }
  });

  test("H-5-8/H-5-9: Responsive nav (hamburger at 1024px)", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hamburger = page.locator(".wp-block-navigation__responsive-container-open");
    await expect(hamburger).toBeVisible();

    await page.locator(".site-header").screenshot({ path: "test-results/header-mobile.png" });
  });
});
