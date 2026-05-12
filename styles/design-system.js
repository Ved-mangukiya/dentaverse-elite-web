(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Remove cursor-circle effects everywhere.
  const cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow) cursorGlow.remove();

  // Mobile nav toggles (single handler for all pages).
  const hamburger = document.getElementById("dvHamburger");
  const mobileMenu = document.getElementById("dvMobileMenu");
  if (hamburger && mobileMenu) {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.addEventListener("click", (event) => {
      event.preventDefault();
      const nextState = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", nextState);
      hamburger.setAttribute("aria-expanded", String(nextState));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Unified reveal animation.
  const revealSelector = "[data-reveal], .reveal, .reveal-left, .reveal-right, .reveal-scale";
  const revealElements = Array.from(document.querySelectorAll(revealSelector));
  if (!prefersReduced && revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.remove("is-exiting", "exit");
          el.classList.add("is-visible", "active");
        } else if (el.classList.contains("is-visible") || el.classList.contains("active")) {
          el.classList.remove("is-visible", "active");
          el.classList.add("is-exiting", "exit");
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px"
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => {
      el.classList.add("is-visible", "active");
    });
  }
})();
