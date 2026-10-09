/* Portfolio behaviour: ticker, threshold demo, project cards and detail view, checker demo. No dependencies. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- ticker (list repeated twice so the loop is seamless) ---------- */
  var items = (window.TICKER || []).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
  $('ticker').innerHTML = items + items;

  /* ---------- tag lists ---------- */
  document.querySelectorAll('[data-tags]').forEach(function (el) {
    el.innerHTML = el.getAttribute('data-tags').split('|').map(function (t) {
      return '<span class="rounded-full border border-line bg-surface px-3.5 py-1 text-sm">' + t + '</span>';
    }).join('');
  });

  /* ---------- nav highlight ---------- */
  var links = document.querySelectorAll('.nav-link');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'play', 'experience', 'projects', 'resume', 'contact'].forEach(function (id) { var s = $(id); if (s) io.observe(s); });
  }

  /* ---------- threshold demo ---------- */
  var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var noise = [0.8, -1.2, 1.9, -0.4, 2.3, -1.7, 0.5, 1.1, -2.0, 0.2, -0.9, 1.6, -1.4, 2.1, -0.6, 0.9, -1.8, 1.3, 0.4, -2.2, 1.0, -0.7, 1.7, -1.1];
  var planted = { 6: 12.5, 12: -10.5, 18: 15 };
  var events = { 6: 'annual software licence billed early', 18: 'one-time office move' };
  var data = noise.map(function (n, i) {
    var b = 400 + 4 * i, v = planted[i] !== undefined ? planted[i] : n, a = Math.round(b * (1 + v / 100) * 10) / 10;
    return { i: i, b: b, a: a, v: (a - b) / b * 100, name: M[i % 12] + ' Year ' + (i < 12 ? 1 : 2) };
  });
  function median(x) { var s = x.slice().sort(function (p, q) { return p - q; }), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
  var vs = data.map(function (d) { return d.v; }), mv = median(vs);
  var mad = 1.4826 * median(vs.map(function (v) { return Math.abs(v - mv); }));
  var k = 3.5, sel = 6;
  var chart = $('chart'), stats = $('stats'), readout = $('readout'), chips = $('flagchips'), kin = $('k'), kout = $('kout');
  function flagged(d) { return Math.abs(d.v - mv) > k * mad; }
  function money(n) { return '$' + n.toFixed(1).replace(/\.0$/, '') + 'K'; }

  function draw() {
    var w = Math.max(280, chart.clientWidth), h = w < 560 ? 280 : 340, L = 46, R = 12, T = 14, B = 30, y0 = 360, y1 = 580;
    var X = function (i) { return L + (w - L - R) * i / 23; };
    var Y = function (v) { return T + (h - T - B) * (1 - (v - y0) / (y1 - y0)); };
    var clamp = function (v) { return Math.min(y1, Math.max(y0, v)); };
    var o = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">';
    [400, 450, 500, 550].forEach(function (g) {
      o += '<line class="grid-line" x1="' + L + '" x2="' + (w - R) + '" y1="' + Y(g) + '" y2="' + Y(g) + '"/><text x="' + (L - 8) + '" y="' + (Y(g) + 4) + '" text-anchor="end">$' + g + 'K</text>';
    });
    var step = w < 560 ? 6 : 3;
    data.forEach(function (d) { if (d.i % step === 0) o += '<text x="' + X(d.i) + '" y="' + (h - 8) + '" text-anchor="middle">' + M[d.i % 12] + (d.i % 12 === 0 ? ' Y' + (d.i < 12 ? 1 : 2) : '') + '</text>'; });
    var up = data.map(function (d, j) { return (j ? 'L' : 'M') + X(d.i) + ' ' + Y(clamp(d.b * (1 + (mv + k * mad) / 100))); }).join('');
    var lo = data.slice().reverse().map(function (d) { return 'L' + X(d.i) + ' ' + Y(clamp(d.b * (1 + (mv - k * mad) / 100))); }).join('');
    o += '<path class="band" d="' + up + lo + 'Z"/>';
    o += '<polyline class="budget" points="' + data.map(function (d) { return X(d.i) + ',' + Y(d.b); }).join(' ') + '"/>';
    o += '<polyline class="actual" points="' + data.map(function (d) { return X(d.i) + ',' + Y(d.a); }).join(' ') + '"/>';
    data.forEach(function (d) {
      var f = flagged(d), cx = X(d.i), cy = Y(d.a);
      if (f) o += '<circle class="pulse" cx="' + cx + '" cy="' + cy + '" r="6"/>';
      o += '<circle class="dot' + (f ? ' flag' : '') + (d.i === sel ? ' sel' : '') + '" cx="' + cx + '" cy="' + cy + '" r="' + (f ? 6 : 3.5) + '"/>';
      o += '<circle class="hit" data-i="' + d.i + '" cx="' + cx + '" cy="' + cy + '" r="12" tabindex="0" role="button" aria-label="' + d.name + ', actual ' + money(d.a) + (f ? ', flagged' : '') + '"/>';
    });
    chart.innerHTML = o + '</svg>';
  }
  function note(d) {
    var diff = d.a - d.b, dir = diff > 0 ? 'over' : 'under';
    var txt = d.name + ': actual ' + money(d.a) + ' against a budget of ' + money(d.b) + ', ' + money(Math.abs(diff)) + ' ' + dir + ' budget (' + (d.v > 0 ? '+' : '') + d.v.toFixed(1) + '%).';
    if (!flagged(d)) return txt + '<br>Inside the normal range. No commentary is drafted.';
    return txt + '<br>' + (events[d.i] ? '<span class="drv">Driver: ' + events[d.i] + ' (from the event log).</span>' : '<span class="pend">Driver: pending analyst review.</span>');
  }
  function update() {
    kout.textContent = k.toFixed(1);
    var fl = data.filter(flagged), caught = fl.filter(function (d) { return planted[d.i] !== undefined; }).length;
    stats.innerHTML = '<span>Flagged <b class="font-medium text-flag">' + fl.length + '</b> of 24</span><span>Planted anomalies caught <b class="font-medium text-accent">' + caught + '</b> of 3</span><span>False alarms <b class="font-medium text-flag">' + (fl.length - caught) + '</b></span>';
    chips.innerHTML = fl.length ? fl.map(function (d) { return '<button type="button" class="chip" data-i="' + d.i + '" aria-pressed="' + (d.i === sel) + '">' + d.name.replace(' Year ', ' Y') + '</button>'; }).join('') : '<span class="text-[13px] text-muted">Nothing flagged at this threshold. Try lowering it.</span>';
    readout.innerHTML = note(data[sel]);
    draw();
  }
  kin.addEventListener('input', function () { k = parseFloat(kin.value); update(); });
  function pick(e) { var t = e.target.closest('[data-i]'); if (!t) return; sel = +t.getAttribute('data-i'); update(); }
  chart.addEventListener('click', pick);
  chips.addEventListener('click', pick);
  chart.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e); } });
  if (window.ResizeObserver) { var lastW = 0; new ResizeObserver(function () { var w = chart.clientWidth; if (w !== lastW) { lastW = w; draw(); } }).observe(chart); }
  update();

  /* ---------- checker demo (shown inside the AI project's detail view) ---------- */
  var drafts = [
    { t: 'Marketing spent $138K against a $120K budget, $18K over budget.', ok: true, r: [] },
    { t: 'Marketing costs rose because of supplier price increases.', r: ['Gives a cause, but no reason is logged for this row.', 'Contains a sentence with no figure behind it.'] },
    { t: 'Marketing spend was $138K, which may be $18K over budget due to campaign timing.', r: ['Speculates ("may").', 'Gives a cause, but no reason is logged for this row.'] },
    { t: 'Marketing spent $138K against a $120K budget, $18K under budget.', r: ['Gets the direction wrong: spending was over budget, not under.'] },
    { t: 'Marketing spent $150K against a $120K budget.', r: ['States a number that is not in the facts ($150K).'] },
    { t: "Marketing's actual was $120K against a budget of $138K.", r: ['Attaches numbers to the wrong labels: $120K is the budget, $138K is the actual.'] }
  ];
  var ds = 1;
  function checkerHTML() {
    return '<div class="rounded-2xl border border-line bg-bg p-4 sm:p-5">' +
      '<p class="text-[15px] text-muted">Pick a draft and see whether it gets through.</p>' +
      '<div class="mt-3 overflow-x-auto rounded-xl border border-dashed border-line bg-surface p-3 text-[13px] leading-[1.7]" aria-label="Facts packet">unit: Marketing<br>budget: $120K &nbsp; actual: $138K &nbsp; forecast: $124K<br>variance: +$18K (+15.0%)<br>logged reason: none</div>' +
      '<div id="drafts" class="my-3.5 flex flex-wrap gap-2" role="group" aria-label="Sample drafts"></div>' +
      '<div id="verdict" class="verdict text-[15px] leading-relaxed" aria-live="polite"></div>' +
      '<p class="mt-3 text-[13px] text-muted">Illustrative drafts written for this page, using made-up figures. Not output from the real system.</p></div>';
  }
  function showDraft() {
    var dEl = $('drafts'), vEl = $('verdict');
    dEl.innerHTML = drafts.map(function (d, i) { return '<button type="button" class="chip" data-d="' + i + '" aria-pressed="' + (i === ds) + '">Draft ' + String.fromCharCode(65 + i) + '</button>'; }).join('');
    var d = drafts[ds], h = '<div class="mb-3 rounded-xl bg-surface p-3 text-base">' + esc(d.t) + (d.ok ? ' <span class="label">Driver: pending analyst review.</span>' : '') + '</div>';
    if (d.ok) h += '<span class="good">Accepted.</span> The code appends the review label, since no reason is logged for this row.';
    else h += '<span class="bad">Rejected.</span> These reasons go back to the model for another attempt, up to three. After that, the plain rule-based commentary is used.<ul class="mt-1.5 list-disc pl-5">' + d.r.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>';
    vEl.innerHTML = h;
    dEl.onclick = function (e) { var b = e.target.closest('[data-d]'); if (!b) return; ds = +b.getAttribute('data-d'); showDraft(); };
  }

  /* ---------- project cards, filters, detail view ---------- */
  var P = window.PROJECTS || [], grid = $('grid'), filters = $('filters');
  var FILTERS = [['all', 'All'], ['auto', 'Automation'], ['controls', 'Controls and reconciliation'], ['risk', 'Risk and credit'], ['strategy', 'Strategy and operations']];
  filters.innerHTML = FILTERS.map(function (f, i) { return '<button type="button" class="chip" data-f="' + f[0] + '" aria-pressed="' + (i === 0) + '">' + f[1] + '</button>'; }).join('');
  grid.innerHTML = P.map(function (p, i) {
    return '<article class="card flex min-w-0 flex-col gap-3 rounded-[18px] border border-line bg-surface p-6" data-c="' + p.cats.join(' ') + '">' +
      '<div class="flex min-h-[22px] items-center justify-between gap-3"><p class="text-[13px] tracking-wide text-muted">' + esc(p.stack) + '</p>' +
      (p.status ? '<span class="whitespace-nowrap rounded-full bg-butter px-2.5 py-0.5 text-xs tracking-wide text-fg">' + esc(p.status) + '</span>' : '') + '</div>' +
      '<h3 class="font-display text-[1.65rem] font-semibold leading-[1.15]">' + esc(p.title) + '</h3>' +
      '<p class="text-[15.5px] text-muted">' + esc(p.line) + '</p>' +
      '<button type="button" class="chip mt-auto self-start" data-open="' + i + '" aria-haspopup="dialog">View details</button></article>';
  }).join('');
  filters.addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    var f = b.getAttribute('data-f');
    filters.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c === b); });
    grid.querySelectorAll('.card').forEach(function (c) { c.hidden = !(f === 'all' || c.getAttribute('data-c').split(' ').indexOf(f) > -1); });
  });

  function sectionHTML(s) {
    var h = '';
    if (s.h) h += '<h4 class="mb-2 font-display text-2xl font-semibold leading-tight">' + esc(s.h) + '</h4>';
    if (s.p) h += '<p class="max-w-[62ch] text-muted">' + esc(s.p) + '</p>';
    if (s.list) h += '<ul class="flex max-w-[62ch] list-disc flex-col gap-1.5 pl-5 text-muted marker:text-accent">' + s.list.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
    if (s.steps) h += '<ol class="flex max-w-[62ch] list-none flex-col gap-2.5 p-0">' + s.steps.map(function (t, i) {
      return '<li class="grid grid-cols-[30px_minmax(0,1fr)] items-start gap-3 text-muted"><span class="grid h-[26px] w-[26px] place-items-center rounded-full bg-raised text-[13px] text-fg">' + (i + 1) + '</span><span>' + esc(t) + '</span></li>';
    }).join('') + '</ol>';
    if (s.demo === 'checker') h += checkerHTML();
    return '<section>' + h + '</section>';
  }

  var dlg = $('project');
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]'); if (!b) return;
    var p = P[+b.getAttribute('data-open')];
    $('pm-title').textContent = p.title;
    $('pm-line').textContent = p.line;
    $('pm-stack').textContent = p.stack;
    var st = $('pm-status');
    st.textContent = p.status || ''; st.classList.toggle('hidden', !p.status);
    var btns = (p.links || []).map(function (l) { return '<a class="btn ghost" href="' + esc(l[1]) + '">' + esc(l[0]) + '</a>'; });
    if (p.github) btns.push('<a class="btn" href="' + esc(p.github) + '">View on GitHub</a>');
    $('pm-links').innerHTML = btns.join('');
    $('pm-foot').hidden = !btns.length;
    var g = $('pm-glance');
    g.innerHTML = (p.glance || []).map(function (n) {
      return '<div class="border-l-2 border-accent pl-4"><p class="font-display text-[1.7rem] font-medium leading-tight text-accent">' + esc(n[0]) + '</p><p class="mt-0.5 text-sm text-muted">' + esc(n[1]) + '</p></div>';
    }).join('');
    g.hidden = !(p.glance && p.glance.length);
    $('pm-sections').innerHTML = p.sections.map(sectionHTML).join('');
    if ($('drafts')) showDraft();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    $('pm-sections').parentNode.scrollTop = 0;
  });
  $('pm-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  /* ---------- copy email ---------- */
  var cb = $('copy');
  function selectAddr() { var r = document.createRange(); r.selectNodeContents($('addr')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  cb.addEventListener('click', function () {
    var done = function () { cb.textContent = 'Copied'; setTimeout(function () { cb.textContent = 'Copy email'; }, 1800); };
    try { navigator.clipboard.writeText('mtiwari5@umd.edu').then(done, selectAddr); } catch (e) { selectAddr(); }
  });
})();
