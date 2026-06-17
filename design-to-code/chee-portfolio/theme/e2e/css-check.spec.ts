import { test } from "@playwright/test";

test("12.3 final scoring check", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const r = await page.evaluate(() => {
    const cs = (el: Element | null, prop: string) =>
      el ? getComputedStyle(el)[prop as any] : "NOT_FOUND";

    // FV identity check
    const fvSection = document.querySelector("#fv");
    const fvH1 = fvSection?.querySelector("h1");
    const fvCatchcopy = fvSection?.querySelector(".fv-catchcopy");
    const fvDivider = fvSection?.querySelector(".fv-identity-divider");
    const fvChiaki = Array.from(fvSection?.querySelectorAll("p") ?? []).find(
      (p) => p.textContent?.includes("Chiaki Itoh")
    );

    // Voice section - find all p/h elements in sec-voice
    const voiceSection = document.querySelector("#voice");
    const voiceElements = Array.from(
      voiceSection?.querySelectorAll("h2, h3, p, .voice-quote-title, [class*='quote']") ?? []
    )
      .slice(0, 10)
      .map((el) => ({
        tag: el.tagName,
        cls: el.className.slice(0, 40),
        txt: el.textContent?.trim().slice(0, 40),
        font: getComputedStyle(el)["fontFamily"].split(",")[0],
        size: getComputedStyle(el)["fontSize"],
      }));

    // Works section - find category labels
    const worksSection = document.querySelector("#works");
    const worksTexts = Array.from(
      worksSection?.querySelectorAll(".work-card-header, .work-card-title, h3, .category") ?? []
    )
      .slice(0, 6)
      .map((el) => ({
        tag: el.tagName,
        cls: el.className.slice(0, 40),
        txt: el.textContent?.trim().slice(0, 50),
        size: getComputedStyle(el)["fontSize"],
        weight: getComputedStyle(el)["fontWeight"],
      }));

    // Contact yellow check
    const yellowEl = document.querySelector(".contact-yellow-highlight");
    const yellowRect = yellowEl?.getBoundingClientRect();

    // Header height
    const header = document.querySelector(".site-header");
    const headerRect = header?.getBoundingClientRect();

    // Footer height
    const footer = document.querySelector(".site-footer");

    return {
      fvH1: { txt: fvH1?.textContent?.trim(), size: cs(fvH1 ?? null, "fontSize"), weight: cs(fvH1 ?? null, "fontWeight") },
      fvCatchcopy: { found: !!fvCatchcopy, font: cs(fvCatchcopy ?? null, "fontFamily").split(",")[0], size: cs(fvCatchcopy ?? null, "fontSize") },
      fvDividerFound: !!fvDivider,
      fvChiakiFound: !!fvChiaki,
      voiceElements,
      worksTexts,
      yellowWidth: yellowRect?.width,
      yellowHeight: yellowRect?.height,
      headerHeight: headerRect?.height,
    };
  });

  console.log(JSON.stringify(r, null, 2));
});
