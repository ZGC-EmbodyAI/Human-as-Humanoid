// Copy-to-clipboard for BibTeX
(function () {
  var btn = document.getElementById('copy-bibtex');
  var code = document.getElementById('bibtex-code');
  if (!btn || !code) return;
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(code.textContent.trim()).then(function () {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1800);
    });
  });
})();

// Carousel
(function () {
  var carousel = document.getElementById('task-carousel');
  if (!carousel) return;
  var track = carousel.querySelector('.carousel-track');
  var slides = carousel.querySelectorAll('.carousel-slide');
  var prev = carousel.querySelector('.prev');
  var next = carousel.querySelector('.next');
  var index = 0;

  function update() {
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
  }

  prev.addEventListener('click', function () {
    index = (index - 1 + slides.length) % slides.length;
    update();
  });

  next.addEventListener('click', function () {
    index = (index + 1) % slides.length;
    update();
  });
})();

// Lightbox zoom for figures
(function () {
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  var overlayImg = document.createElement('img');
  overlay.appendChild(overlayImg);
  document.body.appendChild(overlay);

  function close() {
    overlay.classList.remove('active');
  }

  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  document.querySelectorAll('.zoomable img').forEach(function (img) {
    img.addEventListener('click', function () {
      overlayImg.src = img.src;
      overlayImg.alt = img.alt;
      overlay.classList.add('active');
    });
  });
})();

// Graceful video fallback: if the teaser video source 404s, show the static image instead
(function () {
  var video = document.querySelector('.teaser-video');
  if (!video) return;
  video.addEventListener('error', showFallback, true);
  var source = video.querySelector('source');
  if (source) source.addEventListener('error', showFallback);

  function showFallback() {
    video.style.display = 'none';
    var fallback = document.querySelector('.teaser-fallback-img');
    if (fallback) fallback.style.display = 'block';
  }
})();
