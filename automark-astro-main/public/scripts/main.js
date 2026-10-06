/**
 * The only script the site needs.
 *
 * Four small jobs: turn the header solid once the page is scrolled, close
 * the phone menu (link tap or Escape), step the header's button aside while
 * one of the page's own buttons is already on screen, and rest a button's
 * moving light while that button is out of view. The page works without any
 * of them.
 */
(function () {
  "use strict";

  function stickyHeader(header) {
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

  // The same request should not be on screen twice. While the hero button or
  // the closing button is visible, the header's copy is hidden (see
  // navigation.css, .cta-in-view).
  function headerButton(header) {
    const buttons = document.querySelectorAll("[data-page-cta]");
    if (!buttons.length || !("IntersectionObserver" in window)) return;

    const visible = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      header.classList.toggle("cta-in-view", visible.size > 0);
    });

    buttons.forEach((button) => observer.observe(button));
  }

  // The light travelling round a button is redrawn on every frame. Off
  // screen that work shows nothing, and on a slow phone it takes smoothness
  // from whatever is on screen, so it is paused (components.css, .is-away).
  function restButtons() {
    const buttons = document.querySelectorAll(".btn-shiny");
    if (!buttons.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-away", !entry.isIntersecting);
      });
    });

    buttons.forEach((button) => observer.observe(button));
  }

  function init() {
    const header = document.querySelector(".site-header");
    if (header) {
      stickyHeader(header);
      headerButton(header);
    }
    mobileNav();
    restButtons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
