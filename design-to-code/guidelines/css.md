# CSS Guidelines

## File structure

```
@charset "utf-8";

/* 1. Reset / base          — box-sizing, element defaults */
/* 2. Show/hide             — .pc / .sp */
/* 3. Layout utilities      — l-* classes */
/* 4. Typography            — headings, body, accents */
/* ◤◢ don't touch above ◤◢ */
/* 5. Components            — header, footer, sections */
/* 6. Accent utilities      — a-* */
/* 7. State / decoration    — is-* */
```

Sections 1–4 (base) are shared across projects. Only sections 5–7 change per design.

## Desktop-first approach

These guidelines follow a desktop-first approach. Mobile styles are overrides inside `@media (max-width: 599px)`. Do not mix mobile-first and desktop-first in the same file.

## Breakpoints

Default: single breakpoint at `599px`.

```css
@media (max-width: 599px) { ... }
```

Add a tablet breakpoint at `768px` when the design explicitly calls for a distinct tablet layout (common for HP). Do not add breakpoints speculatively.

## Reset

The `box-sizing` reset applies universally — it must appear before any third-party or vendor CSS:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## Show/hide

`.pc` / `.sp` use `display: none` — this removes the element from the accessibility tree:

```css
.pc { display: block; }
.sp { display: none; }

@media (max-width: 599px) {
  .pc { display: none; }
  .sp { display: block; }
}
```

Do not use `visibility: hidden` or `opacity: 0` for these — they keep the content in the accessibility tree and cause duplicate announcements.

## Color palette

Define project colors as CSS custom properties at `:root`. Do not hardcode hex values inside component rules.

```css
:root {
  --color-accent:  #336699;
  --color-bg:      #f2efe6;
  --color-text:    #333333;
  --color-border:  #dddddd;
  --color-danger:  #cc2200;
}
```

Values above are from the LP template — update per project. The `.a-red` utility maps to `var(--color-danger)`; update both together when the danger color changes.

## Typography

- Use `em` / `rem` for font sizes in components; `px` is acceptable for layout dimensions.
- Use `clamp()` for fluid heading sizes. Formula: `preferred-vw = (target-px ÷ viewport-width) × 100`. Example for a target of 27px on a 375px viewport: `font-size: clamp(18px, 7.20vw, 27px)`.
- Apply `font-feature-settings: "palt"` to headings and to body text using `text-align: justify`. Do not apply to Latin-only text.
- Apply `-webkit-font-smoothing: antialiased` to all headings.
- Add `overflow-wrap: break-word` to body — prevents mixed Japanese/ASCII strings (URLs, product codes) from overflowing narrow containers on mobile.
- Standard line-heights: `1.618` body, `1.41` headings, `1.5` UI elements (table cells, list items).

## Layout utilities (l-*)

These are shared across all page types and must not be modified per project. To adjust a value per project, wrap the element in a project-specific class.

| Class | Purpose |
|-------|---------|
| `.l-width` | Center column, max-width 808px, padding 0 24px. HP projects may override max-width via a wrapper class. |
| `.l-wide` | Full-bleed background. Implemented as negative margin on both sides equal to the padding of the parent container, with matching positive padding to restore inner alignment. Must be a direct child of `.l-width`. |
| `.l-margin` | Vertical rhythm: 40px desktop / 24px mobile |
| `.l-padding` | Inner spacing: 40px desktop / 24px mobile |
| `.l-padding-s` | Compact inner spacing: 1.5em |
| `.l-grid-2` | CSS Grid, 2 equal columns, gap 24px. Collapses to 1 column on mobile. |
| `.l-grid-3` | CSS Grid, 3 equal columns, gap 24px. Collapses to 2 columns on mobile. |
| `.l-columns-2` / `.l-columns-3` | CSS columns for lists. Collapses to 1 column on mobile. |

## Component naming (BEM-style)

```css
.block { }
.block__element { }
.block__element--modifier { }
```

Keep selectors flat — one class per rule where possible. Exceptions: `:first-child`, `:last-child`, pseudo-elements.

```css
/* ok */
.faq__q::before { }
.faq__item:last-child { }

/* avoid — four-level chain, high specificity */
.faq .faq__item .faq__q h4 { }
```

When a base rule must be overridden (e.g. `.main` font-size affects component text), prefix with the nearest ancestor block, not a chain:

```css
/* minimal override — one ancestor + one element */
.main .faq__a { font-size: 1rem; }
```

`!important` is banned inside component rules. It is acceptable only in utility classes where winning the cascade is the explicit purpose (e.g. `.a-center { text-align: center !important }`).

## Accent utilities (a-*)

Typography-only utilities applied via class in HTML:

| Class | Effect |
|-------|--------|
| `.a-bold` | `font-weight: 700` |
| `.a-big` / `.a-big1` / `.a-big2` / `.a-big3` | 21 / 24 / 27 / 30px (scaled on mobile) |
| `.a-marker` | Yellow highlight underline |
| `.a-red` | Danger color text (`var(--color-danger)`) |
| `.a-underline` | Plain underline |
| `.a-blink` | CSS blink animation — use only for short-lived UI signals (e.g. "NEW" badge). WCAG 2.2.2 requires blinking content to stop within 5 seconds. Never apply to body text. |
| `.a-center` | `text-align: center` |

Do not create new `a-*` classes without updating this table.

## State / decoration utilities (is-*)

| Class | Effect |
|-------|--------|
| `.is-shadow-s` | Subtle drop shadow |
| `.is-shadow-l` | Large drop shadow (filter) |
| `.is-round` | `border-radius: 8px` |

## Images

Base rule for all `<img>`:

```css
img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}
```

For images inside fixed-height containers, use `object-fit: cover` on `<img>`, not on the container.

## Animations

Use `animate.css` for entrance animations. Copy only the `@keyframes` blocks you actually use into `style.css` — do not load the full animate.css file.

All entrance animations must have a `prefers-reduced-motion` counterpart:

```css
@media (prefers-reduced-motion: reduce) {
  .animate__animated {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

Animate only `transform` and `opacity` — never `width`, `height`, or `padding` (causes layout recalculation).

Add `will-change: transform, opacity` to an element before its entrance animation fires, and reset to `will-change: auto` after the animation completes. This promotes the element to its own compositor layer during the animation.

Custom keyframes go at the bottom of `style.css`, after all component rules.

## Inline styles

Inline styles are allowed only for values that cannot be expressed in a class — specifically, dynamically computed values or third-party embed wrappers. Document each use with a comment explaining why a class is insufficient.

JS-driven class toggles use `js-*` classes — never style a `js-*` class in CSS.

## @layer strategy

This project does not use `@layer`. Cascade order is managed by load order (reset → vendor → site CSS) and specificity. Vendor libraries (animate.css) are not loaded as full stylesheets — only the needed `@keyframes` are copied into `style.css`, so there is no layer conflict to resolve.

If a future project adds a full third-party stylesheet that conflicts with component rules, introduce `@layer` at that point and document it here.

## Vendor file versioning

Pin versions in filenames or in a comment at the top of each vendored file:

```css
/* normalize.css v8.0.1 — https://github.com/necolas/normalize.css */
```

```
js/jquery-3.6.0.min.js   ← version in filename
```

When updating a vendor file, update the version reference and test for visual regressions.

## TODO

- [ ] Print styles policy
- [ ] Dark mode strategy
