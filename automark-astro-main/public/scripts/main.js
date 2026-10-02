/**
 * The only script the site needs.
 *
 * Two jobs: shrink the header once the page is scrolled, and close the phone
 * menu (link tap or Escape). Everything else the template
 * shipped here (tabs, modals, accordions, sound toggle, card layout) belonged
 * to sections that no longer exist.
 */
(function () {
  "use strict";

  function stickyHeader() {
    const header = document.querySelector(".header");
    if (!header) return;

    const apply = () => header.classList.toggle("scrolled", window.scrollY > 8);

    apply();
    window.addEventListener("scroll", apply, { passive: true });
  }

  function mobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    const sync = () =>
      toggle.setAttribute("aria-label", toggle.checked ? "Close menu" : "Open menu");
    toggle.addEventListener("change", sync);

    const close = () => {
      if (!toggle.checked) return;
      toggle.checked = false;
      sync();
    };

    // Close after following an in-page link, so the target section is not
    // left hidden behind the open sheet.
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.checked) {
        close();
        toggle.focus();
      }
    });
  }

  function init() {
    stickyHeader();
    mobileNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
