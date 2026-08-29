/* =====================================================================
   app.js · Interacción compartida del prototipo Exportaciones DIAN
   Réplica del <script> de html/mockup-chat-canvas-agentico.html.
   Sin dependencias. Se carga con `defer` desde el <head> de las 37
   pantallas. Cada bloque comprueba que sus nodos existan antes de
   enlazarse: index.html y f00-ingreso.html no tienen .body, .tabs,
   .panel, .collapse ni .restore-both y deben cargar sin errores.
   ===================================================================== */
(function () {
  'use strict';

  var root  = document.documentElement;
  var STORE = 'dian-theme';

  function all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ─── 1 · TEMA ───────────────────────────────────────────────────
     Fuente de verdad: localStorage['dian-theme'] → prefers-color-scheme
     → 'light'. Idéntica a la del bootstrap inline del <head>, así que
     aplicar aquí es idempotente y nunca produce un segundo repintado. */

  function readTheme() {
    try {
      var v = localStorage.getItem(STORE);
      if (v === 'light' || v === 'dark') return v;
    } catch (e) { /* localStorage bloqueado: seguimos */ }
    try {
      if (window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch (e) { /* matchMedia ausente: seguimos */ }
    return 'light';
  }

  function applyTheme(theme) {
    if (theme !== 'dark') theme = 'light';
    root.setAttribute('data-theme', theme);
    all('[data-theme-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-btn') === theme));
    });
    try { localStorage.setItem(STORE, theme); } catch (e) { /* sin persistencia */ }
  }

  function initTheme() {
    applyTheme(readTheme());
    all('[data-theme-btn]').forEach(function (b) {
      b.addEventListener('click', function () {
        applyTheme(b.getAttribute('data-theme-btn'));
      });
    });
  }

  /* ─── 2 · PESTAÑAS DEL CANVAS ────────────────────────────────────
     Delegación por cada .tabs. El alcance de los .panel es la .canvas
     que contiene a esa .tabs, de modo que una pantalla con dos zonas
     de pestañas seguiría siendo correcta. Sin .tabs no hace nada. */

  function bindTabs(list) {
    var scope = (list.closest && list.closest('.canvas')) || list.parentNode;
    if (!scope) return;
    var tabs = all('.tab', list);
    if (!tabs.length) return;

    function select(tab) {
      var target = tab.getAttribute('data-p');
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', String(t === tab));
        t.tabIndex = (t === tab) ? 0 : -1;
      });
      all('.panel', scope).forEach(function (p) {
        var on = (p.id === target);
        p.classList.toggle('on', on);
        p.setAttribute('aria-hidden', String(!on));
      });
    }

    list.addEventListener('click', function (ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest('.tab') : null;
      if (t && list.contains(t)) select(t);
    });

    list.addEventListener('keydown', function (ev) {
      if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return;
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      ev.preventDefault();
      var step = (ev.key === 'ArrowRight') ? 1 : tabs.length - 1;
      var next = tabs[(i + step) % tabs.length];
      next.focus();
      select(next);
    });

    /* Normaliza el estado inicial a partir del marcado servido. */
    var current = null;
    tabs.forEach(function (t) {
      if (t.getAttribute('aria-selected') === 'true') current = t;
    });
    select(current || tabs[0]);
  }

  function initTabs() { all('.tabs').forEach(bindTabs); }

  /* ─── 3 · COLAPSO DE CHAT / CANVAS ───────────────────────────────
     Estados: '' (ambos) | 'chat-hidden' | 'canvas-hidden'.
     No se persiste: el mockup tampoco lo hace. Sin .body no hace nada. */

  function initCollapse() {
    var bodyEl = document.querySelector('.body');
    if (!bodyEl) return;

    var btns    = all('.collapse');
    var restore = document.querySelector('.restore-both');
    if (!btns.length && !restore) return;

    function applyLayout(state) {
      bodyEl.classList.toggle('chat-hidden',   state === 'chat-hidden');
      bodyEl.classList.toggle('canvas-hidden', state === 'canvas-hidden');
      btns.forEach(function (b) {
        var mine = (state === 'chat-hidden'   && b.classList.contains('collapse-chat')) ||
                   (state === 'canvas-hidden' && b.classList.contains('collapse-canvas'));
        b.setAttribute('aria-pressed', String(mine));
      });
      if (restore) {
        var visible = (state !== '');
        restore.setAttribute('aria-hidden', String(!visible));
        restore.tabIndex = visible ? 0 : -1;
      }
    }

    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('collapse-chat')) {
          applyLayout(bodyEl.classList.contains('chat-hidden') ? '' : 'chat-hidden');
        } else {
          applyLayout(bodyEl.classList.contains('canvas-hidden') ? '' : 'canvas-hidden');
        }
      });
    });

    if (restore) restore.addEventListener('click', function () { applyLayout(''); });

    applyLayout('');
  }

  /* ─── 4 · ARRANQUE ──────────────────────────────────────────────── */
  initTheme();
  initTabs();
  initCollapse();
})();
