/**
 * Unified theme toggle for NEP prototypes.
 * <script src="../_shared/proto-theme.js" data-mode="standard" defer></script>
 *
 * Modes: standard | inverted | theme-light | overlay-dark
 */
(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  var MODE = script.dataset.mode || "standard";
  var KEY = "nep-proto-theme";
  var html = document.documentElement;

  function defaultTheme() {
    if (MODE === "inverted" || MODE === "overlay-dark") return "light";
    return "dark";
  }

  function readTheme() {
    switch (MODE) {
      case "inverted":
        return html.classList.contains("dark") ? "dark" : "light";
      case "theme-light":
        return html.classList.contains("theme-light") ? "light" : "dark";
      case "overlay-dark":
        return html.classList.contains("theme-dark") ? "dark" : "light";
      default:
        return html.classList.contains("light") ? "light" : "dark";
    }
  }

  function applyTheme(theme, animate) {
    if (animate) html.classList.add("theme-transition");
    html.classList.remove("dark", "light", "theme-light", "theme-dark");

    switch (MODE) {
      case "inverted":
        if (theme === "dark") html.classList.add("dark");
        break;
      case "theme-light":
        if (theme === "light") html.classList.add("theme-light");
        break;
      case "overlay-dark":
        if (theme === "dark") html.classList.add("theme-dark");
        break;
      default:
        html.classList.add(theme === "light" ? "light" : "dark");
        break;
    }

    html.dataset.nepTheme = theme;
    syncIcon(theme);
    window.dispatchEvent(new CustomEvent("nep-theme-change", { detail: { theme: theme } }));

    if (animate) {
      window.setTimeout(function () {
        html.classList.remove("theme-transition");
      }, 320);
    }
  }

  function syncIcon(theme) {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.textContent = theme === "dark" ? "☾" : "☀";
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"
    );
  }

  function init() {
    var stored = localStorage.getItem(KEY);
    var theme = stored === "light" || stored === "dark" ? stored : defaultTheme();
    applyTheme(theme, false);

    var btn = document.getElementById("themeToggle");
    if (!btn || btn.dataset.protoThemeBound) return;
    btn.dataset.protoThemeBound = "1";
    btn.addEventListener("click", function () {
      var current = html.dataset.nepTheme || readTheme();
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next, true);
      localStorage.setItem(KEY, next);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
