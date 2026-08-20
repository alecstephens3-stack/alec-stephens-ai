(function () {
  "use strict";

  function byId(id) { return document.getElementById(id); }
  function all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ---------------- 01 · knowledge base search ----------------
     Carried forward from prototype 21 unchanged. Every situation page is
     already in the markup. This filters the list and swaps which page is
     open. Nothing here is generated, so the page reads fine without JS. */
  try {
    var q = byId("kbq"), go = byId("kbGo"), count = byId("kbCount");
    var chips = all("[data-kb-chip]");
    var pages = all("[data-kb-page]");
    var total = chips.length;

    pages.forEach(function (p) { p.setAttribute("tabindex", "-1"); });

    function openPage(id, moveFocus) {
      var found = null;
      pages.forEach(function (p) {
        var on = p.id === id;
        p.hidden = !on;
        if (on) { found = p; }
      });
      chips.forEach(function (c) {
        var b = c.querySelector("button");
        if (b) { b.setAttribute("aria-expanded", b.getAttribute("data-target") === id ? "true" : "false"); }
      });
      if (found && moveFocus) {
        try { found.focus({ preventScroll: true }); } catch (e) { try { found.focus(); } catch (e2) {} }
      }
    }

    function filter() {
      var t = (q && q.value ? q.value : "").trim().toLowerCase();
      var words = t ? t.split(/\s+/) : [];
      var shown = 0;
      chips.forEach(function (c) {
        var hay = (c.getAttribute("data-terms") || "").toLowerCase();
        var hit = words.every(function (w) { return hay.indexOf(w) !== -1; });
        c.hidden = !hit;
        if (hit) { shown++; }
      });
      if (count) {
        if (!t) {
          count.textContent = total + " example pages of the 76 we mapped. Pick one, or type.";
        } else if (shown === 0) {
          count.textContent = "Nothing matches that. A page nobody can find is a page we still have to write.";
        } else {
          count.textContent = shown + " of " + total + " example pages match. Press Enter to open the first.";
        }
      }
      return shown;
    }

    function openFirst() {
      var open = chips.filter(function (c) { return !c.hidden; })[0];
      if (!open) { return; }
      var b = open.querySelector("button");
      if (b) { openPage(b.getAttribute("data-target"), true); }
    }

    chips.forEach(function (c) {
      var b = c.querySelector("button");
      if (!b) { return; }
      b.addEventListener("click", function () { openPage(b.getAttribute("data-target"), true); });
    });

    if (q) {
      q.addEventListener("input", filter);
      q.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") { ev.preventDefault(); filter(); openFirst(); }
        else if (ev.key === "Escape") { ev.preventDefault(); q.value = ""; filter(); }
      });
    }
    if (go) { go.addEventListener("click", function () { filter(); openFirst(); }); }
  } catch (e) {}

  /* ---------------- 02 · ReExam sequence ----------------
     Carried forward from prototype 21 unchanged. */
  try {
    var rows = all("[data-rx-step]");
    var next = byId("rxNext"), books = byId("rxBooks"), reset = byId("rxReset"), rxRead = byId("rxRead");
    var sent = 0, stopped = false;

    function rxChip(row, name) { return row.querySelector('[data-rx-chip="' + name + '"]'); }

    var LABELS = ["Day 0 sent by SMS.", "Day 3 sent by email.",
                  "Day 10 sent by email only. The benefits angle never goes by SMS.",
                  "Day 17 sent by SMS.", "Day 28 sent by SMS, and it says it is the last text.",
                  "Day 42 sent by email. That is the whole sequence."];

    function rxRender(message) {
      rows.forEach(function (r, i) {
        var s = rxChip(r, "sent"), st = rxChip(r, "stopped");
        if (s) { s.hidden = !(i < sent); }
        if (st) { st.hidden = !(stopped && i >= sent); }
      });
      if (rxRead && message) { rxRead.textContent = message; }
    }

    if (next) {
      next.addEventListener("click", function () {
        if (stopped) { rxRender("It stopped when they booked. Press Start over."); return; }
        if (sent >= rows.length) { rxRender("All 6 touches are out. Press Start over."); return; }
        sent++;
        rxRender(LABELS[sent - 1] || "");
      });
    }
    if (books) {
      books.addEventListener("click", function () {
        if (stopped) { return; }
        stopped = true;
        rxRender(sent === 0
          ? "Booked before the first send. Nothing goes out."
          : "Booked after " + sent + " of 6 touches. Everything after it is stopped.");
      });
    }
    if (reset) {
      reset.addEventListener("click", function () {
        sent = 0; stopped = false;
        rxRender("Nothing sent yet. It also stops on a reply or an opt out.");
        if (next) { try { next.focus(); } catch (e) {} }
      });
    }
    rxRender("");
  } catch (e) {}

  /* ---------------- 03 · time off request ----------------
     Carried forward from prototype 21 unchanged. */
  try {
    var pick = byId("opsPick"), file = byId("opsFile"), opsRead = byId("opsRead");
    var branches = all("[data-ops-branch]");
    var filedChips = all("[data-ops-chip]");
    var mids = all("[data-ops-mid]");
    var ends = all("[data-ops-end]");

    function opsClear(message) {
      branches.forEach(function (b) { b.classList.remove("win"); });
      filedChips.forEach(function (c) { c.hidden = true; });
      mids.forEach(function (c) { c.hidden = true; });
      ends.forEach(function (c) { c.hidden = true; });
      if (opsRead && message) { opsRead.textContent = message; }
    }

    if (file) {
      file.addEventListener("click", function () {
        var v = pick ? pick.value : "covered";
        branches.forEach(function (b) {
          var on = b.getAttribute("data-ops-branch") === v;
          if (on) { b.classList.add("win"); } else { b.classList.remove("win"); }
        });
        filedChips.forEach(function (c) { c.hidden = false; });
        mids.forEach(function (c) { c.hidden = c.getAttribute("data-ops-mid") !== v; });
        ends.forEach(function (c) { c.hidden = c.getAttribute("data-ops-end") !== v; });
        if (opsRead) {
          opsRead.textContent = v === "covered"
            ? "Filed, checked, approved. Payroll updated in the same pass."
            : "Filed and checked. Thursday is short one person, so it went back to the office manager with the gap named.";
        }
      });
    }
    /* Changing the request clears the answer to the old one. */
    if (pick) {
      pick.addEventListener("change", function () {
        opsClear("Request changed. Nothing filed yet.");
      });
    }
  } catch (e) {}
})();
