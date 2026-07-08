/* ── Dark mode ──────────────────────────────────────────────── */
(function () {
  var btn = document.getElementById('theme-btn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('hah-theme', next); } catch (e) {}
  });
})();

/* ── Hide fixed sidebar nav while video hero is in view ───────── */
(function () {
  var hero = document.querySelector('.video-hero');
  var nav = document.querySelector('.nav');
  if (!hero || !nav) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      nav.classList.toggle('nav--hidden', e.intersectionRatio > 0.4);
    });
  }, { threshold: [0, 0.4, 1] });
  io.observe(hero);
})();

/* ── Progress bar ───────────────────────────────────────────── */
(function () {
  var bar = document.getElementById('progress-bar');
  if (!bar) return;
  function update() {
    var h = document.documentElement;
    var pct = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight || document.body.scrollHeight) - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── Scroll reveal ──────────────────────────────────────────── */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();

/* ── Nav active link on scroll ──────────────────────────────── */
(function () {
  var links = document.querySelectorAll('.nav-links a');
  if (!links.length) return;
  var sections = Array.from(links).map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  function onScroll() {
    var y = window.scrollY + 80;
    var active = null;
    sections.forEach(function (s) { if (s.offsetTop <= y) active = s; });
    links.forEach(function (a) {
      var matches = active && a.getAttribute('href') === '#' + active.id;
      a.classList.toggle('active', !!matches);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Carousel ───────────────────────────────────────────────── */
(function () {
  var carousel = document.getElementById('task-carousel');
  if (!carousel) return;
  var track = carousel.querySelector('.carousel-track');
  var slides = carousel.querySelectorAll('.carousel-slide');
  var prev = carousel.querySelector('.prev');
  var next = carousel.querySelector('.next');
  var idx = 0;
  function go(n) { idx = (n + slides.length) % slides.length; track.style.transform = 'translateX(-' + idx * 100 + '%)'; }
  prev.addEventListener('click', function () { go(idx - 1); });
  next.addEventListener('click', function () { go(idx + 1); });
})();

/* ── BibTeX copy ────────────────────────────────────────────── */
(function () {
  var btn = document.getElementById('copy-bibtex');
  var code = document.getElementById('bibtex-code');
  if (!btn || !code) return;
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(code.textContent.trim()).then(function () {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
    });
  });
})();

/* ── Lightbox zoom ──────────────────────────────────────────── */
(function () {
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  if (!box || !img) return;

  document.querySelectorAll('.figure-card img, .hero-teaser img').forEach(function (el) {
    el.addEventListener('click', function () {
      img.src = el.src; img.alt = el.alt;
      box.classList.add('active');
    });
  });
  box.addEventListener('click', function () { box.classList.remove('active'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.classList.remove('active'); });
})();

/* ── Lazy-load & viewport-gated playback for grid videos ─────── */
(function () {
  var videos = document.querySelectorAll('.task-video video, .recovery-cell video');
  if (!videos.length) return;

  function load(v) {
    if (v.dataset.loaded) return;
    v.dataset.loaded = '1';
    v.querySelectorAll('source').forEach(function (s) {
      if (s.dataset.src) s.src = s.dataset.src;
    });
    v.load();
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        load(v);
        v.play().catch(function () {});
      } else {
        v.pause();
      }
    });
  }, { rootMargin: '700px 0px', threshold: 0.05 });

  videos.forEach(function (v) { io.observe(v); });
})();

/* ── Video hero fallback ───────────────────────────────────── */
(function () {
  var v = document.querySelector('.video-hero-video');
  if (!v) return;
  function showFallback() {
    v.style.display = 'none';
    var hero = v.closest('.video-hero');
    if (hero) hero.style.backgroundImage = 'url(' + v.getAttribute('poster') + ')';
    if (hero) { hero.style.backgroundSize = 'cover'; hero.style.backgroundPosition = 'center'; }
  }
  var src = v.querySelector('source');
  if (src) src.addEventListener('error', showFallback);
  v.addEventListener('error', showFallback, true);
})();
