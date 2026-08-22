/* Round 6. Two behaviours only.
   1. The knowledge base demo plays itself on a loop. Nothing is asked of the visitor.
   2. The FAQ is native <details>, so it needs no script at all.
   Everything else on the page is scroll only, by client direction. */
(function () {
  "use strict";

  var QUERY = "no insurance card";
  var KEEP = ["1", "2", "3"];          // rows that survive the filter
  var CLICK = "1";                      // the row the cursor opens
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init(root) {
    var field = root.querySelector(".kbdemo-field");
    var typed = root.querySelector("#kbTyped") || root.querySelector(".kbdemo-typed");
    var results = root.querySelectorAll(".kbdemo-results li");
    var page = root.querySelector(".kbdemo-page");
    var cursor = root.querySelector(".kbdemo-cursor");
    if (!field || !typed || !page) return;

    // Reduced motion: show the end state, no animation, no loop.
    if (reduce) {
      typed.textContent = QUERY;
      field.classList.add("done");
      each(results, function (li) { li.removeAttribute("data-out"); });
      page.classList.add('is-open');
      return;
    }

    var timers = [];
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function clear() { timers.forEach(clearTimeout); timers = []; }

    function reset() {
      clear();
      typed.textContent = "";
      field.classList.remove("typing", "done");
      page.classList.remove('is-open');
      each(results, function (li) { li.removeAttribute("data-out"); li.removeAttribute("data-hot"); });
      if (cursor) { cursor.classList.remove("on", "tap"); cursor.style.transform = ""; }
    }

    function run() {
      reset();
      field.classList.add("typing");

      // Type the query, filtering as it goes.
      var i = 0;
      (function step() {
        if (i > QUERY.length) return afterType();
        typed.textContent = QUERY.slice(0, i);
        filter(QUERY.slice(0, i));
        i++;
        at(58 + Math.round(i % 3) * 22, step);
      })();

      function afterType() {
        field.classList.add("done");
        at(420, function () {
          var target = root.querySelector('.kbdemo-results li[data-kb-r="' + CLICK + '"]');
          if (!target || !cursor) return open();
          // Walk the cursor to the row, tap it, then open the page.
          var box = root.getBoundingClientRect(), t = target.getBoundingClientRect();
          cursor.classList.add("on");
          cursor.style.transform =
            "translate(" + (t.left - box.left + 26) + "px," + (t.top - box.top + 12) + "px)";
          target.setAttribute("data-hot", "");
          at(620, function () { cursor.classList.add("tap"); });
          at(760, function () { cursor.classList.remove("tap"); open(); });
          at(1100, function () { cursor.classList.remove("on"); });
        });
      }

      function open() {
        page.classList.add('is-open');
        at(5200, run);            // rest on the answer, then replay
      }
    }

    function filter(q) {
      q = q.trim().toLowerCase();
      each(results, function (li) {
        // Nothing typed means no results yet, the way a real search box behaves.
        // With only the three sourced rows there is nothing to narrow FROM, so the
        // filter has to read as empty -> matches rather than many -> few.
        if (!q) { li.setAttribute("data-out", ""); return; }
        var hay = (li.getAttribute("data-terms") || "") + " " + li.textContent.toLowerCase();
        var hit = q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
        if (hit) li.removeAttribute("data-out"); else li.setAttribute("data-out", "");
      });
    }

    // Only run while it is actually on screen. A demo playing to nobody in a
    // background tab is just battery.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) run(); else { clear(); reset(); } });
      }, { threshold: 0.25 }).observe(root);
    } else {
      run();
    }
  }

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  function boot() {
    each(document.querySelectorAll("[data-kb-demo]"), init);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
