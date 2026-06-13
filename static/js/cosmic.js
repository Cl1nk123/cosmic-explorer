/* ===== STARFIELD ===== */
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 4000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.008,
        speed: Math.random() * 0.08 + 0.01,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      s.y += s.speed;
      if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 210, 255, ${s.a})`;
      ctx.fill();
    }

    // Occasional shooting star
    if (Math.random() < 0.003) shootingStar();

    requestAnimationFrame(draw);
  }

  let shooters = [];
  function shootingStar() {
    shooters.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 6,
      life: 1,
    });
  }

  function drawShooters() {
    shooters = shooters.filter(s => s.life > 0);
    for (const s of shooters) {
      ctx.save();
      ctx.globalAlpha = s.life;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y + s.len);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(1, 'rgba(77,171,247,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y + s.len);
      ctx.stroke();
      ctx.restore();
      s.x += s.speed;
      s.y += s.speed;
      s.life -= 0.025;
    }
  }

  // Override draw to include shooters
  const _draw = draw;
  function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      s.y += s.speed;
      if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 210, 255, ${s.a})`;
      ctx.fill();
    }
    if (Math.random() < 0.003) shootingStar();
    drawShooters();
    requestAnimationFrame(drawAll);
  }

  window.addEventListener('resize', () => { resize(); initStars(); });
  resize();
  initStars();
  drawAll();
})();


/* ===== CURSOR ===== */
(function () {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    dot.style.left  = mx - 4 + 'px';
    dot.style.top   = my - 4 + 'px';
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx - 15 + 'px';
    ring.style.top  = ry - 15 + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'scale(2.5)';
      ring.style.transform = 'scale(1.5)';
      ring.style.borderColor = 'rgba(77,171,247,0.9)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = '';
      ring.style.transform = '';
      ring.style.borderColor = '';
    });
  });
})();


/* ===== SCROLL REVEAL ===== */
(function () {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Animate progress bars inside
        e.target.querySelectorAll('.fact-progress-bar').forEach(bar => {
          bar.style.width = bar.dataset.width || '0%';
        });
        // Animate counters inside
        e.target.querySelectorAll('[data-count]').forEach(el => animateCount(el));
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
})();


/* ===== TYPEWRITER ===== */
function typewriter(el, text, speed = 60) {
  if (!el) return;
  el.textContent = '';
  const cursor = el.nextElementSibling;
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

document.addEventListener('DOMContentLoaded', () => {
  const tw = document.getElementById('typewriter-text');
  if (tw) typewriter(tw, tw.dataset.text, 55);
});


/* ===== ANIMATED COUNTERS ===== */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = target * ease;
    el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('ru')) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


/* ===== CARD 3D TILT ===== */
document.querySelectorAll('.planet-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.querySelector('.planet-card-inner').style.transform =
      `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.querySelector('.planet-card-inner').style.transform = '';
  });
});


/* ===== NAVBAR SCROLL EFFECT ===== */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar-cosmic');
  if (!nav) return;
  nav.style.boxShadow = window.scrollY > 50
    ? '0 4px 30px rgba(77,171,247,0.15)'
    : 'none';
});
