window.__hero = function () {
  document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); });
  var hero = document.querySelector('.hero').getBoundingClientRect();
  var eb = document.querySelector('.hero .eyebrow').getBoundingClientRect();
  var cta = document.querySelector('.hero-cta').getBoundingClientRect();
  var top = eb.top - hero.top, bot = cta.bottom - hero.top, h = hero.height;
  return {
    vh: window.innerHeight,
    heroH: Math.round(h),
    emptyAbove: Math.round(top), pctAbove: Math.round(100 * top / h),
    blockCentrePct: Math.round(100 * ((top + bot) / 2) / h),
    emptyBelow: Math.round(h - bot),
    overflows: (h - bot) < 0 || top < 0
  };
};
