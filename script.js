/* ============================================
   ChatGPT Plus — Landing Page Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Loader ----
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    // Fallback: hide loader after 2s even if load doesn't fire
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }

  // ---- Header scroll effect ----
  const header = document.querySelector('.header');
  if (header) {
    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ---- Mobile Menu ----
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('open');
    });

    // Close menu on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
        menuToggle.classList.remove('active');
        nav.classList.remove('open');
      }
    });
  }

  // ---- Countdown Timer ----
  const countdownEl = document.getElementById('countdown');
  if (countdownEl) {
    // Set countdown to end of current day or next 12 hours
    let endTime = localStorage.getItem('countdown_end');

    if (!endTime || parseInt(endTime) < Date.now()) {
      // Set new countdown: 12 hours from now
      endTime = Date.now() + (12 * 60 * 60 * 1000);
      localStorage.setItem('countdown_end', endTime.toString());
    } else {
      endTime = parseInt(endTime);
    }

    function updateCountdown() {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        // Reset countdown
        endTime = Date.now() + (12 * 60 * 60 * 1000);
        localStorage.setItem('countdown_end', endTime.toString());
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hEl = document.getElementById('cd-hours');
      const mEl = document.getElementById('cd-minutes');
      const sEl = document.getElementById('cd-seconds');

      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ---- Scroll Reveal ----
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
  }

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all others
        faqItems.forEach(i => i.classList.remove('active'));

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});
