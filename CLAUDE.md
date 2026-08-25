# Phnom Penh Restaurant — Project Instructions

Read `DESIGN.md` in full before doing anything on this project. It is the single source of truth for all visual decisions. Do not propose or apply a colour, font, size, or spacing value that is not defined there.

## What this project is

A multipage marketing site for Phnom Penh Restaurant, 244 East Georgia Street, Vancouver Chinatown. Family run Cambodian and Vietnamese, open since 1985. Static HTML, CSS and one small script. No framework, no build step. It is hosted as plain files, but it must be served over http, because the header and footer are fetched at runtime.

## Current state

- `index.html` is the finished homepage. It is the visual reference for everything else.
- All six pages exist: `index.html`, `story.html` (Our Story), `menu.html`, `shop.html`, `reservations.html`, `visit.html`.
- `menu.html` is transcribed from the owner's real printed menu, `/.claude/real-menu.pdf`. 89 items, trilingual, with GF and V markers.
- The nav is Our Story, Shop, Menu, Visit plus a Call to order button.
- `shop.html` has no prices or photographs yet. See DESIGN.md 13.3.
- The split is done. CSS is in `/css/styles.css`, behaviour in `/js/site.js`, header and footer in `/partials/`, images are real files in `/images/`.
- The original single file homepage is in `/reference/`. It is not part of the site, is not linked to, and is not uploaded.
- `DESIGN.md` sections 2 through 9 describe the site as actually built. Section 10 lists the six defects found in the audit, four of which are fixed. Read it before changing anything visual.

## Hard rules

1. All styling lives in `/css/styles.css`. No inline styles and no `<style>` blocks in page files.
2. Header and footer come from `/partials/`. Never retype them into a page.
3. All behaviour lives in `/js/site.js`. No `<script>` blocks in page files.
4. Images are real files in `/images/`. Never base64, never embedded. Photographs are `<picture>` with `.webp` and a `.jpg` fallback.
5. No em dashes and no semicolons anywhere in visible copy.
6. Every value traces back to `DESIGN.md`. If something is missing, add it to `DESIGN.md` first, then use it.
7. Full-height sections use `svh` on mobile, not `vh`.

## How to work

- One page per session. Start by reading `DESIGN.md` and `/css/styles.css`, then build.
- A new page is a head, a `<div class="head-slot" data-partial="header"></div>`, section markup, and a `<div data-partial="footer"></div>`. Copy the head of `index.html`.
- Do not read `index.html` in full unless the task requires it. Read `/css/styles.css` instead. It is the smaller and more accurate source for styling.
- Never edit more than one page at a time. If a change affects other pages, say so in one line and wait to be asked.
- Check the work at 375px wide before calling it done, served over http, with a clean console.
- When a shared component changes, change it in the partial or the stylesheet, never per page.

## Checking your work

There is a small harness in `/.claude/`. It is dev tooling, not part of the site.

- `node .claude/static-server.js` serves the folder on port 8912. The partials need http, so this is how you view any page.
- `.claude/probe.js` records the rect and 37 computed properties of about 110 elements. Load it in the page and call `__save('name')` to write `.claude/snapshots/name.json`. Snapshot before a change and after, then diff the two, to prove a change only touched what you meant it to. It disables animation and forces the reveals first, so runs are repeatable.
- `.claude/deadcode.js` tests every selector in the stylesheet against the live DOM. Eight selectors are state dependent and only match with the menu open or the page scrolled, so check those before calling anything dead.

Two traps that have already cost time. Resize the viewport for real when measuring anything in `svh` or `vh`, because overriding `min-height` does not change what those units resolve to. And take snapshots at a settled scroll position, since `html{scroll-behavior:smooth}` makes `scrollTo` asynchronous.

## Copy voice

Plain and factual. No corny openers, no sentimental flourishes, no rhetorical questions. Grounded in verified facts only: 1985, Chinatown, the Huynh family, Michelin Bib Gourmand every year since 2022, not on delivery apps. Booking policy: walk in for five or fewer, call to reserve for six or more, large tables seated at 5:00pm or 7:00pm. See DESIGN.md section 7.

## The split, for reference

Done. The homepage began as one 2.4MB file with every image embedded as base64. It was split into the stylesheet, `/js/site.js`, the two partials and 13 image files, and the result was verified to render identically to the original at 1440px and 375px, box by box.

Two design fixes were then applied on top, so the live site deliberately no longer matches the original: every section heading now shares one size, and `.link` works outside `.panel`. The audit and the full defect list are `DESIGN.md` section 10.
