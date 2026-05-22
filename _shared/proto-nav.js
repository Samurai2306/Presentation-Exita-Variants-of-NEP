/**
 * EXITA NEP — навигатор между HTML-прототипами.
 * Подключение: <script src="../_shared/proto-nav.js" data-current="01" defer></script>
 */
(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  var currentId = script.dataset.current || "01";
  var sharedBase = new URL(".", script.src).href;
  var rootBase = new URL("../", sharedBase).href;

  var PROTOTYPES = [
    { id: "01", slug: "01-royal-atelier", name: "Royal Atelier", tag: "Эволюция", desc: "Тёмное стекло, premium glass" },
    { id: "02", slug: "02-architectural-ledger", name: "Architectural Ledger", tag: "Эволюция", desc: "Нео-брутализм, чертёжная сетка" },
    { id: "03", slug: "03-luminous-trust", name: "Luminous Trust", tag: "Эволюция", desc: "Светлая editorial-премиум" },
    { id: "04", slug: "04-the-tribunal", name: "The Tribunal", tag: "Радикал", desc: "Институциональный burgundy/gold" },
    { id: "05", slug: "05-data-observatory", name: "Data Observatory", tag: "Радикал", desc: "Sci-fi HUD, орбиты" },
    { id: "06", slug: "06-swiss-editorial", name: "Swiss Editorial", tag: "Радикал", desc: "Швейцарская типографика" },
  ];

  function hrefFor(slug) {
    return rootBase + slug + "/index.html";
  }

  function currentIndex() {
    return PROTOTYPES.findIndex(function (p) {
      return p.id === currentId;
    });
  }

  function injectStyles() {
    var style = document.createElement("style");
    style.id = "proto-nav-styles";
    style.textContent =
      "#proto-nav{--pn-accent:#1d4ed8;--pn-bg:#0a0e1c;--pn-surface:rgba(22,30,52,.92);--pn-border:rgba(148,163,184,.22);--pn-fg:#eef2ff;--pn-muted:rgba(226,232,240,.72);--pn-shadow:0 16px 48px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.06) inset;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:14px;line-height:1.4;z-index:9999}" +
      "#proto-nav *{box-sizing:border-box}" +
      "#proto-nav-toggle{position:fixed;bottom:max(1rem,env(safe-area-inset-bottom));left:max(1rem,env(safe-area-inset-left));display:inline-flex;align-items:center;gap:.55rem;padding:.55rem .95rem .55rem .7rem;border-radius:9999px;border:1px solid var(--pn-border);background:var(--pn-surface);color:var(--pn-fg);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:var(--pn-shadow);cursor:pointer;transition:transform .15s,box-shadow .2s,border-color .2s;z-index:9999}" +
      "#proto-nav-toggle:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--pn-accent) 45%,var(--pn-border));box-shadow:0 20px 52px rgba(29,78,216,.18),var(--pn-shadow)}" +
      "#proto-nav-toggle:active{transform:translateY(0) scale(.98)}" +
      "#proto-nav-toggle:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--pn-accent) 35%,transparent),var(--pn-shadow)}" +
      "#proto-nav-toggle[aria-expanded=true]{border-color:color-mix(in srgb,var(--pn-accent) 55%,var(--pn-border));background:color-mix(in srgb,var(--pn-accent) 12%,var(--pn-surface))}" +
      ".proto-nav-toggle__icon{display:flex;align-items:center;justify-content:center;width:1.65rem;height:1.65rem;border-radius:50%;background:color-mix(in srgb,var(--pn-accent) 18%,transparent);color:var(--pn-accent);font-size:.75rem;font-weight:700;letter-spacing:-.02em}" +
      ".proto-nav-toggle__text{display:flex;flex-direction:column;align-items:flex-start;text-align:left;line-height:1.2}" +
      ".proto-nav-toggle__label{font-size:.6875rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--pn-muted)}" +
      ".proto-nav-toggle__current{font-size:.8125rem;font-weight:600;max-width:9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
      "#proto-nav-panel{position:fixed;bottom:calc(4.25rem + env(safe-area-inset-bottom,0px));left:max(1rem,env(safe-area-inset-left));width:min(22rem,calc(100vw - 2rem));max-height:min(28rem,calc(100vh - 6rem));overflow:auto;border-radius:18px;border:1px solid var(--pn-border);background:var(--pn-surface);color:var(--pn-fg);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:var(--pn-shadow);opacity:0;visibility:hidden;transform:translateY(8px) scale(.98);transform-origin:left bottom;transition:opacity .22s cubic-bezier(.22,1,.36,1),transform .22s cubic-bezier(.22,1,.36,1),visibility .22s;z-index:9998;scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--pn-accent) 40%,transparent) transparent}" +
      "#proto-nav-panel.is-open{opacity:1;visibility:visible;transform:translateY(0) scale(1)}" +
      "#proto-nav-panel:focus{outline:none}" +
      ".proto-nav-head{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:1rem 1rem .75rem;border-bottom:1px solid var(--pn-border)}" +
      ".proto-nav-head__title{font-size:.6875rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--pn-muted)}" +
      ".proto-nav-head__hub{font-size:.75rem;color:var(--pn-accent);text-decoration:none}" +
      ".proto-nav-head__hub:hover{text-decoration:underline}" +
      ".proto-nav-prevnext{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.65rem 1rem;border-bottom:1px solid var(--pn-border)}" +
      ".proto-nav-prevnext button{display:inline-flex;align-items:center;justify-content:center;min-width:2.25rem;height:2.25rem;padding:0 .65rem;border-radius:10px;border:1px solid var(--pn-border);background:color-mix(in srgb,var(--pn-accent) 6%,transparent);color:var(--pn-fg);cursor:pointer;transition:background .15s,border-color .15s}" +
      ".proto-nav-prevnext button:hover{border-color:color-mix(in srgb,var(--pn-accent) 45%,var(--pn-border));background:color-mix(in srgb,var(--pn-accent) 14%,transparent)}" +
      ".proto-nav-prevnext button:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--pn-accent) 35%,transparent)}" +
      ".proto-nav-prevnext__pos{font-size:.75rem;font-weight:600;color:var(--pn-muted);font-variant-numeric:tabular-nums}" +
      ".proto-nav-list{list-style:none;margin:0;padding:.5rem}" +
      ".proto-nav-item{margin:0}" +
      ".proto-nav-link{display:grid;grid-template-columns:auto 1fr auto;gap:.65rem;align-items:center;padding:.65rem .75rem;border-radius:12px;border:1px solid transparent;color:inherit;text-decoration:none;transition:background .15s,border-color .15s,transform .15s}" +
      ".proto-nav-link:hover{background:color-mix(in srgb,var(--pn-accent) 8%,transparent);border-color:color-mix(in srgb,var(--pn-accent) 20%,var(--pn-border));transform:translateX(2px)}" +
      ".proto-nav-link:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--pn-accent) 35%,transparent)}" +
      ".proto-nav-link.is-active{background:color-mix(in srgb,var(--pn-accent) 14%,transparent);border-color:color-mix(in srgb,var(--pn-accent) 45%,var(--pn-border))}" +
      ".proto-nav-link__num{font-size:.6875rem;font-weight:700;font-variant-numeric:tabular-nums;color:var(--pn-accent);min-width:1.5rem}" +
      ".proto-nav-link__body{min-width:0}" +
      ".proto-nav-link__name{display:block;font-size:.8125rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
      ".proto-nav-link__desc{display:block;margin-top:.15rem;font-size:.6875rem;color:var(--pn-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
      ".proto-nav-link__tag{font-size:.5625rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:.2rem .45rem;border-radius:9999px;background:color-mix(in srgb,var(--pn-accent) 12%,transparent);color:var(--pn-accent);white-space:nowrap}" +
      ".proto-nav-foot{padding:.65rem 1rem .85rem;border-top:1px solid var(--pn-border);font-size:.625rem;color:var(--pn-muted);line-height:1.5}" +
      ".proto-nav-foot kbd{display:inline-block;padding:.05rem .35rem;border-radius:4px;border:1px solid var(--pn-border);background:color-mix(in srgb,var(--pn-accent) 6%,transparent);font-size:.6rem;font-family:inherit}" +
      "@media(max-width:767px){#proto-nav-toggle{bottom:max(5rem,env(safe-area-inset-bottom,0px))}#proto-nav-panel{bottom:calc(8.25rem + env(safe-area-inset-bottom,0px))}}" +
      "@media(max-width:480px){#proto-nav-toggle .proto-nav-toggle__text{display:none}#proto-nav-toggle{padding:.55rem .65rem}#proto-nav-panel{left:.75rem;width:calc(100vw - 1.5rem)}}" +
      "@media(prefers-reduced-motion:reduce){#proto-nav-panel,#proto-nav-toggle{transition:none!important}}" +
      ".proto-badge,.prototype-badge{bottom:max(1rem,env(safe-area-inset-bottom))!important;right:max(1rem,env(safe-area-inset-right))!important}";
    document.head.appendChild(style);
  }

  function buildNav() {
    var idx = currentIndex();
    var current = PROTOTYPES[idx] || PROTOTYPES[0];
    var prev = PROTOTYPES[(idx - 1 + PROTOTYPES.length) % PROTOTYPES.length];
    var next = PROTOTYPES[(idx + 1) % PROTOTYPES.length];

    var root = document.createElement("div");
    root.id = "proto-nav";
    root.setAttribute("role", "navigation");
    root.setAttribute("aria-label", "Навигатор прототипов NEP");

    root.innerHTML =
      '<button type="button" id="proto-nav-toggle" aria-expanded="false" aria-controls="proto-nav-panel" aria-haspopup="dialog">' +
      '<span class="proto-nav-toggle__icon" aria-hidden="true">◫</span>' +
      '<span class="proto-nav-toggle__text">' +
      '<span class="proto-nav-toggle__label">Прототипы NEP</span>' +
      '<span class="proto-nav-toggle__current">' +
      current.id +
      " · " +
      current.name +
      "</span></span></button>" +
      '<div id="proto-nav-panel" role="dialog" aria-label="Выбор прототипа" tabindex="-1" hidden>' +
      '<div class="proto-nav-head">' +
      '<span class="proto-nav-head__title">EXITA Н.Э.П. · прототипы</span>' +
      '<a class="proto-nav-head__hub" href="' +
      rootBase +
      'index.html">Все</a></div>' +
      '<div class="proto-nav-prevnext">' +
      '<button type="button" data-dir="prev" aria-label="Предыдущий: ' +
      prev.name +
      '">← ' +
      prev.id +
      "</button>" +
      '<span class="proto-nav-prevnext__pos">' +
      current.id +
      " / 06</span>" +
      '<button type="button" data-dir="next" aria-label="Следующий: ' +
      next.name +
      '">' +
      next.id +
      " →</button></div>" +
      '<ul class="proto-nav-list" role="list">' +
      PROTOTYPES.map(function (p) {
        var active = p.id === currentId ? " is-active" : "";
        var aria = p.id === currentId ? ' aria-current="page"' : "";
        return (
          '<li class="proto-nav-item"><a class="proto-nav-link' +
          active +
          '" href="' +
          hrefFor(p.slug) +
          '"' +
          aria +
          ">" +
          '<span class="proto-nav-link__num">' +
          p.id +
          "</span>" +
          '<span class="proto-nav-link__body">' +
          '<span class="proto-nav-link__name">' +
          p.name +
          "</span>" +
          '<span class="proto-nav-link__desc">' +
          p.desc +
          "</span></span>" +
          '<span class="proto-nav-link__tag">' +
          p.tag +
          "</span></a></li>"
        );
      }).join("") +
      "</ul>" +
      '<div class="proto-nav-foot">' +
      "Быстро: <kbd>[</kbd> пред. · <kbd>]</kbd> след. · <kbd>P</kbd> меню · HTML без backend" +
      "</div></div>";

    document.body.appendChild(root);
    return root;
  }

  function wireNav(root) {
    var toggle = root.querySelector("#proto-nav-toggle");
    var panel = root.querySelector("#proto-nav-panel");
    var idx = currentIndex();

    function openPanel() {
      panel.hidden = false;
      requestAnimationFrame(function () {
        panel.classList.add("is-open");
      });
      toggle.setAttribute("aria-expanded", "true");
      panel.focus();
    }

    function closePanel() {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      window.setTimeout(function () {
        if (!panel.classList.contains("is-open")) panel.hidden = true;
      }, 220);
    }

    function togglePanel() {
      if (panel.classList.contains("is-open")) closePanel();
      else openPanel();
    }

    function go(dir) {
      var nextIdx = dir === "prev" ? (idx - 1 + PROTOTYPES.length) % PROTOTYPES.length : (idx + 1) % PROTOTYPES.length;
      window.location.href = hrefFor(PROTOTYPES[nextIdx].slug);
    }

    toggle.addEventListener("click", togglePanel);

    panel.querySelectorAll("[data-dir]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        go(btn.getAttribute("data-dir"));
      });
    });

    document.addEventListener("click", function (e) {
      if (!root.contains(e.target)) closePanel();
    });

    document.addEventListener("keydown", function (e) {
      var tag = e.target && e.target.tagName;
      var typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target && e.target.isContentEditable);
      if (typing) return;

      if (e.key === "p" || e.key === "P" || e.key === "з" || e.key === "З") {
        e.preventDefault();
        togglePanel();
        return;
      }
      if (e.key === "[") {
        e.preventDefault();
        go("prev");
        return;
      }
      if (e.key === "]") {
        e.preventDefault();
        go("next");
      }
      if (e.key === "Escape" && panel.classList.contains("is-open")) {
        closePanel();
        toggle.focus();
      }
    });
  }

  function adaptTheme() {
    var html = document.documentElement;
    var nav = document.getElementById("proto-nav");
    if (!nav) return;

    function apply() {
      var isLight =
        html.classList.contains("light") ||
        (!html.classList.contains("dark") &&
          window.getComputedStyle(document.body).backgroundColor !== "rgb(10, 14, 28)" &&
          document.body.classList.contains("nep-v2-scope") &&
          !html.classList.contains("dark"));

      /* Swiss editorial / light pages */
      var bg = getComputedStyle(document.body).backgroundColor;
      var lightHint = bg && (bg.indexOf("250") !== -1 || bg.indexOf("251") !== -1 || bg.indexOf("242") !== -1 || bg.indexOf("247") !== -1);

      if (html.classList.contains("light") || lightHint) {
        nav.style.setProperty("--pn-bg", "#eef2fb");
        nav.style.setProperty("--pn-surface", "rgba(255,255,255,.94)");
        nav.style.setProperty("--pn-fg", "#0f172a");
        nav.style.setProperty("--pn-muted", "#64748b");
        nav.style.setProperty("--pn-border", "color-mix(in srgb, #1d4ed8 16%, #cbd5e1)");
      } else {
        nav.style.removeProperty("--pn-bg");
        nav.style.removeProperty("--pn-surface");
        nav.style.removeProperty("--pn-fg");
        nav.style.removeProperty("--pn-muted");
        nav.style.removeProperty("--pn-border");
      }
    }

    apply();
    var observer = new MutationObserver(apply);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    var themeBtn = document.getElementById("themeToggle");
    if (themeBtn) themeBtn.addEventListener("click", function () {
      window.setTimeout(apply, 50);
    });
    window.addEventListener("nep-theme-change", apply);
  }

  injectStyles();
  var root = buildNav();
  wireNav(root);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", adaptTheme);
  } else {
    adaptTheme();
  }
})();
