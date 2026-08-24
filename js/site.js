/* Phnom Penh Restaurant, shared behaviour for every page.
   1. Swaps the header and footer partials into their slots.
   2. Wires the sticky header, the mobile menu and the scroll reveals.
   No page should carry a <script> block of its own. */

(function () {
  'use strict';

  /* ---------- partials ---------------------------------------------------- */
  function loadPartials() {
    var slots = [].slice.call(document.querySelectorAll('[data-partial]'));
    return Promise.all(slots.map(function (slot) {
      var name = slot.getAttribute('data-partial');
      return fetch('partials/' + name + '.html')
        .then(function (r) {
          if (!r.ok) throw new Error(r.status + ' ' + r.statusText);
          return r.text();
        })
        .then(function (html) {
          var tpl = document.createElement('template');
          tpl.innerHTML = html.trim();
          slot.replaceWith(tpl.content);
        })
        .catch(function (err) {
          console.error('Could not load partials/' + name + '.html. ' +
            'Serve the site over http, not from the file system. ' + err.message);
        });
    }));
  }

  /* ---------- same page anchors -------------------------------------------
     The partials link to index.html#legacy so they work from every page.
     On the homepage itself that would reload, so those links are shortened
     back to a bare hash and scroll smoothly instead. */
  function localiseAnchors() {
    var here = location.pathname.replace(/\/$/, '/index.html');
    document.querySelectorAll('a[href*="#"]').forEach(function (a) {
      try {
        var url = new URL(a.getAttribute('href'), location.href);
        if (url.origin === location.origin && url.pathname === here && url.hash) {
          a.setAttribute('href', url.hash);
        }
      } catch (e) { /* an href we cannot parse is left exactly as authored */ }
    });
  }

  /* ---------- sticky header ----------------------------------------------- */
  function initHeader() {
    var head = document.getElementById('head');
    if (!head) return;
    var onScroll = function () { head.classList.toggle('solid', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile menu -------------------------------------------------- */
  function initMenu() {
    var burger = document.getElementById('burger');
    var mm = document.getElementById('mobileMenu');
    var mmClose = document.getElementById('mmClose');
    if (!burger || !mm || !mmClose) return;

    function setMenu(open) {
      mm.classList.toggle('open', open);
      burger.classList.toggle('open', open);
      mm.setAttribute('aria-hidden', open ? 'false' : 'true');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () { setMenu(!mm.classList.contains('open')); });
    mmClose.addEventListener('click', function () { setMenu(false); });
    mm.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ---------- menu section navigation ------------------------------------ */
  function initMenuNav() {
    var nav = document.getElementById('menu-nav');
    if (!nav) return;
    var tabs = nav.querySelectorAll('.menu-nav-tab');
    if (!tabs.length) return;

    var menuCats = document.querySelector('.menu-cats');
    if (!menuCats) return;

    var sections = menuCats.querySelectorAll('[id]');
    if (!sections.length) return;

    // Show nav
    nav.classList.add('on');

    // Show first section on load
    if (sections[0]) { sections[0].classList.add('active'); tabs[0].classList.add('active'); }

    // Tab click handler - show/hide sections
    tabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();

        // Hide all sections
        sections.forEach(function (sec) { sec.classList.remove('active'); });
        tabs.forEach(function (t) { t.classList.remove('active'); });

        // Show clicked section
        if (sections[idx]) { sections[idx].classList.add('active'); }
        this.classList.add('active');
      });
    });
  }

  /* ---------- scroll reveal ------------------------------------------------ */
  function initReveals() {
    var reveals = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });

    reveals.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95) { el.classList.add('in'); }  // already in view on load
      else { io.observe(el); }
    });

    window.addEventListener('load', function () {
      document.querySelectorAll('.hero .reveal').forEach(function (el) { el.classList.add('in'); });
    });
  }

  /* Reveals only touch main, which is already in the page, so they run now.
     Waiting on the partial fetches would delay the first paint of the hero. */
  initReveals();

  loadPartials().then(function () {
    localiseAnchors();
    initHeader();
    initMenu();
    initMenuNav();
  });
})();
