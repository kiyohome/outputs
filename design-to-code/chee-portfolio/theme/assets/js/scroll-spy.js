document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var links = header.querySelectorAll('.wp-block-navigation-item a');
  if (!links.length) return;

  var sections = [];
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var hash = href.includes('#') ? href.split('#')[1] : null;
    if (!hash) return;
    var el = document.getElementById(hash);
    if (el) sections.push({ el: el, link: link });
  });

  if (!sections.length) return;

  var headerHeight = header.offsetHeight;
  var activeClass = 'is-active-nav';
  var current = null;

  function update() {
    var scrollY = window.scrollY + headerHeight + 1;
    var found = null;

    for (var i = sections.length - 1; i >= 0; i--) {
      if (sections[i].el.offsetTop <= scrollY) {
        found = sections[i];
        break;
      }
    }

    if (found === current) return;
    if (current) current.link.classList.remove(activeClass);
    if (found) found.link.classList.add(activeClass);
    current = found;
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('hashchange', function () {
    setTimeout(update, 100);
  });

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      setTimeout(update, 100);
    });
  });

  update();
});
