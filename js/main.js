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

  // --- Star field & shooting stars (auto-injected) ---
  (function createStarField() {
    const c = document.createElement('div');
    c.className = 'stars-container';
    c.setAttribute('aria-hidden', 'true');

    // 3 star layers
    ['stars-sm', 'stars-md', 'stars-lg'].forEach(cls => {
      const el = document.createElement('div');
      el.className = cls;
      c.appendChild(el);
    });

    // Aurora nebula
    const aurora = document.createElement('div');
    aurora.className = 'stars-aurora';
    c.appendChild(aurora);

    // 5 shooting stars
    for (let i = 1; i <= 5; i++) {
      const s = document.createElement('div');
      s.className = 'shooting-star shooting-star-' + i;
      c.appendChild(s);
    }

    document.body.insertBefore(c, document.body.firstChild);
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
