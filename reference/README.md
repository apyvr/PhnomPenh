# Reference

Nothing in this folder is part of the site. Do not link to it and do not upload it.

- `phnom-penh-homepage-original.html` is the homepage as it arrived, one 2.4MB file with
  every image embedded as base64 and all CSS in a `<style>` block. It is kept only as the
  record of what the split started from.

The split was verified to render identically to this file, box by box, at 1440px and 375px.
Two deliberate design changes were made afterwards, so the live site no longer matches it:
the four unsized section headings were given a real size, and `.link` was fixed. Both are
recorded in DESIGN.md section 10.

## butter-beef-wide.jpg / .webp

The photograph the `.feature` band used before the component was left unused. It is kept
here because `.feature` is still in the stylesheet waiting for a page. Nothing on the live
site references it, and `.feature-bg` no longer carries a hardcoded image, so a page that
uses `.feature` supplies its own photograph. Re-export this pair to `/images/` if it turns
out to be the right one.
