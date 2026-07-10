/* ============================================
   ChatGPT Plus — Script Otimizado
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Loader ----
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 300));
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }

  // ---- Header scroll ----
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile menu ----
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('.nav-link, .btn-nav').forEach(el => {
      el.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
      });
    });
    document.addEventListener('click', e => {
      if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
      }
    });
  }

  // ---- Countdown Timer (reseta a cada acesso) ----
  function initCountdown() {
    const elems = [
      { h: 'cd-hours', m: 'cd-minutes', s: 'cd-seconds' },
      { h: 'fcd-hours', m: 'fcd-minutes', s: 'fcd-seconds' }
    ];

    // Sempre reinicia: 45 minutos a partir de AGORA
    const resetTime = Date.now() + (45 * 60 * 1000);
    localStorage.setItem('countdown_end', resetTime.toString());

    let endTime = resetTime;

    function update() {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        // Reinicia automaticamente
        endTime = Date.now() + (45 * 60 * 1000);
        localStorage.setItem('countdown_end', endTime.toString());
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      elems.forEach(({ h: hid, m: mid, s: sid }) => {
        const he = document.getElementById(hid);
        const me = document.getElementById(mid);
        const se = document.getElementById(sid);
        if (he) he.textContent = String(h).padStart(2, '0');
        if (me) me.textContent = String(m).padStart(2, '0');
        if (se) se.textContent = String(s).padStart(2, '0');
      });
    }

    update();
    setInterval(update, 1000);
  }
  initCountdown();

  // ---- Floating CTA ----
  const floatingCta = document.getElementById('floatingCta');
  if (floatingCta) {
    const planSection = document.getElementById('plano');
    if (planSection) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) floatingCta.classList.remove('visible');
          else floatingCta.classList.add('visible');
        });
      }, { threshold: 0.3 });
      observer.observe(planSection);
    }
  }

  // ---- Scroll Reveal ----
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // ---- Smooth scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = document.querySelector('.header')?.offsetHeight || 60;
        const urgencyH = document.getElementById('urgencyBar')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - urgencyH - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Button ripple effect ----
  document.querySelectorAll('.btn-buy, .btn-buy-full, .btn-buy-final').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: 20px; height: 20px;
        left: ${e.clientX - rect.left - 10}px;
        top: ${e.clientY - rect.top - 10}px;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframes
  const style = document.createElement('style');
  style.textContent = `@keyframes ripple { to { transform: scale(20); opacity: 0; } }`;
  document.head.appendChild(style);
});