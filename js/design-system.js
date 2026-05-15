(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;

  // Determine logo path based on current directory depth
  const getLogoPath = () => {
    const isSubPage = window.location.pathname.includes('/pages/');
    return isSubPage ? '../images/dentaverse-logo.jpeg' : 'images/dentaverse-logo.jpeg';
  };

  const ensureLoader = () => {
    let loader = document.getElementById("loader");
    if (!loader) {
      loader = document.createElement("div");
      loader.id = "loader";
      loader.innerHTML = `
        <div class="dv-loader">
          <div class="dv-loader-icon"><img src="${getLogoPath()}" alt="Dentaverse VR Therapy Logo - Premium Dental Anxiety Solution"></div>
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
    const minVisibleMs = 800; // Slightly longer for more "premium" feel
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
    window.setTimeout(hideLoader, 4500); // Fallback
  }

  // Intercept links for smooth page transitions with loader
  const setupLinkInterception = () => {
    document.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      // Only intercept internal links that aren't anchors or downloads
      if (href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.includes('javascript:') &&
        (!target || target === '_self') &&
        !link.hasAttribute('download') &&
        !link.classList.contains('no-loader')) {

        link.addEventListener('click', (e) => {
          // Don't intercept if modifier keys are pressed (open in new tab)
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

          e.preventDefault();
          loader.classList.remove("is-hidden");
          body.classList.add("is-loading");
          body.classList.remove("ready");

          setTimeout(() => {
            window.location.href = href;
          }, 350); // Small delay for the loader to fade in
        });
      }
    });
  };

  setupLinkInterception();

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
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => {
      el.classList.add("is-visible", "active");
    });
  }

  // ========================================================
  // SECURITY DETERRENTS - Protect Assets & Code
  // ========================================================

  // 1. Disable Right-Click Context Menu
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 2. Disable Common Inspect Shortcuts
  document.addEventListener('keydown', (e) => {
    // Disable F12
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Disable Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      return false;
    }
    // Disable Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      return false;
    }
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      return false;
    }
  });

  // 3. Console Security Warning
  console.log("%c Dentaverse Security ", "background: #0066CC; color: #fff; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 5px;");
  console.log("%cThis area is for developers only. Please do not attempt to copy or modify the source code. Intellectual Property of Dentaverse UK.", "color: #5a7a9a; font-size: 14px;");

})();

