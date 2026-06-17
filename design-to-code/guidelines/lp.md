# LP-Specific Guidelines

Supplements to the common guidelines (html.md / css.md / js.md) for Landing Pages.

## HTML

### robots meta

Always add `noindex, nofollow` to prevent accidental indexing before release. Include a launch-gate comment so it cannot be silently forgotten:

```html
<!-- TODO(launch): remove noindex before publishing -->
<meta name="robots" content="noindex, nofollow">
```

### CTA button

Use `<picture>` with non-overlapping breakpoints. `alt` must describe the action, not the image:

```html
<div class="cta l-margin">
  <a class="cta__btn" href="#order" style="display:block; min-height:44px;">
    <picture>
      <source srcset="img/cta__btn--sp.webp" type="image/webp" media="(max-width: 599px)">
      <source srcset="img/cta__btn--sp.png"  media="(max-width: 599px)">
      <source srcset="img/cta__btn.webp"     type="image/webp">
      <img src="img/cta__btn.png" alt="今すぐ申し込む" class="is-shadow-l" loading="lazy">
    </picture>
  </a>
</div>
```

The `<a>` must have a minimum tap target of 44px (WCAG 2.5.5). Add `style="display:block; min-height:44px;"` or handle via CSS.

### Sticky footer button

Place immediately before `</body>`. The anchor target is the main order form (`#order`):

```html
<div class="sticky-footer-btn js-sticky-btn">
  <a href="#order">
    <img src="img/btn.png" alt="申し込みはこちら">
  </a>
</div>
```

### Lead capture form

Associate every input with a `<label>`. Use `name`, `autocomplete`, and `required`:

```html
<section class="form l-margin l-padding">
  <h4 class="form__title">タイトル</h4>
  <form action="..." method="post">
    <label for="email">メールアドレス</label>
    <input type="email" id="email" name="email"
           autocomplete="email" required
           placeholder="例: name@example.com">
    <button class="form__btn" type="submit">
      <img src="img/form__btn.png" alt="無料で申し込む">
    </button>
    <!-- inline error target -->
    <p class="form__error" role="alert" aria-live="polite" hidden></p>
  </form>
</section>
```

## CSS

### Sticky footer button

Initial state is hidden; `.is-visible` reveals it. Use `left: 0` + `width: 100%` — do not use `left: 50%` with `transform`:

```css
.sticky-footer-btn {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  padding: 16px;
  background: rgb(0 0 0 / .3);
  text-align: center;
  line-height: 1;
}

.sticky-footer-btn.is-visible {
  display: block;
}

/* Reserve space — measure actual rendered button height per project */
.footer {
  padding-bottom: var(--sticky-btn-height, 140px);
}

@media (max-width: 599px) {
  .footer {
    padding-bottom: var(--sticky-btn-height-sp, 124px);
  }
}
```

Update `--sticky-btn-height` and `--sticky-btn-height-sp` to match the actual rendered button height.

## JS

### Sticky footer button

Use `requestAnimationFrame` inside a passive scroll listener:

```js
$(window).on('scroll', { passive: true }, function () {
  requestAnimationFrame(function () {
    var past = $(window).scrollTop() > 300;
    $('.js-sticky-btn').toggleClass('is-visible', past);
  });
});
```

### Lead capture form validation

Display errors inline — never use `alert()`. `alert()` is blocked in LINE Browser (dominant Japanese LP traffic channel):

```js
$('.form form').on('submit', function (e) {
  var $form = $(this);
  var $error = $form.find('.form__error');
  var email = $form.find('input[type="email"]').val().trim();

  if (!email) {
    e.preventDefault();
    $error.text('メールアドレスを入力してください。').removeAttr('hidden');
    $form.find('input[type="email"]').focus();
  } else {
    $error.attr('hidden', '');
  }
});
```

### Third-party video embed (Vimeo)

**Preferred — facade pattern** (loads Vimeo only on user interaction):

```html
<div class="video l-margin js-video-facade"
     data-src="https://player.vimeo.com/video/000000000">
  <img src="img/video-poster.jpg" alt="動画のサムネイル">
  <button type="button" class="video__play-btn" aria-label="動画を再生">▶</button>
</div>
```

```js
$(document).on('click', '.js-video-facade', function () {
  var src = $(this).data('src');
  $(this).replaceWith(
    '<div class="video l-margin" style="aspect-ratio:16/9; position:relative;">' +
    '<iframe src="' + src + '?autoplay=1" style="position:absolute;inset:0;width:100%;height:100%;"' +
    ' allow="autoplay; fullscreen" allowfullscreen></iframe></div>'
  );
});
```

**Fallback — direct embed** (when autoplay or analytics require it):

```html
<div class="video l-margin">
  <!-- aspect-ratio CSS replaces the old padding-top hack -->
  <div style="aspect-ratio: 16 / 9; position: relative;">
    <iframe src="https://player.vimeo.com/video/000000000"
            style="position:absolute;inset:0;width:100%;height:100%;"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen title="動画タイトル"></iframe>
  </div>
  <script src="https://player.vimeo.com/api/player.js"></script>
</div>
```

The inline styles on the wrapper are intentional — they are the aspect-ratio technique for iframes and must not be moved to an external class. `aspect-ratio: 16 / 9` is preferred over the old `padding-top: 56.25%` hack (baseline since 2022).

Add preconnect hints in `<head>` when Vimeo is used:

```html
<link rel="preconnect" href="https://player.vimeo.com">
<link rel="preconnect" href="https://f.vimeocdn.com" crossorigin>
```

## TODO

- [ ] Conversion tracking — GA4 event pattern for form submit and CTA click
- [ ] GTM integration skeleton (head snippet + noscript body placement)
- [ ] A/B testing hooks — naming convention for variant classes
- [ ] noindex removal checklist for launch review
