window.__probe = function () {
  var SELS = ['.site-head','.nav','.brand img','.nav-links','.nav-cta','.burger','.mobile-menu','.mm-btn','.hero','.hero-bg','.hero-scrim','.hero-inner','.hero .eyebrow','.hero h1','.hero h1 .amp','.hero-sub','.hero-cta','.hero-cta .btn','.btn-ghost','.scroll-cue','.mich','.mich-wrap','.mich-emblem','.mich-eyebrow','.mich-h2','.mich-tl','.mich-years','.mich-years span','.mich-track','.mt-dot','.mich-labels','.mich-labels span','.mich-sub','.legacy','.legacy-head','.legacy-head .eyebrow','.legacy-h2','.legacy-lead','.legacy-collage','.lc-big','.lc-full','.lc-half','.lc-big img','.lc-full img','.lc-half img','.legacy-cta-wrap','.popular','.pop-head','.pop-head .eyebrow','.pop-head h2','.pop-lead','.pop-grid','.pop','.pop-img','.pop-img img','.pop-img picture','.pop-tag','.pop-body','.pop-body h3','.pop-price','.pop-why','.pop-more','.pop-more h4','.pop-more-list','.pm','.pm-name','.pm-dots','.pm-price','.pop-cta','.pop-note','.popular .btn','.news','.news-head','.news-head h2','.news-feature','.nf-side','.nf-label','.nf-meta','.nf-main','.nf-main h3','.nf-main p','.news-grid','.nc','.nc-top','.nc-src','.nc-read','.nc h3','.nc p','.visit','.visit-head','.visit-head .eyebrow','.visit-head h2','.visit-grid','.visit-col','.visit-col h4','.visit-col p','.visit-col .link','.visit-note','.visit-note p','.visit-cta','.foot','.foot-top','.foot-brand','.foot-brand img','.foot-brand p','.foot-cols','.foot-col','.foot-col h4','.foot-col a','.foot-bottom','.wrap','main'];
  var PROPS = ['fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','textTransform','color','backgroundColor','backgroundSize','backgroundPosition','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginBottom','borderTopWidth','borderTopColor','borderBottomWidth','borderRadius','display','gridTemplateColumns','gap','maxWidth','minHeight','objectFit','objectPosition','aspectRatio','position','textAlign','flexDirection','justifyContent','alignItems','opacity','overflow','zIndex'];
  var o = { docHeight: document.documentElement.scrollHeight, vw: window.innerWidth, vh: window.innerHeight, scrollY: window.scrollY };
  SELS.forEach(function (s) {
    var el = document.querySelector(s);
    if (!el) { o[s] = 'MISSING'; return; }
    var r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    o[s] = { rect: [Math.round(r.x), Math.round(r.y + window.scrollY), Math.round(r.width), Math.round(r.height)].join(',') };
    PROPS.forEach(function (p) { o[s][p] = cs[p]; });
  });
  return o;
};
window.__save = function (name) {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var kill = document.createElement('style');
  kill.textContent = '*{animation:none!important;transition:none!important;scroll-behavior:auto!important}.hero-bg{transform:scale(1)!important}';
  document.head.appendChild(kill);
  document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
  var htmlEl = document.documentElement;
  var prev = htmlEl.style.scrollBehavior;
  htmlEl.style.scrollBehavior = 'auto';          // defeat html{scroll-behavior:smooth}
  window.scrollTo(0, 0); document.body.scrollTop = 0;
  return new Promise(function (res) { setTimeout(function(){ requestAnimationFrame(function () { requestAnimationFrame(res); }); }, 700); })
    .then(function () {
      var d = window.__probe();
      htmlEl.style.scrollBehavior = prev;
      return fetch('/__snap/' + name, { method: 'POST', body: JSON.stringify(d, null, 1) }).then(function (r) { return r.text(); });
    });
};
