(() => {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.innerWidth < 768;
  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;
  const body = document.body;

  /* ─────────────────────────────────────────────────────────
   * LOGO PATH HELPER
   * ──────────────────────────────────────────────────────── */
  const getLogoPath = () => {
    const isSubPage = window.location.pathname.includes('/pages/');
    return isSubPage ? '../images/dentaverse-logo.jpeg' : 'images/dentaverse-logo.jpeg';
  };

  /* ─────────────────────────────────────────────────────────
   * LOADER
   * ──────────────────────────────────────────────────────── */
  const ensureLoader = () => {
    let loader = document.getElementById('loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'loader';
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

  /* ─────────────────────────────────────────────────────────
   * IMAGE OPTIMISATION
   * ──────────────────────────────────────────────────────── */
  const optimizeImages = () => {
    document.querySelectorAll('img').forEach((img, i) => {
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (!img.hasAttribute('loading')) {
        if (i < 3) {
          img.setAttribute('loading', 'eager');
          img.setAttribute('fetchpriority', 'high');
        } else {
          img.setAttribute('loading', 'lazy');
        }
      }
    });
  };

  body.classList.add('is-loading');
  const loader = ensureLoader();
  optimizeImages();

  /* ─────────────────────────────────────────────────────────
   * HIDE LOADER
   * ──────────────────────────────────────────────────────── */
  const start = performance.now();
  const hideLoader = () => {
    const elapsed = performance.now() - start;
    const minVisible = 750;
    setTimeout(() => {
      loader.classList.add('is-hidden');
      body.classList.remove('is-loading');
      body.classList.add('ready');
    }, Math.max(0, minVisible - elapsed));
  };
  if (document.readyState === 'complete') hideLoader();
  else {
    window.addEventListener('load', hideLoader, { once: true });
    setTimeout(hideLoader, 4500);
  }

  /* ─────────────────────────────────────────────────────────
   * SCROLL PROGRESS BAR
   * ──────────────────────────────────────────────────────── */
  const addScrollProgress = () => {
    if (document.getElementById('scroll-progress')) return;
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);
    let rafId = null;
    const update = () => {
      const scrollEl = document.documentElement;
      const pct = (scrollEl.scrollTop / (scrollEl.scrollHeight - scrollEl.clientHeight)) * 100;
      bar.style.width = pct + '%';
      rafId = null;
    };
    window.addEventListener('scroll', () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    }, { passive: true });
  };
  addScrollProgress();

  /* ─────────────────────────────────────────────────────────
   * PAGE LINK TRANSITIONS
   * ──────────────────────────────────────────────────────── */
  const setupLinkInterception = () => {
    document.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      const target = link.getAttribute('target');
      if (href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.includes('javascript:') &&
        (!target || target === '_self') &&
        !link.hasAttribute('download') &&
        !link.classList.contains('no-loader')) {
        link.addEventListener('click', e => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          loader.classList.remove('is-hidden');
          body.classList.add('is-loading');
          body.classList.remove('ready');
          setTimeout(() => { window.location.href = href; }, 320);
        });
      }
    });
  };
  setupLinkInterception();

  /* ─────────────────────────────────────────────────────────
   * MOBILE NAV
   * ──────────────────────────────────────────────────────── */
  const hamburger  = document.getElementById('dvHamburger');
  const mobileMenu = document.getElementById('dvMobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', e => {
      e.preventDefault();
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
   * UNIFIED REVEAL (IntersectionObserver)
   * Handles: .reveal / .reveal-* / [data-stagger] / [data-stagger-*]
   * ──────────────────────────────────────────────────────── */
  const revealSelectors = [
    '[data-reveal]', '[data-stagger]', '[data-stagger-left]', '[data-stagger-scale]',
    '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
    '.reveal-blur', '.reveal-slide-up', '.reveal-zoom', '.reveal-flip'
  ].join(',');

  const revealEls = Array.from(document.querySelectorAll(revealSelectors));

  if (!prefersReduced && revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('exit', 'is-exiting');
          entry.target.classList.add('active', 'is-visible');
        }
      });
    }, {
      threshold: isMobile() ? 0.05 : 0.12,
      rootMargin: '0px 0px -40px 0px'
    });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('active', 'is-visible'));
  }

  /* ─────────────────────────────────────────────────────────
   * COUNTER ANIMATION (data-counter attribute)
   * Usage: <span data-counter="2500" data-suffix="+">0</span>
   * ──────────────────────────────────────────────────────── */
  const animateCounter = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target   = parseInt(el.dataset.counter, 10);
    const suffix   = el.dataset.suffix  || '';
    const prefix   = el.dataset.prefix  || '';
    const duration = parseInt(el.dataset.duration || '2000', 10);
    const start    = performance.now();
    const easeOut  = t => 1 - Math.pow(1 - t, 3);

    const tick = (now) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const val     = Math.round(easeOut(elapsed) * target);
      el.textContent = prefix + val.toLocaleString() + suffix;
      if (elapsed < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    };
    requestAnimationFrame(tick);
  };

  if (!prefersReduced) {
    const counterEls = document.querySelectorAll('[data-counter]');
    if (counterEls.length) {
      const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counterEls.forEach(el => counterObs.observe(el));
    }
  }

  /* ─────────────────────────────────────────────────────────
   * 3D CARD TILT ENGINE (desktop / fine-pointer only)
   * ──────────────────────────────────────────────────────── */
  if (!prefersReduced && !isTouchDevice()) {
    const tiltCards = document.querySelectorAll('.card-3d');
    const MAX_TILT  = 10; // degrees

    tiltCards.forEach(card => {
      const inner = card.querySelector('.card-3d-inner') || card;

      card.addEventListener('mousemove', e => {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const dx    = (e.clientX - cx) / (rect.width  / 2);
        const dy    = (e.clientY - cy) / (rect.height / 2);
        const tiltX = -(dy * MAX_TILT).toFixed(2);
        const tiltY =  (dx * MAX_TILT).toFixed(2);

        card.classList.add('is-tilting');
        inner.style.transform =
          `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02,1.02,1.02)`;

        // Magnetic glow tracking
        const pctX = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        const pctY = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        inner.style.setProperty('--mx', pctX + '%');
        inner.style.setProperty('--my', pctY + '%');
      }, { passive: true });

      const resetTilt = () => {
        card.classList.remove('is-tilting');
        inner.style.transform = '';
        inner.style.removeProperty('--mx');
        inner.style.removeProperty('--my');
      };
      card.addEventListener('mouseleave', resetTilt, { passive: true });
      card.addEventListener('focusout',   resetTilt, { passive: true });
    });
  }

  /* ─────────────────────────────────────────────────────────
   * MAGNETIC BUTTON GLOW (mouse tracking)
   * ──────────────────────────────────────────────────────── */
  if (!prefersReduced && !isTouchDevice()) {
    document.querySelectorAll('.btn-magnetic, .btn-primary, .btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        btn.style.setProperty('--mx', x + '%');
        btn.style.setProperty('--my', y + '%');
      }, { passive: true });
      btn.addEventListener('mouseleave', () => {
        btn.style.removeProperty('--mx');
        btn.style.removeProperty('--my');
      }, { passive: true });
    });
  }

  /* ─────────────────────────────────────────────────────────
   * TOUCH RIPPLE EFFECT (mobile buttons)
   * ──────────────────────────────────────────────────────── */
  const addRipple = (e) => {
    const btn = e.currentTarget;
    const existing = btn.querySelector('.btn-ripple');
    if (existing) existing.remove();

    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const rect = btn.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    ripple.style.left = (touch.clientX - rect.left) + 'px';
    ripple.style.top  = (touch.clientY - rect.top)  + 'px';
    btn.style.position = 'relative';
    btn.style.overflow  = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  };

  if (!prefersReduced) {
    document.querySelectorAll('.btn, .dv-btn-book').forEach(btn => {
      btn.addEventListener('touchstart', addRipple, { passive: true });
    });
  }

  /* ─────────────────────────────────────────────────────────
   * PROGRESS BARS (data-progress="65" → animate to 65%)
   * ──────────────────────────────────────────────────────── */
  if (!prefersReduced) {
    const progressBars = document.querySelectorAll('[data-progress]');
    if (progressBars.length) {
      const barObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el  = entry.target;
            const fill = el.querySelector('.progress-bar-fill');
            if (fill) {
              fill.style.transform = `scaleX(${parseFloat(el.dataset.progress) / 100})`;
              fill.classList.add('active');
            }
            barObs.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      progressBars.forEach(el => barObs.observe(el));
    }
  }

  /* ─────────────────────────────────────────────────────────
   * NAV SCROLL EFFECT (header shrink + active link)
   * ──────────────────────────────────────────────────────── */
  const header = document.getElementById('dvHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ─────────────────────────────────────────────────────────
   * SECURITY DETERRENTS
   * ──────────────────────────────────────────────────────── */
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if (e.keyCode === 123) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); return false; }
  });

  console.log('%c Dentaverse Security ', 'background:#0066CC;color:#fff;font-size:18px;font-weight:bold;padding:8px;border-radius:5px;');
  console.log('%cThis area is for developers only. Intellectual Property of Dentaverse UK.', 'color:#5a7a9a;font-size:13px;');

})();
