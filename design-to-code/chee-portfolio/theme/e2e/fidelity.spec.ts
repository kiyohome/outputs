import { test, expect, Page } from "@playwright/test";

// Figma-derived expected values for each key element.
// All values are what getComputedStyle() should return at 1440px viewport width.
interface Check {
  id: string;
  description: string;
  selector: string;
  property: string;
  expected: string;
}

const CHECKS: Check[] = [
  // ── Header ────────────────────────────────────────────────────────────────
  {
    id: "H01",
    description: "Header background — white on non-single pages",
    selector: ".site-header",
    property: "background-color",
    expected: "rgb(255, 255, 255)",
  },
  {
    id: "H02",
    description: "Nav link font-size — 14px",
    selector: ".wp-block-navigation-item__content",
    property: "font-size",
    expected: "14px",
  },
  {
    id: "H03",
    description: "Nav link font-weight — 400",
    selector: ".wp-block-navigation-item__content",
    property: "font-weight",
    expected: "400",
  },
  {
    id: "H04",
    description: "Nav link color — #111111",
    selector: ".wp-block-navigation-item__content",
    property: "color",
    expected: "rgb(17, 17, 17)",
  },
  {
    id: "H05",
    description: "Contact button background — #111111",
    selector: ".site-header .wp-block-button__link",
    property: "background-color",
    expected: "rgb(17, 17, 17)",
  },
  {
    id: "H06",
    description: "Contact button color — white",
    selector: ".site-header .wp-block-button__link",
    property: "color",
    expected: "rgb(255, 255, 255)",
  },
  {
    id: "H07",
    description: "Contact button font-size — 15px",
    selector: ".site-header .wp-block-button__link",
    property: "font-size",
    expected: "15px",
  },
  {
    id: "H08",
    description: "Contact button font-weight — 700",
    selector: ".site-header .wp-block-button__link",
    property: "font-weight",
    expected: "700",
  },
  {
    id: "H09",
    description: "Contact button border-radius — pill (≥50px)",
    selector: ".site-header .wp-block-button__link",
    property: "border-radius",
    // Stored as separate values; just check top-left
    expected: "50px",
  },
  {
    id: "H10",
    description: "Contact button padding-top — 8px",
    selector: ".site-header .wp-block-button__link",
    property: "padding-top",
    expected: "8px",
  },
  {
    id: "H11",
    description: "Contact button padding-left — 24px",
    selector: ".site-header .wp-block-button__link",
    property: "padding-left",
    expected: "24px",
  },

  // ── FV section ────────────────────────────────────────────────────────────
  {
    id: "FV01",
    description: "FV section background — white (no explicit bg, inherits body white)",
    selector: ".sec-fv",
    property: "background-color",
    expected: "rgba(0, 0, 0, 0)",
  },
  {
    id: "FV02",
    description: "FV h1 (LP制作×広告運用) — Noto Sans JP (browser may append generic family)",
    selector: ".sec-fv h1",
    property: "font-family",
    expected: '"Noto Sans JP", sans-serif',
  },
  {
    id: "FV03",
    description: "FV sub-text (提案も) font-size — 28px at 1440px",
    selector: ".sec-fv .fv-text-area p",
    property: "font-size",
    expected: "28px",
  },
  {
    id: "FV04",
    description: "FV sub-text font-weight — 400",
    selector: ".sec-fv .fv-text-area p",
    property: "font-weight",
    expected: "400",
  },
  {
    id: "FV05",
    description: "Deco text (Chee Design) font-weight — 100",
    selector: ".fv-deco-text",
    property: "font-weight",
    expected: "100",
  },

  // ── Works section ─────────────────────────────────────────────────────────
  {
    id: "W01",
    description: "Works section heading font-size — 36px",
    selector: ".sec-works .sec-title",
    property: "font-size",
    expected: "36px",
  },
  {
    id: "W02",
    description: "Works section heading font-weight — 500",
    selector: ".sec-works .sec-title",
    property: "font-weight",
    expected: "500",
  },
  {
    id: "W03",
    description: "Works section heading color — #111111",
    selector: ".sec-works .sec-title",
    property: "color",
    expected: "rgb(17, 17, 17)",
  },
  {
    id: "W04",
    description: "Work card title font-size — 20px",
    selector: ".work-card-title",
    property: "font-size",
    expected: "20px",
  },
  {
    id: "W05",
    description: "Work card title font-weight — 500",
    selector: ".work-card-title",
    property: "font-weight",
    expected: "500",
  },
  {
    id: "W06",
    description: "Work pill (category label) font-size — 15px",
    selector: ".work-pill",
    property: "font-size",
    expected: "15px",
  },
  {
    id: "W07",
    description: "Work pill background — accent #4EB0EA",
    selector: ".work-pill",
    property: "background-color",
    expected: "rgb(78, 176, 234)",
  },
  {
    id: "W08",
    description: "Work pill color — white",
    selector: ".work-pill",
    property: "color",
    expected: "rgb(255, 255, 255)",
  },
  {
    id: "W09",
    description: "Work description font-size — 16px",
    selector: ".work-card-desc",
    property: "font-size",
    expected: "16px",
  },

  // ── Voice section ─────────────────────────────────────────────────────────
  {
    id: "V01",
    description: "Voice section heading font-size — 36px",
    selector: ".sec-voice .sec-title",
    property: "font-size",
    expected: "36px",
  },
  {
    id: "V02",
    description: "Voice section background — bg-main #DCEFFB",
    selector: ".sec-voice",
    property: "background-color",
    expected: "rgb(220, 239, 251)",
  },
  {
    id: "V03",
    description: "Voice number font-size — 70px",
    selector: ".voice-card__num",
    property: "font-size",
    expected: "70px",
  },
  {
    id: "V04",
    description: "Voice number font-weight — 500",
    selector: ".voice-card__num",
    property: "font-weight",
    expected: "500",
  },
  {
    id: "V05",
    description: "Voice number color — white",
    selector: ".voice-card__num",
    property: "color",
    expected: "rgb(255, 255, 255)",
  },
  {
    id: "V06",
    description: "Voice catchphrase font-size — 24px",
    selector: ".voice-card__catchphrase",
    property: "font-size",
    expected: "24px",
  },
  {
    id: "V07",
    description: "Voice body font-size — 18px",
    selector: ".voice-card__body",
    property: "font-size",
    expected: "18px",
  },

  // ── Service section ───────────────────────────────────────────────────────
  {
    id: "S01",
    description: "Service section heading font-size — 36px",
    selector: ".sec-service .sec-title",
    property: "font-size",
    expected: "36px",
  },
  {
    id: "S02",
    description: "Service section heading color — #333333 (text-secondary per Figma)",
    selector: ".sec-service .sec-title",
    property: "color",
    expected: "rgb(51, 51, 51)",
  },
  {
    id: "S03",
    description: "Service label background — accent #4EB0EA",
    selector: ".service-label",
    property: "background-color",
    expected: "rgb(78, 176, 234)",
  },
  {
    id: "S04",
    description: "Service label border-radius — 4px",
    selector: ".service-label",
    property: "border-radius",
    expected: "4px",
  },
  {
    id: "S05",
    description: "Service label padding-top — 5px",
    selector: ".service-label",
    property: "padding-top",
    expected: "5px",
  },
  {
    id: "S06",
    description: "Service label padding-left — 10px",
    selector: ".service-label",
    property: "padding-left",
    expected: "10px",
  },
  {
    id: "S07",
    description: "Service card-left container exists with flex layout",
    selector: ".service-card-left",
    property: "display",
    expected: "flex",
  },

  // ── CTA section ───────────────────────────────────────────────────────────
  {
    id: "CTA01",
    description: "CTA section background — accent #4EB0EA",
    selector: ".sec-cta",
    property: "background-color",
    expected: "rgb(78, 176, 234)",
  },

  // ── Flow section ──────────────────────────────────────────────────────────
  {
    id: "FL01",
    description: "Flow section heading font-size — 32px",
    selector: ".sec-flow .sec-title",
    property: "font-size",
    expected: "32px",
  },
  {
    id: "FL02",
    description: "Flow section heading font-weight — 500",
    selector: ".sec-flow .sec-title",
    property: "font-weight",
    expected: "500",
  },

  // ── Profile section ───────────────────────────────────────────────────────
  {
    id: "P01",
    description: "Profile section heading font-size — 36px",
    selector: ".sec-profile .sec-title",
    property: "font-size",
    expected: "36px",
  },
  {
    id: "P02",
    description: "Profile bio text font-size — 18px",
    selector: ".sec-profile .profile-bio p",
    property: "font-size",
    expected: "18px",
  },
  {
    id: "P03",
    description: "Profile bio text font-weight — 400",
    selector: ".sec-profile .profile-bio p",
    property: "font-weight",
    expected: "400",
  },
  {
    id: "P04",
    description: "Profile detail row text font-size — 16px",
    selector: ".profile-row-sep p",
    property: "font-size",
    expected: "16px",
  },

  // ── Contact section ───────────────────────────────────────────────────────
  {
    id: "C01",
    description: "Contact section heading font-size — 36px",
    selector: ".sec-contact .sec-title",
    property: "font-size",
    expected: "36px",
  },
  {
    id: "C02",
    description: "Contact lead text font-size — 24px",
    selector: ".contact-lead",
    property: "font-size",
    expected: "24px",
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  {
    id: "FT01",
    description: "Footer background — bg-main #DCEFFB",
    selector: ".site-footer",
    property: "background-color",
    expected: "rgb(220, 239, 251)",
  },
  {
    id: "FT02",
    description: "Footer nav link font-size — 14px",
    selector: ".footer-nav a",
    property: "font-size",
    expected: "14px",
  },
];

async function getComputedProp(
  page: Page,
  selector: string,
  property: string
): Promise<string | null> {
  return page.evaluate(
    ([sel, prop]) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      return window.getComputedStyle(el).getPropertyValue(prop).trim();
    },
    [selector, property]
  );
}

function normalize(value: string): string {
  // Normalize font-family: remove trailing semicolons, collapse whitespace
  return value
    .replace(/;$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

test("9.6.11 — Computed style vs Figma JSON fidelity check", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const failures: string[] = [];
  const skipped: string[] = [];

  for (const check of CHECKS) {
    const actual = await getComputedProp(page, check.selector, check.property);

    if (actual === null) {
      skipped.push(
        `[${check.id}] SKIP — selector not found: ${check.selector}`
      );
      continue;
    }

    const normActual = normalize(actual);
    const normExpected = normalize(check.expected);

    if (normActual !== normExpected) {
      failures.push(
        `[${check.id}] FAIL — ${check.description}\n` +
          `  selector:  ${check.selector}\n` +
          `  property:  ${check.property}\n` +
          `  expected:  ${normExpected}\n` +
          `  actual:    ${normActual}`
      );
    }
  }

  if (skipped.length > 0) {
    console.log("\n=== SKIPPED (element not found) ===");
    skipped.forEach((s) => console.log(s));
  }

  if (failures.length > 0) {
    console.log("\n=== FAILURES ===");
    failures.forEach((f) => console.log(f));
    throw new Error(
      `${failures.length} fidelity check(s) failed. See above for details.`
    );
  }
});
