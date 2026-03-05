/* ============================================
   RocketMouse AI — Premium Website JavaScript
   Scroll animations, counters, spotlight
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile navigation toggle ---
  const toggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      toggle.textContent = navLinks.classList.contains('show') ? '\u2715' : '\u2630';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        toggle.textContent = '\u2630';
      });
    });
  }

  // --- Nav scroll state ---
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Scroll Reveal (IntersectionObserver) ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // --- Animated Number Counters ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // --- Card spotlight effect (mouse-following gradient) ---
  const cards = document.querySelectorAll('.card, .block-cat-card, .pricing-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // --- Collapsible sections ---
  document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('open');
    });
  });

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      q.parentElement.classList.toggle('open');
    });
  });

  // --- Help page TOC active state ---
  const tocLinks = document.querySelectorAll('.help-toc a[href^="#"]');
  if (tocLinks.length > 0) {
    const sections = [];
    tocLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) sections.push({ link, el });
    });

    const updateActiveToc = () => {
      const scrollY = window.scrollY + 120;
      let current = sections[0];
      for (const s of sections) {
        if (s.el.offsetTop <= scrollY) current = s;
      }
      tocLinks.forEach(l => l.classList.remove('active'));
      if (current) current.link.classList.add('active');
    };

    window.addEventListener('scroll', updateActiveToc, { passive: true });
    updateActiveToc();
  }

  // --- Help page mobile sidebar toggle ---
  const sidebarToggle = document.querySelector('.help-sidebar-toggle');
  const sidebar = document.querySelector('.help-sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Star field & shooting stars (canvas-based) ---
  (function createStarField() {
    const c = document.createElement('div');
    c.className = 'stars-container';
    c.setAttribute('aria-hidden', 'true');

    // Canvas for high-performance star rendering
    const canvas = document.createElement('canvas');
    canvas.className = 'stars-canvas';
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    c.appendChild(canvas);

    // Aurora nebula (two layers for depth)
    const aurora1 = document.createElement('div');
    aurora1.className = 'stars-aurora';
    c.appendChild(aurora1);
    const aurora2 = document.createElement('div');
    aurora2.className = 'stars-aurora-2';
    c.appendChild(aurora2);

    // 8 shooting stars
    for (let i = 1; i <= 8; i++) {
      const s = document.createElement('div');
      s.className = 'shooting-star shooting-star-' + i;
      c.appendChild(s);
    }

    document.body.insertBefore(c, document.body.firstChild);

    // --- Canvas star renderer ---
    const ctx = canvas.getContext('2d');
    let W, H, stars = [], animId;
    const STAR_COUNT = 500;
    const COLORS = [
      [255,255,255],    // white
      [16,185,129],     // green
      [6,182,212],      // cyan
      [99,102,241],     // indigo
      [167,139,250],    // purple
      [251,191,36],     // amber (rare)
    ];

    function initStars() {
      W = canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      H = canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const colorIdx = Math.random() < 0.6 ? 0 : // 60% white
                         Math.random() < 0.4 ? 1 : // ~16% green
                         Math.random() < 0.4 ? 2 : // ~10% cyan
                         Math.random() < 0.5 ? 3 : // ~7% indigo
                         Math.random() < 0.7 ? 4 : 5; // purple/amber
        const size = Math.random() < 0.7 ? 1 : Math.random() < 0.8 ? 1.5 : 2.5;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: size,
          color: COLORS[colorIdx],
          alpha: 0.3 + Math.random() * 0.7,
          twinkleSpeed: 0.5 + Math.random() * 2.5,
          twinklePhase: Math.random() * Math.PI * 2,
          glow: size > 2, // large stars get glow
        });
      }
    }

    function drawStars(time) {
      ctx.clearRect(0, 0, W, H);
      const t = time * 0.001;
      for (const s of stars) {
        const flicker = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        const a = s.alpha * (0.3 + 0.7 * flicker);
        const [r, g, b] = s.color;

        if (s.glow) {
          // Glow halo for large stars
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
          grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
          grad.addColorStop(0.3, `rgba(${r},${g},${b},${a * 0.4})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star core
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(drawStars);
    }

    initStars();
    drawStars(0);

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { initStars(); }, 200);
    });
  })();

  // --- Parallax orbs on mouse move (hero section only) ---
  const heroSection = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.hero-bg .orb');
  if (heroSection && orbs.length > 0) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }
});
