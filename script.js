/**
 * script.js — Cybersecurity Writeups Portfolio
 * Author: Dharmendra Kumar (dharmstm)
 */

/* ============================================
   LOADER
   ============================================ */
(function initLoader() {
  const loader  = document.getElementById('loader');
  const pct     = document.getElementById('loader-pct');
  let progress  = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      pct.textContent = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        // Kick off counters after loader hides
        startCounters();
      }, 400);
    }
    pct.textContent = Math.floor(progress) + '%';
  }, 100);
})();

/* ============================================
   PARTICLES CANVAS
   ============================================ */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, pts = [];

  const COLORS = ['rgba(0,212,255,', 'rgba(124,58,237,', 'rgba(0,255,135,'];
  const COUNT  = 70;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function spawn() {
    pts = [];
    for (let i = 0; i < COUNT; i++) {
      pts.push({
        x:  rand(0, W),
        y:  rand(0, H),
        vx: rand(-0.3, 0.3),
        vy: rand(-0.3, 0.3),
        r:  rand(1, 2.2),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: rand(0.3, 0.8)
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx   = pts[i].x - pts[j].x;
        const dy   = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); spawn(); });
  resize();
  spawn();
  draw();
})();

/* ============================================
   NAVBAR — scroll + mobile hamburger
   ============================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on nav link click (mobile)
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

/* ============================================
   TYPING ANIMATION — hero terminal
   ============================================ */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const lines = [
    'Documenting every exploit — so you can learn the methodology.',
    'Step-by-step from recon to root. No steps skipped.',
    'HTB + THM writeups by dharmstm.'
  ];
  let li = 0, ci = 0, dir = 1;

  function tick() {
    const line = lines[li];
    if (dir === 1) {
      ci++;
      el.textContent = line.slice(0, ci);
      if (ci === line.length) {
        dir = -1;
        setTimeout(tick, 2200);
        return;
      }
    } else {
      ci--;
      el.textContent = line.slice(0, ci);
      if (ci === 0) {
        dir = 1;
        li  = (li + 1) % lines.length;
        setTimeout(tick, 400);
        return;
      }
    }
    setTimeout(tick, dir === 1 ? 42 : 22);
  }
  tick();
})();

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function startCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current  = 0;
    const step   = Math.ceil(target / 30);
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current;
    }, 50);
  });
}

/* ============================================
   REVEAL ON SCROLL (IntersectionObserver)
   ============================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx      = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================
   BACK TO TOP
   ============================================ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================================
   SEARCH + FILTER
   ============================================ */
(function initFilters() {
  const searchBox   = document.getElementById('searchBox');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const cards       = document.querySelectorAll('.writeup-card');
  const noResults   = document.getElementById('noResults');
  let   activeFilter = 'all';

  function applyFilters() {
    const query = searchBox.value.toLowerCase().trim();
    let   shown = 0;

    cards.forEach(card => {
      const platform = card.dataset.platform;
      const title    = card.dataset.title.toLowerCase();
      const tags     = card.dataset.tags.toLowerCase();
      const desc     = card.querySelector('.card-desc').textContent.toLowerCase();

      const matchesFilter = activeFilter === 'all' || platform === activeFilter;
      const matchesSearch = !query || title.includes(query) || tags.includes(query) || desc.includes(query);

      if (matchesFilter && matchesSearch) {
        card.classList.remove('hidden');
        shown++;
      } else {
        card.classList.add('hidden');
      }
    });

    noResults.classList.toggle('hidden', shown > 0);
  }

  searchBox.addEventListener('input', applyFilters);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });
})();

/* ============================================
   PDF MODAL
   ============================================ */
(function initModal() {
  const modal    = document.getElementById('pdfModal');
  const frame    = document.getElementById('pdfFrame');
  const title    = document.getElementById('modalTitle');
  const closeBtn = document.getElementById('modalClose');
  const backdrop = modal.querySelector('.modal-backdrop');
  const download = document.getElementById('modalDownload');

  function openModal(pdfUrl, pdfTitle) {
    // Convert GitHub blob URL to raw viewer for embed
    // Use Google Docs viewer as fallback for cross-origin PDF embed
    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
    frame.src       = viewerUrl;
    title.textContent = pdfTitle;
    download.href   = pdfUrl;
    modal.classList.remove('hidden');
    // Trigger transition
    requestAnimationFrame(() => modal.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    setTimeout(() => {
      modal.classList.add('hidden');
      frame.src = '';
    }, 350);
    document.body.style.overflow = '';
  }

  // Open on "Read Writeup" click
  document.querySelectorAll('.btn-read').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.pdf, btn.dataset.title);
    });
  });

  // Close handlers
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
