// ===== SCROLL ANIMATIONS =====

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  // Signal warp system that site is now visible and laid out
  setTimeout(() => window.dispatchEvent(new CustomEvent('siteReady')), 400);
}

// ===== HEX PLAYGROUND =====

function buildHexGrid() {
  const grid = document.getElementById('hex-grid');
  if (!grid) return;

  const perRow = [5, 4, 5, 4, 1]; // honeycomb rows
  let idx = 0;
  let delay = 0;

  perRow.forEach((count, rowNum) => {
    const row = document.createElement('div');
    row.className = 'hex-row';

    for (let c = 0; c < count && idx < techLogos.length; c++, idx++) {
      const tech = techLogos[idx];
      const cell = document.createElement('div');
      cell.className = 'hex-cell';
      cell.style.setProperty('--tech-color', tech.color);

      cell.innerHTML = `
        <div class="hex-glow" style="background:radial-gradient(circle, ${tech.color}40 0%, transparent 70%)"></div>
        <div class="hex-shape"></div>
        <svg class="hex-border-svg" viewBox="0 0 100 115" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,2 98,26.5 98,88.5 50,113 2,88.5 2,26.5" stroke="${tech.color}" fill="none" stroke-width="1.5"/>
        </svg>
        <div class="hex-logo">
          ${tech.svg}
          <div class="hex-logo-name" style="color:${tech.color};text-shadow:0 0 8px ${tech.color}">${tech.name}</div>
        </div>
      `;

      cell.style.opacity = '0';
      cell.style.transform = 'scale(0.6) translateY(20px)';
      cell.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(((el) => () => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1) translateY(0)';
      })(cell), delay);
      delay += 55;

      row.appendChild(cell);
    }
    grid.appendChild(row);
  });
}

// Build hex grid when main site loads (trigger via MutationObserver)
const hexObserver = new MutationObserver(() => {
  if (document.getElementById('main-site').style.display !== 'none') {
    buildHexGrid();
    buildHeroHexPanel();
    hexObserver.disconnect();
  }
});
hexObserver.observe(document.getElementById('main-site'), { attributes: true, attributeFilter: ['style'] });

// ── HERO HEX PANEL ──────────────────────────────────────────────────────────
function buildHeroHexPanel() {
  const panel = document.getElementById('hero-hex-panel');
  if (!panel) return;

  // Row pattern: counts of hexes per row (honeycomb style)
  const rows = [4, 5, 4, 5, 4, 5, 4];
  let logoIdx = 0;

  rows.forEach((count, rowNum) => {
    const row = document.createElement('div');
    row.className = 'hero-hex-row' + (rowNum % 2 === 1 ? ' offset' : '');

    for (let c = 0; c < count; c++) {
      const tech = techLogos[logoIdx % techLogos.length];
      logoIdx++;

      const hex = document.createElement('div');
      hex.className = 'hhex';

      hex.innerHTML = `
        <div class="hhex-bg"></div>
        <svg class="hhex-border" viewBox="0 0 74 85" xmlns="http://www.w3.org/2000/svg">
          <polygon points="37,2 72,20 72,65 37,83 2,65 2,20"
            stroke="${tech.color}" stroke-opacity="0.22" fill="none" stroke-width="1.2"/>
        </svg>
        <div class="hhex-logo">
          ${tech.svg.replace(/width="[^"]*"/, 'width="26"').replace(/height="[^"]*"/, 'height="26"')}
          <div class="hhex-logo-name" style="color:${tech.color}">${tech.name}</div>
        </div>
      `;

      row.appendChild(hex);
    }
    panel.appendChild(row);
  });

  // Ambient random lighting
  const hexes = panel.querySelectorAll('.hhex');
  function lightRandom() {
    const idx = Math.floor(Math.random() * hexes.length);
    hexes[idx].classList.add('lit');
    setTimeout(() => hexes[idx].classList.remove('lit'), 700 + Math.random() * 900);
  }
  setInterval(lightRandom, 120);
  for (let i = 0; i < 6; i++) setTimeout(lightRandom, i * 80);
}

// ─── SCROLL REVEAL ───
function initReveal() {
  const els = document.querySelectorAll('.fade-up');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}
initReveal();


(function() {
  function initTileParticles(canvas) {
    const colorRaw = canvas.dataset.color || '0,245,255';
    const tile = canvas.parentElement;
    let w, h, particles = [], animId;

    function resize() {
      const rect = tile.getBoundingClientRect();
      w = canvas.width = Math.round(rect.width) || tile.offsetWidth;
      h = canvas.height = Math.round(rect.height) || tile.offsetHeight;
    }

    function Particle() {
      this.reset = function() {
        this.x = Math.random() * w;
        this.y = h + Math.random() * 20;
        this.size = 0.8 + Math.random() * 2.2;
        this.speedY = 0.3 + Math.random() * 0.7;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.opacity = 0;
        this.maxOpacity = 0.25 + Math.random() * 0.55;
        this.fadeIn = true;
        this.life = 0;
        this.maxLife = 90 + Math.random() * 120;
        this.glow = 2 + Math.random() * 6;
      };
      this.reset();
      this.y = Math.random() * h; // scatter on init
      this.life = Math.random() * this.maxLife;
      this.opacity = Math.random() * this.maxOpacity;
    }

    function tick(ctx) {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.life++;
        p.x += p.speedX;
        p.y -= p.speedY;

        if (p.life < 20) p.opacity = Math.min(p.maxOpacity, p.opacity + p.maxOpacity / 20);
        else if (p.life > p.maxLife - 30) p.opacity = Math.max(0, p.opacity - p.maxOpacity / 30);

        if (p.life >= p.maxLife || p.y < -10) p.reset();

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRaw},${p.opacity.toFixed(3)})`;
        ctx.shadowBlur = p.glow;
        ctx.shadowColor = `rgba(${colorRaw},0.8)`;
        ctx.fill();
        ctx.restore();
      });
    }

    function loop(ctx) {
      tick(ctx);
      animId = requestAnimationFrame(() => loop(ctx));
    }

    resize();
    window.addEventListener('resize', resize);

    const count = 28;
    for (let i = 0; i < count; i++) particles.push(new Particle());

    loop(canvas.getContext('2d'));
    tile.addEventListener('mouseenter', () => { particles.forEach(p => { p.speedX *= 2.2; p.speedY *= 2.2; }); });
    tile.addEventListener('mouseleave', () => { particles.forEach(p => { p.speedX /= 2.2; p.speedY /= 2.2; }); });
  }

  // Defer tile particle init until tiles are visible & have real dimensions
  const tileObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const canvas = entry.target;
        tileObserver.unobserve(canvas);
        // Small delay lets browser finish layout paint
        setTimeout(() => initTileParticles(canvas), 80);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tile-particles').forEach(c => tileObserver.observe(c));

})();