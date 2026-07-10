/* ============================================
   ChatGPT Plus — Script Completo
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

  // ---- ESTOQUE DINÂMICO ----
  function initStock() {
    // Pega o dia do mês para simular estoque que muda
    const day = new Date().getDate();
    const hour = new Date().getHours();
    
    // Estoque base que varia entre 8-22 unidades
    // Simula que o estoque vai diminuindo ao longo do dia
    let baseStock = 15 + (day % 8); // 15 a 22
    let currentStock = Math.max(8, baseStock - Math.floor(hour * 0.5));
    
    // Adiciona variação aleatória para parecer mais real
    currentStock += Math.floor(Math.random() * 4) - 2;
    currentStock = Math.max(7, Math.min(22, currentStock));

    // Atualiza todos os lugares com o número do estoque
    const elements = ['stockNum', 'stockDisplayNum'];
    elements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = currentStock;
    });

    // Atualiza barra de progresso do estoque
    const sdFill = document.getElementById('sdFill');
    if (sdFill) {
      const pct = (currentStock / 22) * 100;
      sdFill.style.width = pct + '%';
    }

    // Salva no localStorage com expiração
    const stockData = {
      count: currentStock,
      expires: Date.now() + (60 * 60 * 1000) // 1 hora
    };
    localStorage.setItem('stock_data', JSON.stringify(stockData));
  }

  // Verifica estoque salvo ou gera novo
  function loadStock() {
    try {
      const saved = localStorage.getItem('stock_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.expires > Date.now()) {
          // Estoque ainda válido
          const elements = ['stockNum', 'stockDisplayNum'];
          elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = data.count;
          });
          const sdFill = document.getElementById('sdFill');
          if (sdFill) sdFill.style.width = (data.count / 22 * 100) + '%';
          return;
        }
      }
    } catch (e) {}
    initStock();
  }
  loadStock();

  // Diminui estoque quando alguém clica em comprar
  document.querySelectorAll('a[href*="infinitypay"]').forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        const saved = localStorage.getItem('stock_data');
        if (saved) {
          const data = JSON.parse(saved);
          if (data.count > 7) {
            data.count -= 1;
            localStorage.setItem('stock_data', JSON.stringify(data));
            const elements = ['stockNum', 'stockDisplayNum'];
            elements.forEach(id => {
              const el = document.getElementById(id);
              if (el) el.textContent = data.count;
            });
            const sdFill = document.getElementById('sdFill');
            if (sdFill) sdFill.style.width = (data.count / 22 * 100) + '%';
          }
        }
      } catch (e) {}
    });
  });

  // ---- COUNTDOWN TIMER (reinicia a cada visita) ----
  function initCountdown() {
    const elems = [
      { h: 'cd-hours', m: 'cd-minutes', s: 'cd-seconds' },
      { h: 'fcd-hours', m: 'fcd-minutes', s: 'fcd-seconds' }
    ];

    // Sempre reinicia: 45 minutos a partir de agora
    const endTime = Date.now() + (45 * 60 * 1000);
    localStorage.setItem('countdown_end', endTime.toString());

    function update() {
      const now = Date.now();
      const diff = Math.max(0, endTime - now);

      if (diff <= 0) {
        initCountdown();
        return;
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

  // ---- FLOATING CTA ----
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

  // ---- SCROLL REVEAL ----
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

  // ---- FAQ ACCORDION ----
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

  // ---- SMOOTH SCROLL ----
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

  // ---- RIPPLE EFFECT NO BOTÃO ----
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
      btn.style.position = 'relative';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Adiciona keyframes do ripple
  if (!document.querySelector('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = '@keyframes ripple { to { transform: scale(20); opacity: 0; } }';
    document.head.appendChild(style);
  }

  // ---- SOCIAL PROOF — nomes aleatórios ----
  const names = ['João', 'Maria', 'Carlos', 'Ana', 'Pedro', 'Juliana', 'Marcos', 'Fernanda', 'Bruno', 'Rafaela', 'Diego', 'Camila', 'Thiago', 'Beatriz', 'Lucas', 'Felipe', 'Carla', 'Renata', 'Gabriel', 'Bianca'];
  const cities = ['SP', 'RJ', 'BH', 'Curitiba', 'Salvador', 'Recife', 'Fortaleza', 'Porto Alegre', 'Goiânia'];
  const citiesFull = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Salvador', 'Recife', 'Fortaleza', 'Porto Alegre', 'Goiânia'];
  const actions = [
    (n, c) => `🔓 ${n} acabou de comprar`,
    (n, c) => `⭐ ${n} de ${c} avaliou ★★★★★`,
    (n, c) => `⚡ ${n} recebeu em ${Math.floor(Math.random() * 8) + 2} min`,
    (n, c) => `🚀 ${n} ativou o Plus`
  ];

  function updateTicker() {
    const track = document.getElementById('proofTrack');
    if (!track) return;

    const items = [];
    for (let i = 0; i < 10; i++) {
      const n = names[Math.floor(Math.random() * names.length)];
      const c = citiesFull[Math.floor(Math.random() * citiesFull.length)];
      const a = actions[Math.floor(Math.random() * actions.length)];
      items.push(a(n, c));
    }
    track.innerHTML = items.map(t => `<span>${t}</span>`).join('');
  }
  updateTicker();
  setInterval(updateTicker, 8000);
});