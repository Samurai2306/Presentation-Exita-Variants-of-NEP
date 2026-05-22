/**
 * Stats count-up — shared across NEP prototypes.
 * Elements: .stat-value / .stat__value / .stat-card__value[data-count], or [data-count-up]
 */
(function () {
  "use strict";

  function parseStat(el) {
    var raw = el.getAttribute("data-count") || el.getAttribute("data-count-up") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var num = Number(String(raw).replace(/\s/g, "").replace(",", "."));
    if (Number.isNaN(num)) return null;
    return { value: num, suffix: suffix };
  }

  function format(n, suffix) {
    return n.toLocaleString("ru-RU") + suffix;
  }

  function animate(el, parsed) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = format(parsed.value, parsed.suffix);
      el.classList.add("is-counted");
      return;
    }
    var duration = 900;
    var start = performance.now();
    function tick(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(Math.round(parsed.value * eased), parsed.suffix);
      if (t < 1) requestAnimationFrame(tick);
      else el.classList.add("is-counted");
    }
    requestAnimationFrame(tick);
  }

  function init() {
    var nodes = document.querySelectorAll(
      ".stat-value[data-count], .stat__value[data-count], .stat-card__value[data-count], [data-count-up]"
    );
    if (!nodes.length) return;

    function run(el) {
      if (el.classList.contains("is-counted")) return;
      var parsed = parseStat(el);
      if (!parsed) return;
      animate(el, parsed);
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              run(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -20px 0px" }
      );
      nodes.forEach(function (el) {
        io.observe(el);
      });
    } else {
      nodes.forEach(run);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
