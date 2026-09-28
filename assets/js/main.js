/* Under Pressure: progressively enhanced mobile navigation. */
(() => {
  "use strict";
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!header || !toggle || !nav) return;
  header.classList.add("nav-ready");
  const close = () => {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Apri il menu");
  };
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
  });
  nav.addEventListener("click", event => { if (event.target.closest("a")) close(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && header.classList.contains("is-open")) { close(); toggle.focus(); }
  });
  document.addEventListener("click", event => { if (!header.contains(event.target)) close(); });
  const desktop = window.matchMedia("(min-width: 801px)");
  desktop.addEventListener("change", () => { if (desktop.matches) close(); });
})();
