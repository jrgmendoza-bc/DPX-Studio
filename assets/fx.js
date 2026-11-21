(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $ = function (s) { return document.querySelector(s); };

  /* topbar + scroll progress */
  var bar = $('#topbar'), prog = $('#progress');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.classList.toggle('scrolled', y > 30);
    if (prog) prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* reveal on scroll */
  var groups = ['.sechead', '.pillar', '.svc', '.gal', '.step', '#book .card', '#book .glowbox', '#visit > div'];
  var items = [];
  groups.forEach(function (sel) {
    var list = document.querySelectorAll(sel);
    for (var i = 0; i < list.length; i++) {
      list[i].classList.add('rv');
      list[i].style.setProperty('--d', (i % 3) * 0.12 + 's');
      items.push(list[i]);
    }
  });
  function show(el) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    if (el.classList.contains('step')) el.classList.add('fill');
    setTimeout(function () { el.classList.remove('rv', 'in'); el.style.removeProperty('--d'); }, 1500);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.remove('rv'); el.classList.add('fill'); });
  }
  setTimeout(function () { items.forEach(function (el) { if (el.classList.contains('rv')) show(el); }); }, 6000);

  /* hero: pointer spotlight + photo tilt */
  var hero = $('#top'), photo = $('#photo'), spot = $('.spot');
  if (hero && fine && !reduce) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--mx', (x * 100) + '%');
      hero.style.setProperty('--my', (y * 100) + '%');
      if (photo) photo.style.transform = 'perspective(900px) rotateY(' + ((x - 0.5) * 7) + 'deg) rotateX(' + ((0.5 - y) * 5) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () { if (photo) photo.style.transform = ''; });
  }

  /* hero: floating dust */
  var cv = $('#dust');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d'), dots = [], W = 0, H = 0, run = true, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() {
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(initial) {
      return { x: Math.random() * W, y: initial ? Math.random() * H : H + 10, r: Math.random() * 1.6 + 0.4, v: Math.random() * 0.25 + 0.08, d: Math.random() * 0.6 - 0.3, a: Math.random() * 0.45 + 0.15 };
    }
    size();
    var count = W < 700 ? 28 : 60;
    for (var i = 0; i < count; i++) dots.push(make(true));
    window.addEventListener('resize', size);
    new IntersectionObserver(function (en) { run = en[0].isIntersecting; if (run) tick(); }).observe(hero);
    function tick() {
      if (!run) return;
      ctx.clearRect(0, 0, W, H);
      for (var k = 0; k < dots.length; k++) {
        var d = dots[k];
        d.y -= d.v; d.x += d.d * 0.2;
        if (d.y < -10) dots[k] = make(false);
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.2832);
        ctx.fillStyle = 'rgba(234,231,223,' + d.a + ')'; ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    tick();
  }
})();
