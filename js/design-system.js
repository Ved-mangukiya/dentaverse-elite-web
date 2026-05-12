(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;

  const ensureLoader = () => {
    let loader = document.getElementById("loader");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "loader";
      loader.innerHTML = `
        <div class="dv-loader">
          <div class="dv-loader-icon"><img src="dentaverse-logo.jpeg" alt="Dentaverse"></div>
          <div class="dv-loader-brand">Dentaverse</div>
          <div class="dv-loader-bar"></div>
        </div>
      `;
      body.prepend(loader);
    }
    return loader;
  };

  const optimizeImages = () => {
    const images = Array.from(document.querySelectorAll("img"));
    images.forEach((img, index) => {
      if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
      if (!img.hasAttribute("loading")) {
        if (index < 3) {
          img.setAttribute("loading", "eager");
          if (!img.hasAttribute("fetchpriority")) img.setAttribute("fetchpriority", "high");
        } else {
          img.setAttribute("loading", "lazy");
          if (!img.hasAttribute("fetchpriority")) img.setAttribute("fetchpriority", "low");
        }
      }
    });
  };

  body.classList.add("is-loading");
  const loader = ensureLoader();
  optimizeImages();

  const start = performance.now();
  const hideLoader = () => {
    const elapsed = performance.now() - start;
    const minVisibleMs = 650;
    const wait = Math.max(0, minVisibleMs - elapsed);
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      body.classList.remove("is-loading");
      body.classList.add("ready");
    }, wait);
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
    window.setTimeout(hideLoader, 4500);
  }

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
