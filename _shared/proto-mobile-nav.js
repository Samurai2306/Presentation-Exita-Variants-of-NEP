/**
 * Единое мобильное меню для прототипов NEP.
 * <script src="../_shared/proto-mobile-nav.js" defer></script>
 */
(function () {
  "use strict";

  if (document.documentElement.dataset.protoMobileNav === "custom") return;

  var CONFIGS = [
    {
      toggle: "#menuToggle",
      panel: "#mobileNav",
      overlay: "#mobileNavOverlay",
      openClass: "open",
      header: "#nepHeader",
      topVar: "--header-h",
    },
    {
      toggle: "#headerMenuBtn",
      panel: "#headerMobileNav",
      overlay: "#mobileNavOverlay",
      openClass: "is-open",
      header: "#nepHeader",
      topVar: "--header-mobile-top",
      useHidden: true,
    },
    {
      toggle: "#menuToggle",
      panel: "#mainNav",
      overlay: "#navOverlay",
      openClass: "is-open",
      header: "#nepHeader, .nep-header, header.nep-header",
      dropdown: true,
    },
    {
      toggle: "#menu-btn",
      panel: "#mobile-nav",
      overlay: "#mobileNavOverlay",
      openClass: "is-open",
      header: ".header, #site-header",
      topVar: "--proto-mobile-top",
    },
    {
      toggle: "#headerMenu",
      panel: "#headerMobile",
      overlay: "#headerMobileOverlay",
      openClass: "is-open",
      header: "#nepHeader, .nep-header",
      topVar: "--header-mobile-top",
    },
  ];

  function $(sel, root) {
    if (!sel) return null;
    try {
      return (root || document).querySelector(sel);
    } catch (e) {
      return null;
    }
  }

  function resolveHeader(selectors) {
    if (!selectors) return null;
    var parts = selectors.split(",");
    for (var i = 0; i < parts.length; i++) {
      var el = $(parts[i].trim());
      if (el) return el;
    }
    return null;
  }

  function syncTop(cfg, header) {
    if (!cfg.topVar || !header) return;
    var top = Math.round(header.getBoundingClientRect().bottom);
    document.documentElement.style.setProperty(cfg.topVar, top + "px");
    document.documentElement.style.setProperty("--proto-mobile-top", top + "px");
  }

  function ensureOverlay(cfg) {
    if (cfg.overlay) return $(cfg.overlay);
    var id = "protoMobileOverlay";
    var existing = document.getElementById(id);
    if (existing) return existing;
    var el = document.createElement("div");
    el.id = id;
    el.className = "mobile-nav-overlay proto-mobile-overlay";
    el.setAttribute("aria-hidden", "true");
    el.hidden = true;
    document.body.appendChild(el);
    cfg.overlay = "#" + id;
    return el;
  }

  function wire(cfg) {
    var toggle = $(cfg.toggle);
    var panel = $(cfg.panel);
    if (!toggle || !panel || toggle.dataset.protoMobileBound) return false;

    var overlay = ensureOverlay(cfg);
    var header = resolveHeader(cfg.header);
    var openClass = cfg.openClass || "is-open";

    function isOpen() {
      if (cfg.useHidden) return panel.classList.contains(openClass);
      return panel.classList.contains(openClass);
    }

    function setOpen(open) {
      panel.classList.toggle(openClass, open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("aria-hidden", open ? "false" : "true");

      if (cfg.useHidden) {
        panel.hidden = !open;
      }

      if (overlay) {
        overlay.classList.toggle("is-open", open);
        overlay.setAttribute("aria-hidden", open ? "false" : "true");
        if (open) overlay.removeAttribute("hidden");
        else overlay.setAttribute("hidden", "");
      }

      document.body.style.overflow = open ? "hidden" : "";
      if (open && (cfg.fixed !== false && !cfg.dropdown)) syncTop(cfg, header);
    }

    function close() {
      setOpen(false);
    }

    toggle.dataset.protoMobileBound = "1";
    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    if (overlay) {
      overlay.addEventListener("click", close);
    }

    panel.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        close();
        var hash = link.getAttribute("href");
        if (!hash || hash === "#") return;
        var target = document.querySelector(hash);
        if (target) {
          window.requestAnimationFrame(function () {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
      });
    });

    panel.querySelectorAll('a:not([href^="#"])').forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) {
        close();
        toggle.focus();
      }
    });

    if (header) {
      syncTop(cfg, header);
      window.addEventListener(
        "resize",
        function () {
          if (isOpen()) syncTop(cfg, header);
          else syncTop(cfg, header);
        },
        { passive: true }
      );
    }

    return true;
  }

  function init() {
    for (var i = 0; i < CONFIGS.length; i++) {
      if (wire(CONFIGS[i])) break;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
