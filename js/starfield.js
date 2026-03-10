// ===== STARFIELD WARP SECTION TRANSITION =====

(function(){
  const cv = document.getElementById('rain-overlay');
  if (!cv) return;
  const ctx = cv.getContext('2d');

  let W = 0, H = 0, animId, running = false;

  function resize() {
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);

  function playWarp() {
    if (running) cancelAnimationFrame(animId);
    running = true;
    resize(); // always fresh dimensions

    const cx = W / 2, cy = H / 2;
    const stars = Array.from({ length: 300 }, () => ({
      x: (Math.random() - 0.5) * W * 2,
      y: (Math.random() - 0.5) * H * 2,
      z: Math.random() * W,
      pz: 0,
      c: Math.random() > 0.4 ? '0,245,255' : Math.random() > 0.5 ? '160,230,255' : '255,255,255'
    }));

    let t = 0;
    const FRAMES = 120;

    cv.style.transition = 'none';
    cv.style.opacity = '1';
    ctx.fillStyle = 'rgb(3,9,18)';
    ctx.fillRect(0, 0, W, H);

    function tick() {
      t++;
      const p = t / FRAMES;

      const speed = p < 0.2
        ? W * p * 3
        : p < 0.7
          ? W * (0.6 + (p - 0.2) * 2.5)
          : W * Math.max(0.05, (1 - p) * 3);

      ctx.fillStyle = (p > 0.15 && p < 0.75) ? 'rgba(3,9,18,0.25)' : 'rgba(3,9,18,0.5)';
      ctx.fillRect(0, 0, W, H);

      if (p > 0.25 && p < 0.75) {
        const gp = Math.sin((p - 0.25) / 0.5 * Math.PI);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.6);
        g.addColorStop(0,   `rgba(0,245,255,${gp * 0.22})`);
        g.addColorStop(0.5, `rgba(0,100,200,${gp * 0.08})`);
        g.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      stars.forEach(s => {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 1) {
          s.x = (Math.random() - 0.5) * W * 2;
          s.y = (Math.random() - 0.5) * H * 2;
          s.z = s.pz = W;
        }
        const sx = (s.x / s.z)  * W + cx;
        const sy = (s.y / s.z)  * H + cy;
        const px = (s.x / s.pz) * W + cx;
        const py = (s.y / s.pz) * H + cy;
        if (sx < -10 || sx > W+10 || sy < -10 || sy > H+10) return;
        const bright = Math.pow(1 - s.z / W, 0.6);
        const alpha  = Math.min(1, bright * 1.8);
        const lw     = Math.max(0.5, bright * 4);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = `rgba(${s.c},1)`;
        ctx.lineWidth   = lw;
        ctx.shadowBlur  = lw * 7;
        ctx.shadowColor = 'rgba(0,245,255,1)';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
        ctx.restore();
      });

      if (t < FRAMES) {
        animId = requestAnimationFrame(tick);
      } else {
        cv.style.transition = 'opacity 0.5s ease';
        cv.style.opacity = '0';
        setTimeout(() => {
          ctx.clearRect(0, 0, W, H);
          cv.style.transition = '';
          running = false;
        }, 520);
      }
    }
    animId = requestAnimationFrame(tick);
  }

  // ── Section detection ──────────────────────────────────────────────
  const SECS = ['hero','summary','skills','experience','education'];
  let lastIdx = 0, cooldown = false;

  function getIdx() {
    const mid = window.scrollY + window.innerHeight * 0.5;
    let idx = 0;
    SECS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= mid) idx = i;
    });
    return idx;
  }

  function onScroll() {
    if (cooldown) return;
    const idx = getIdx();
    if (idx !== lastIdx) {
      lastIdx = idx;
      cooldown = true;
      playWarp();
      setTimeout(() => { cooldown = false; }, 2400);
    }
  }

  // Hook into siteReady event fired by initScrollAnimations
  window.addEventListener('siteReady', () => {
    resize();
    lastIdx = getIdx();
    window.addEventListener('scroll', onScroll, { passive: true });
  }, { once: true });

  window._playWarp = playWarp;
})()

// Smooth scroll for nav
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});