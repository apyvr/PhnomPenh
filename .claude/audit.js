window.__audit = function () {
  document.documentElement.style.scrollBehavior = 'auto';
  document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); });
  document.querySelectorAll('img[loading=lazy]').forEach(function (i) { i.loading = 'eager'; });
  var H = document.documentElement.scrollHeight;
  for (var y = 0; y < H; y += 400) window.scrollTo(0, y);
  window.scrollTo(0, 0);
  return new Promise(function (res) {
    setTimeout(function () {
      var vw = document.documentElement.clientWidth;
      var g = function (s) { var e = document.querySelector(s);
        return e ? getComputedStyle(e).gridTemplateColumns.split(' ').length : null; };
      var imgs = [].slice.call(document.querySelectorAll('img')).map(function (i) {
        var r = i.getBoundingClientRect();
        if (!r.width || !i.naturalWidth) return null;
        return { n: i.currentSrc.split('/').pop(), x: +(i.naturalWidth / r.width).toFixed(2) };
      }).filter(Boolean);
      var worst = imgs.reduce(function (a, b) { return b.x < a.x ? b : a; }, imgs[0]);
      var over = [].slice.call(document.querySelectorAll('body *')).filter(function (el) {
        var r = el.getBoundingClientRect(); if (!r.width) return false;
        var cn = (typeof el.className === 'string' ? el.className : '');
        if (/hero-bg|mobile-menu|mm-|hero-scrim/.test(cn)) return false;
        return r.right > vw + 1 || r.left < -1;
      }).length;
      var py = document.querySelector('.pop-why');
      res({
        vw: vw,
        hScroll: document.documentElement.scrollWidth > vw + 1,
        overflowing: over,
        nav: getComputedStyle(document.querySelector('.nav-links')).display !== 'none' ? 'links' : 'burger',
        pop: g('.pop-grid'), collage: g('.legacy-collage'), visit: g('.visit-grid'),
        news: g('.news-grid'), footTop: g('.foot-top'), footCols: g('.foot-cols'),
        popWhyChars: Math.round(py.getBoundingClientRect().width / (parseFloat(getComputedStyle(py).fontSize) * 0.5)),
        worstImage: worst.n + ' ' + worst.x + 'x',
        under2x: imgs.filter(function (i) { return i.x < 1.9; }).length
      });
    }, 1200);
  });
};
