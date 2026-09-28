/**
 * The only script the site needs.
 *
 * Two jobs: shrink the header once the page is scrolled, and size the mobile
 * navigation backdrop to match the open menu. Everything else the template
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
    const backdrop = document.getElementById("nav-menu-bg");
    if (!toggle || !menu) return;

    const sizeBackdrop = () => {
      if (!backdrop) return;
      backdrop.style.height = toggle.checked ? `${menu.scrollHeight + 120}px` : "";
    };

    toggle.addEventListener("change", sizeBackdrop);
    window.addEventListener("resize", sizeBackdrop, { passive: true });

    // Close the menu after following an in-page link, so the target section is
    // not left hidden behind the open overlay.
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a") && toggle.checked) {
        toggle.checked = false;
        sizeBackdrop();
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
