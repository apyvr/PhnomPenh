window.__headcheck = function () {
  var head = document.querySelector('.page-head');
  if (!head) return { page: location.pathname, pageHead: false };
  var lead = document.querySelector('.page-lead');
  var next = head.nextElementSibling;
  var h = head.getBoundingClientRect(), l = lead.getBoundingClientRect(), n = next.getBoundingClientRect();
  return {
    page: location.pathname,
    nextSection: next.className.split(' ')[0],
    gapUnderLead: Math.round(h.bottom - l.bottom),
    overflows: l.bottom > h.bottom + 0.5,
    gapToNextContent: Math.round(n.top + parseFloat(getComputedStyle(next).paddingTop) - h.bottom)
  };
};
