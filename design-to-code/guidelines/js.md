# JavaScript Guidelines

## Stack

- **jQuery 3.6.0** — DOM manipulation, event handling (vendored at `js/jquery-3.6.0.min.js`)
- **BudouX** — Japanese line-break optimization (custom element, no JS API call needed)

No build step. Target ES2017+. IE11 is not supported; if a specific project requires it, define a per-project override.

## File layout

```
js/
  jquery-3.6.0.min.js   ← vendored, do not edit
  function.js           ← all custom behavior for this page
```

Split into separate files at feature boundaries (e.g. `slider.js`, `modal.js`), not by line count. Line count above ~300 is a signal to consider splitting.

## function.js structure

Wrap everything in a document-ready handler. Declare all variables with `var` inside the handler — no module-scope variables, no implicit globals.

```js
$(function () {
  // scroll
  // animations
  // interactions
});
```

Guard against jQuery not loading:

```js
if (typeof jQuery === 'undefined') {
  console.error('jQuery failed to load');
  // stop — do not execute dependent code
  return;
}
```

No inline `<script>` blocks in HTML except third-party embeds.

## Smooth scroll

CSS `scroll-behavior: smooth` handles most cases. Use jQuery for offset control (e.g. subtracting a sticky header height). Exclude bare `href="#"` links:

```js
$('a[href^="#"]').not('[href="#"]').on('click', function (e) {
  var id = $(this).attr('href').slice(1);
  var target = $('#' + id);
  if (target.length) {
    e.preventDefault();
    var headerH = $('.js-sticky-header').outerHeight() || 0;
    $('html, body').animate({ scrollTop: target.offset().top - headerH }, 400);
  }
});
```

Key points:
- `e.preventDefault()` is inside the `if (target.length)` block — only fires when there is a valid target.
- Sticky header offset is wired up. Update the `.js-sticky-header` selector per project.

## Entrance animations (animate.css)

Feature-detect IntersectionObserver before using it. Place inside the document-ready handler. Check `prefers-reduced-motion` before adding animation classes:

```js
$(function () {
  if (!('IntersectionObserver' in window)) { return; }

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        if (!prefersReduced) {
          entry.target.classList.add('animate__animated', 'animate__fadeIn');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
  // threshold 0.2 + rootMargin avoids premature fire on small mobile screens

  document.querySelectorAll('.js-animate').forEach(function (el) {
    observer.observe(el);
  });
});
```

Never add `animate__animated` statically in HTML unless the animation fires on page load.

## Scroll event listeners

Use `{ passive: true }` on `scroll` and `touchstart` listeners to avoid blocking the browser's compositor thread. Wrap the handler body in `requestAnimationFrame` for visual updates:

```js
$(window).on('scroll', { passive: true }, function () {
  requestAnimationFrame(function () {
    // read scroll position and update DOM here
  });
});
```

## Event delegation

Use delegated events for elements that may be inserted after page load:

```js
// direct — use when elements exist at DOMContentLoaded
$('.js-toggle').on('click', fn);

// delegated — use when elements are injected dynamically
$(document).on('click', '.js-toggle', fn);
```

## Third-party injected content

Do not query for elements that third-party scripts (chat widgets, analytics, form tools) inject into the DOM inside the document-ready handler — they may not exist yet. Use a MutationObserver or the callback the third-party provides:

```js
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (m) {
    m.addedNodes.forEach(function (node) {
      if (node.classList && node.classList.contains('js-target')) {
        // handle injected element
        observer.disconnect();
      }
    });
  });
});
observer.observe(document.body, { childList: true, subtree: true });
```

## animate.css version

The animate.css class names changed between v3 and v4 (v4 uses `animate__` prefix; v3 uses bare names like `animated`). Pin the version in a comment at the top of `style.css` alongside the copied `@keyframes`:

```css
/* animate.css v4.1.1 — copied keyframes only: fadeIn, bounceIn */
```

## What not to do

- Do not use `document.write`.
- Do not load jQuery twice.
- Do not declare variables without `var`.
- Do not style `js-*` classes in CSS.
- Do not use `!important` in JavaScript-generated inline styles.

## TODO

- [ ] Evaluate migrating from jQuery to vanilla JS for new projects
- [ ] Keyboard navigation and focus trap for any modal/overlay (accessibility)
- [ ] Error boundary strategy for try/catch in critical interaction paths
