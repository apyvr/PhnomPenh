window.__resp = function () {
  document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); });
  var vw = document.documentElement.clientWidth;
  var out = { vw: vw, vh: window.innerHeight };

  // 1. horizontal overflow
  out.scrollWidth = document.documentElement.scrollWidth;
  out.hScroll = document.documentElement.scrollWidth > vw + 1;
  out.overflowing = [].slice.call(document.querySelectorAll('body *')).filter(function (el) {
    var r = el.getBoundingClientRect();
    if (!r.width) return false;
    var cn = (typeof el.className === 'string' ? el.className : '');
    if (/hero-bg|mobile-menu|mm-|hero-scrim/.test(cn)) return false;   // fixed / decorative
    return r.right > vw + 1 || r.left < -1;
  }).map(function (el) {
    var r = el.getBoundingClientRect();
    return (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : el.tagName)
      + ' [' + Math.round(r.left) + '..' + Math.round(r.right) + ']';
  }).slice(0, 6);

  // 2. layout state of every grid that changes
  var grids = ['.pop-grid','.legacy-collage','.visit-grid','.foot-top','.foot-cols',
               '.news-grid','.news-feature','.mich-years','.pop-more-list'];
  out.cols = {};
  grids.forEach(function (s) {
    var el = document.querySelector(s);
    if (el) out.cols[s] = getComputedStyle(el).gridTemplateColumns.split(' ').length;
  });

  // 3. nav mode
  var links = document.querySelector('.nav-links'), burger = document.querySelector('.burger');
  out.nav = (links && getComputedStyle(links).display !== 'none') ? 'desktop links'
          : (burger && getComputedStyle(burger).display !== 'none') ? 'burger' : 'NEITHER';

  // 4. touch targets under 44px (only meaningful on touch widths)
  out.smallTargets = [].slice.call(document.querySelectorAll('a[href], button')).filter(function (el) {
    var r = el.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    if (el.closest('.mobile-menu')) return false;
    return r.height < 44;
  }).map(function (el) {
    var r = el.getBoundingClientRect();
    return (el.className || el.tagName) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height);
  }).slice(0, 8);

  // 5. line length of the body paragraphs, in characters
  out.lineLengths = {};
  [['.hero-sub','.hero-sub'],['.legacy-lead','.legacy-lead'],['.pop-lead','.pop-lead'],
   ['.pop-why','.pop-why'],['.visit-note p','.visit-note p']].forEach(function (pair) {
    var el = document.querySelector(pair[1]); if (!el) return;
    var cs = getComputedStyle(el);
    var ch = parseFloat(cs.fontSize) * 0.5;               // rough average glyph advance
    out.lineLengths[pair[0]] = Math.round(el.getBoundingClientRect().width / ch);
  });

  // 6. hero
  var hero = document.querySelector('.hero'), eb = document.querySelector('.hero .eyebrow'),
      cta = document.querySelector('.hero-cta');
  if (hero && eb && cta) {
    var hr = hero.getBoundingClientRect();
    out.hero = { h: Math.round(hr.height),
      pctAbove: Math.round(100 * (eb.getBoundingClientRect().top - hr.top) / hr.height),
      spillsBelow: cta.getBoundingClientRect().bottom > hr.bottom + 1 };
  }
  return out;
};
