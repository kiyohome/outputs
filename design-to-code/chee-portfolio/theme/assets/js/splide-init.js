document.addEventListener('DOMContentLoaded', function () {
  const Extensions = (window.splide && window.splide.Extensions) ? window.splide.Extensions : {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // FV auto-scroll carousel
  const fvEl = document.querySelector('.fv-splide');
  if (fvEl && typeof Splide !== 'undefined') {
    var fvSplide = new Splide(fvEl, {
      type:       'loop',
      drag:       'free',
      arrows:     false,
      pagination: false,
      autoWidth:  true,
      gap:        '3rem',
      autoScroll: reducedMotion ? false : {
        speed:        1.2,
        pauseOnHover: true,
        pauseOnFocus: true,
      },
      breakpoints: {
        781:  { gap: '1.5rem' },
        1024: { gap: '2rem' },
      },
    });
    fvSplide.on('mounted', function () {
      fvEl.querySelectorAll('.splide__slide').forEach(function (slide) {
        var idx = parseInt(slide.getAttribute('data-splide-index') || '0', 10);
        if (idx % 2 === 0) slide.classList.add('fv-stagger');
      });
    });
    fvSplide.mount(Extensions);
  }

  // Voice carousel
  const voiceEl = document.querySelector('.voice-splide');
  if (voiceEl && typeof Splide !== 'undefined') {
    new Splide(voiceEl, {
      type:         'loop',
      autoplay:     !reducedMotion,
      interval:     8000,
      speed:        reducedMotion ? 0 : 600,
      perPage:      1,
      drag:         true,
      arrows:       true,
      pauseOnHover: true,
      pauseOnFocus: true,
    }).mount();
  }
});
