# HTML Guidelines

## Document setup

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <!-- charset must be the first element — before <title> and any other tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- never add user-scalable=no — disabling pinch-zoom is a WCAG 1.4.4 violation -->
  <meta name="description" content="...">
  <title>ページタイトル</title>
  ...
</head>
```

- Always `lang="ja"` on `<html>`.
- `<meta charset>` must appear within the first 1024 bytes — put it first inside `<head>`.
- `<meta name="description">` is required on every page.
- Page-type-specific meta tags (e.g. `robots`) are defined in the per-type guideline.

## CSS load order

```html
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link rel="stylesheet" href="css/normalize.min.css">
<link rel="stylesheet" href="css/hover-min.css">
<link rel="stylesheet" href="css/animate.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css">
<link rel="stylesheet" href="style.css">
```

Order: reset → vendor → site CSS. Site CSS is always last.

Font Awesome 4.7 (current) uses a private-use Unicode icon font, which is read aloud inconsistently by screen readers. Every icon must carry `aria-hidden="true"`. If the icon conveys meaning, add a visually hidden label:

```html
<span class="fa fa-check" aria-hidden="true"></span>
<span class="sr-only">完了</span>
```

For new projects, prefer Font Awesome 6 (SVG-based) or inline SVG — both provide more reliable accessibility and smaller payloads than the icon font approach.

## JavaScript load order

BudouX must load before body parsing — do not add `defer`. jQuery and `function.js` can be deferred:

```html
<script src="https://unpkg.com/budoux/bundle/budoux-ja.min.js"
        integrity="sha384-XXXXX" crossorigin="anonymous"></script>
<script src="js/jquery-3.6.0.min.js" defer></script>
<script src="js/function.js" defer></script>
```

Add an `integrity` hash to any CDN-loaded script. Self-host when possible (jQuery is already vendored — do the same for BudouX).

Third-party inline scripts (e.g. video embeds) go inline at the point of use.

## Semantic structure

Use structural elements: `<header>`, `<main>`, `<section>`, `<footer>`, `<figure>`, `<nav>`, `<blockquote>`.

One `<h1>` per page. Heading levels must not skip (h1 → h2 → h3, not h1 → h3).

Every `<section>` must have an accessible name — either an `aria-label` attribute or a heading element as its first meaningful child. Without a name, `<section>` is indistinguishable from `<div>` for screen reader users.

Pages with more than one `<nav>` must label each:

```html
<nav aria-label="Primary">...</nav>
<nav aria-label="Footer">...</nav>
```

## PC / SP visibility

Use `.pc` / `.sp` utility classes for content that differs structurally between breakpoints:

```html
<div class="pc"><!-- desktop version --></div>
<div class="sp"><!-- mobile version --></div>
```

The hiding mechanism is `display: none` (removes element from accessibility tree). Do not use `visibility: hidden` or `opacity: 0` — those keep duplicate content visible to screen readers.

Do not duplicate interactive controls (nav links, form fields) between `.pc` and `.sp` variants. Use a single element that repositions via CSS instead.

## Responsive images

Use `<picture>` with mutually exclusive breakpoints (no overlap):

```html
<picture>
  <source srcset="img/btn--sp.webp" type="image/webp" media="(max-width: 599px)">
  <source srcset="img/btn--sp.png"  media="(max-width: 599px)">
  <source srcset="img/btn.webp"     type="image/webp">
  <img src="img/btn.png" alt="ボタンの説明" loading="lazy">
</picture>
```

- Breakpoints: `max-width: 599px` / no media (desktop). Do not use `min-width: 598px` — the 598–599px range would match both.
- Provide WebP as the first `<source>` for each size. AVIF as a further-first source where tooling supports it.
- Add `loading="lazy"` to every image that is not the LCP candidate.
- The LCP image (hero) must have `fetchpriority="high"` and a `<link rel="preload">` in `<head>`:

```html
<link rel="preload" as="image" href="img/header-bg.jpg" fetchpriority="high">
```

Always include a meaningful `alt`. Use empty `alt=""` only for decorative images.

## Japanese text wrapping

Wrap any text that may span two or more lines with `<budoux-ja>`:

```html
<h3 class="h3"><budoux-ja>ここに見出しが入ります。</budoux-ja></h3>
<p><budoux-ja>ここに本文が入ります。</budoux-ja></p>
```

Do not wrap interactive elements (`<a>`, `<button>`) — BudouX injects `<span>` and `<wbr>` nodes that can break accessible name computation.

## Inline foreign language content

When a Japanese page embeds English (brand names, navigation labels), mark it with `lang`:

```html
<span lang="en">Login</span>
```

Without this, screen readers pronounce English using a Japanese TTS voice.

## Class naming

Follow the component CSS naming convention (BEM-style):

| Pattern | Example | Use |
|---------|---------|-----|
| `block` | `.faq` | Component root |
| `block__element` | `.faq__q` | Child element |
| `l-*` | `.l-width`, `.l-margin` | Layout utility |
| `a-*` | `.a-red`, `.a-bold` | Accent/typography utility |
| `is-*` | `.is-shadow-l` | Visual state |
| `js-*` | `.js-toggle` | JS hook only — no styles on this class |

Do not invent new prefixes. Add new utilities under the appropriate prefix.

## Forms

Every `<input>`, `<select>`, and `<textarea>` requires an associated `<label>`. Placeholder text alone is not a label — it disappears on focus:

```html
<label for="email">メールアドレス</label>
<input type="email" id="email" name="email" autocomplete="email" required
       placeholder="例: name@example.com">
```

Never use `type="image"` for submit buttons. Use `<button>` instead:

```html
<!-- avoid -->
<input type="image" src="img/btn.png" />

<!-- use -->
<button type="submit">
  <img src="img/btn.png" alt="送信">
</button>
```

## Focus styles

Never remove `:focus` / `:focus-visible` outlines without providing a custom replacement. The replacement must have at least 3:1 contrast against adjacent colors (WCAG 2.4.11):

```css
/* avoid */
:focus { outline: none; }

/* ok — custom replacement */
:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }
```

## Figures

Use `<figcaption>` only when it adds information beyond the `alt`. When `<figcaption>` fully describes the image, set `alt=""` on the inner `<img>` to avoid screen readers announcing the description twice.

## Google Fonts

Always append `&display=swap` to the Google Fonts URL to prevent invisible text (FOIT) while the font loads:

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap"
      rel="stylesheet">
```

For Japanese, the full character set is large. Consider self-hosting a subset (e.g. with `glyphhanger` or Google Fonts subset parameter) to reduce transfer size.

## Performance targets

Every page must pass these thresholds on a simulated 4G mobile connection:

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| Total image weight | < 500KB |
| Total JS (excluding vendor) | < 50KB |

Check before delivery using Lighthouse or PageSpeed Insights. A design-faithful page that fails these thresholds is not complete.

## TODO

- [ ] OGP / SNS meta tag template (og:title, og:image, og:description) — required for LINE/X sharing
- [ ] Full accessibility checklist (ARIA landmark audit, color contrast)
