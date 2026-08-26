(() => {
  'use strict';

  /* ---------- Header + scroll progress ---------- */
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('progressBar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    header.classList.toggle('is-scrolled', scrollTop > 40);

    let current = '';
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Custom cursor ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isFinePointer) {
    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX; targetY = e.clientY;
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
    function animateRing() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('.hover-target').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-up, .timeline-item').forEach((el) => {
    revealObserver.observe(el);
  });

  /* ---------- Counters ---------- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('es-ES');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('es-ES');
    }
    requestAnimationFrame(tick);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

  /* ---------- Language bars ---------- */
  const langObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.lang-fill');
        fill.style.width = fill.dataset.fill + '%';
        langObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.lang-row').forEach((el) => langObserver.observe(el));

  /* ---------- Timeline fill ---------- */
  const timelineSection = document.getElementById('experiencia');
  const timelineFill = document.getElementById('timelineFill');
  function updateTimelineFill() {
    if (!timelineSection) return;
    const rect = timelineSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    const progressed = Math.min(Math.max(vh * 0.7 - rect.top, 0), total);
    const pct = total > 0 ? (progressed / total) * 100 : 0;
    timelineFill.style.height = pct + '%';
  }
  document.addEventListener('scroll', updateTimelineFill, { passive: true });
  updateTimelineFill();

  /* ---------- Hero role typewriter ---------- */
  const roles = [
    'Business Development · Ciberseguridad',
    'Ciberinteligencia & Investigación OSINT',
    'Planes Directores de Seguridad',
    'Transformación Digital para Pymes',
  ];
  const roleEl = document.getElementById('roleType');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      roleEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      charIndex--;
      roleEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 28 : 48);
  }
  typeLoop();

  /* ---------- Particle network canvas ---------- */
  function initNetwork(canvasId, density) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, nodes;

    function resize() {
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      canvas.style.width = canvas.offsetWidth + 'px';
      canvas.style.height = canvas.offsetHeight + 'px';
      const count = Math.floor((width * height) / (18000 / density));
      nodes = Array.from({ length: Math.min(count, 90) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 160 * window.devicePixelRatio;
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(24, 24, 26, ${0.1 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(255, 90, 31, 0.4)';
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, 1.6 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize);
    resize();
    frame();
  }
  initNetwork('netCanvas', 1);
  initNetwork('netCanvas2', 0.6);

  /* ---------- Floating 3D objects parallax ---------- */
  const floatObjects = Array.from(document.querySelectorAll('.float-object'));

  if (floatObjects.length) {
    function updateFloatParallax() {
      const scrollY = window.scrollY;
      floatObjects.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || '0.08');
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
    document.addEventListener('scroll', updateFloatParallax, { passive: true });
    updateFloatParallax();
  }

  /* ---------- Ambient effect: waveform canvas ---------- */
  (function initWaveform() {
    const canvas = document.getElementById('waveformCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width, height, bars;
    const barCount = window.innerWidth < 768 ? 22 : 48;

    function resize() {
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      bars = Array.from({ length: barCount }, () => ({
        h: 0.15 + Math.random() * 0.5,
        target: 0.15 + Math.random() * 0.5,
        speed: 0.01 + Math.random() * 0.02,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const gap = width / barCount;
      const barWidth = gap * 0.4;
      bars.forEach((bar, i) => {
        if (!reduceMotion) {
          bar.h += (bar.target - bar.h) * bar.speed;
          if (Math.abs(bar.target - bar.h) < 0.01) bar.target = 0.1 + Math.random() * 0.55;
        }
        const barHeight = bar.h * height * 0.5;
        const x = i * gap + gap / 2 - barWidth / 2;
        const y = height / 2 - barHeight / 2;
        ctx.fillStyle = 'rgba(107, 107, 107, 0.12)';
        ctx.fillRect(x, y, barWidth, barHeight);
      });
    }

    function loop() {
      draw();
      if (!reduceMotion) requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    loop();
  })();

  /* ---------- Ambient effect: ascending code columns ---------- */
  (function initCodeRain() {
    const container = document.getElementById('codeRain');
    if (!container) return;
    const chars = '01{}<>/\\#$%&ABCDEFGHIJKLMNOPQRSTUVWXYZ*+=';
    const columnCount = window.innerWidth < 768 ? 6 : 14;
    const rowsPerHalf = 30;

    for (let i = 0; i < columnCount; i++) {
      const col = document.createElement('div');
      col.className = 'code-column';
      let text = '';
      for (let half = 0; half < 2; half++) {
        for (let r = 0; r < rowsPerHalf; r++) {
          text += chars[Math.floor(Math.random() * chars.length)] + '\n';
        }
      }
      col.textContent = text;
      col.style.animationDuration = `${18 + Math.random() * 14}s`;
      col.style.animationDelay = `-${Math.random() * 20}s`;
      container.appendChild(col);
    }
  })();

})();
