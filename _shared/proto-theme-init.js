/**
 * Синхронная инициализация темы до первой отрисовки (без FOUC).
 * <script src="../_shared/proto-theme-init.js" data-mode="standard"></script>
 */
(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  var MODE = script.getAttribute("data-mode") || "standard";
  var KEY = "nep-proto-theme";
  var html = document.documentElement;

  function defaultTheme() {
    if (MODE === "inverted" || MODE === "overlay-dark") return "light";
    return "dark";
  }

  var stored;
  try {
    stored = localStorage.getItem(KEY);
  } catch (e) {
    stored = null;
  }

  var theme = stored === "light" || stored === "dark" ? stored : defaultTheme();

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
})();
