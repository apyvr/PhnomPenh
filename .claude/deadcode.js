window.__dead = function (cssText) {
  // strip comments, then pull selector lists from every rule, including inside @media
  var css = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  var sels = {}, keyframeNames = [], usedAnims = [], usedVars = [], declaredVars = [];

  css.replace(/@keyframes\s+([\w-]+)/g, function (m, n) { keyframeNames.push(n); return m; });
  css.replace(/animation(?:-name)?\s*:\s*([^;}]+)/g, function (m, v) { usedAnims.push(v); return m; });
  css.replace(/var\(\s*(--[\w-]+)/g, function (m, v) { usedVars.push(v); return m; });
  css.replace(/(--[\w-]+)\s*:/g, function (m, v) { declaredVars.push(v); return m; });

  // remove @keyframes bodies so their 0%/to selectors are not counted
  var body = css.replace(/@keyframes\s+[\w-]+\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  // remove at-rule headers, keep their inner rules
  body = body.replace(/@(media|supports)[^{]*\{/g, '').replace(/@[\w-]+[^{;]*;/g, '');

  var re = /([^{}]+)\{[^{}]*\}/g, m;
  while ((m = re.exec(body))) {
    m[1].split(',').forEach(function (s) {
      s = s.trim();
      if (!s || s.charAt(0) === '@' || s.charAt(0) === '}') return;
      sels[s] = true;
    });
  }

  function testable(s) {
    return s
      .replace(/::?(before|after|first-line|first-letter|selection|-webkit-[\w-]+|placeholder)\b/g, '')
      .replace(/:(hover|focus|focus-visible|active|visited|target)\b/g, '')
      .trim();
  }

  var dead = [], live = [], broken = [];
  Object.keys(sels).forEach(function (s) {
    var t = testable(s);
    if (!t) { live.push(s); return; }
    try {
      if (document.querySelector(t)) live.push(s); else dead.push(s);
    } catch (e) { broken.push(s + ' [' + e.message + ']'); }
  });

  var deadKf = keyframeNames.filter(function (n) {
    return !usedAnims.some(function (a) { return a.indexOf(n) !== -1; });
  });
  var deadVars = declaredVars.filter(function (v) { return usedVars.indexOf(v) === -1; });

  return { dead: dead.sort(), liveCount: live.length, broken: broken,
           deadKeyframes: deadKf, deadVars: deadVars };
};
