// ===== BUILD HEX BACKGROUND =====

try {
  (function() {
    const bg = document.getElementById('load-hex-bg');
    if (!bg) return;
    const cols = Math.ceil(window.innerWidth / 54) + 2;
    const rows = Math.ceil(window.innerHeight / 47) + 2;
    const total = cols * rows;

    for (let i = 0; i < total; i++) {
      const h = document.createElement('div');
      h.className = 'lhex';
      if (i % cols === 0 && (Math.floor(i / cols) % 2 === 1)) {
        h.style.marginLeft = '27px';
      }
      try {
        const tech = techLogos[i % techLogos.length];
        const inner = document.createElement('div');
        inner.className = 'lhex-inner';
        const svgEl = document.createElement('div');
        svgEl.innerHTML = tech.svg;
        const svgNode = svgEl.firstChild;
        if (svgNode) {
          svgNode.setAttribute('width', '20');
          svgNode.setAttribute('height', '20');
          inner.appendChild(svgNode);
        }
        const label = document.createElement('span');
        label.textContent = tech.name;
        label.style.color = tech.color;
        inner.appendChild(label);
        h.appendChild(inner);
      } catch(e) {}
      bg.appendChild(h);
    }

    const hexes = bg.querySelectorAll('.lhex');
    function lightRandom() {
      const idx = Math.floor(Math.random() * hexes.length);
      hexes[idx].classList.add('lit');
      setTimeout(() => hexes[idx].classList.remove('lit'), 900 + Math.random() * 1200);
    }
    setInterval(lightRandom, 80);
    for (let i = 0; i < 18; i++) setTimeout(lightRandom, i * 40);
  })();
} catch(e) { console.warn('Hex bg error:', e); }

// ===== SPLASH SCREEN — HEX LOADING =====

(function(){
  var splash   = document.getElementById('loading-screen');
  var mainSite = document.getElementById('main-site');

  // ── Hex background canvas ─────────────────────────────────────────
  var canvas = document.getElementById('splash-canvas');
  var ctx    = canvas.getContext('2d');
  var W, H;

  function resize(){
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildHexes();
  }

  // Floating hex shapes matching screenshot
  var hexes = [];
  function buildHexes(){
    hexes = [];
    var sizes = [70,50,42,80,38,55,65,44,72,48,36,58];
    var positions = [
      [0.24,0.3],[0.26,0.58],[0.12,0.75],[0.38,0.13],[0.34,0.42],
      [0.44,0.58],[0.72,0.18],[0.85,0.15],[0.87,0.42],[0.88,0.82],
      [0.66,0.82],[0.52,0.08]
    ];
    positions.forEach(function(p, i){
      var s = sizes[i % sizes.length];
      hexes.push({
        x: p[0] * W, y: p[1] * H,
        size: s,
        vy: -0.12 - Math.random() * 0.1,
        vx: (Math.random() - 0.5) * 0.06,
        alpha: 0.06 + Math.random() * 0.1,
        baseAlpha: 0.06 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        originX: p[0] * W, originY: p[1] * H,
      });
    });
  }
  resize();
  window.addEventListener('resize', resize);

  function hexPath(cx, cy, r){
    ctx.beginPath();
    for(var i=0;i<6;i++){
      var a = Math.PI/180*(60*i - 30);
      var x = cx + r * Math.cos(a);
      var y = cy + r * Math.sin(a);
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.closePath();
  }

  var splashAnim;
  var frame = 0;
  function splashLoop(){
    frame++;
    ctx.clearRect(0,0,W,H);

    // Deep bg
    ctx.fillStyle = '#020c14';
    ctx.fillRect(0,0,W,H);

    // Subtle radial centre glow
    var g = ctx.createRadialGradient(W/2, H*0.42, 0, W/2, H*0.42, W*0.45);
    g.addColorStop(0,'rgba(0,40,50,0.55)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

    // Floating hexes
    hexes.forEach(function(h){
      h.y += h.vy; h.x += h.vx;
      h.phase += 0.008;
      var a = h.baseAlpha + Math.sin(h.phase) * 0.04;
      if(h.y + h.size < 0) { h.y = H + h.size; h.x = h.originX; }

      hexPath(h.x, h.y, h.size);
      ctx.fillStyle   = 'rgba(0,60,70,'+a.toFixed(3)+')';
      ctx.strokeStyle = 'rgba(0,245,255,'+(a*0.8).toFixed(3)+')';
      ctx.lineWidth = 1.2;
      ctx.fill(); ctx.stroke();

      // inner lighter hex
      hexPath(h.x, h.y, h.size * 0.55);
      ctx.fillStyle = 'rgba(0,90,100,'+(a*0.6).toFixed(3)+')';
      ctx.fill();
    });

    splashAnim = requestAnimationFrame(splashLoop);
  }
  splashLoop();

  // ── Arc ring progress animation ───────────────────────────────────
  var ringCanvas = document.getElementById('splash-ring-canvas');
  var rc = ringCanvas.getContext('2d');
  var pctEl   = document.getElementById('splash-pct-num');
  var statusEl = document.getElementById('splash-status');
  var barFill  = document.getElementById('splash-bar-fill');

  var CX = 80, CY = 80, R = 62;
  var currentPct = 0, targetPct = 0;
  var loadDone = false;

  var statusMessages = [
    'Initialising system...',
    'Loading cloud modules...',
    'Mounting enterprise credentials...',
    'Verifying network topology...',
    'Syncing Azure resources...',
    'Establishing secure session...',
    'Ready.'
  ];
  var statusIdx = 0;

  function drawRing(pct){
    rc.clearRect(0,0,160,160);

    // outer dim track circle
    rc.beginPath();
    rc.arc(CX, CY, R, 0, Math.PI*2);
    rc.strokeStyle = 'rgba(0,245,255,0.08)';
    rc.lineWidth = 1.5;
    rc.stroke();

    // inner dim track
    rc.beginPath();
    rc.arc(CX, CY, R - 12, 0, Math.PI*2);
    rc.strokeStyle = 'rgba(0,245,255,0.05)';
    rc.lineWidth = 1;
    rc.stroke();

    // arc progress
    var startA = -Math.PI / 2;
    var endA   = startA + (Math.PI * 2 * pct / 100);

    // glow shadow
    rc.save();
    rc.shadowBlur = 14;
    rc.shadowColor = 'rgba(0,245,255,0.9)';
    rc.beginPath();
    rc.arc(CX, CY, R, startA, endA);
    rc.strokeStyle = 'rgba(0,245,255,0.9)';
    rc.lineWidth = 2;
    rc.lineCap = 'round';
    rc.stroke();
    rc.restore();

    // tip dot
    if(pct > 0){
      var tipX = CX + R * Math.cos(endA);
      var tipY = CY + R * Math.sin(endA);
      rc.save();
      rc.shadowBlur = 16; rc.shadowColor = 'rgba(0,245,255,1)';
      rc.beginPath();
      rc.arc(tipX, tipY, 4, 0, Math.PI*2);
      rc.fillStyle = 'rgba(0,245,255,1)';
      rc.fill();
      rc.restore();
    }
  }
  drawRing(0);

  // Fake progress over ~3.5s then wait for click/scroll
  var loadStart = Date.now();
  var LOAD_DURATION = 3200;

  function loadTick(){
    if(loadDone) return;
    var elapsed = Date.now() - loadStart;
    var natural = Math.min(elapsed / LOAD_DURATION, 1);
    // ease-out so it slows near 100
    targetPct = Math.round(natural < 1
      ? (1 - Math.pow(1 - natural, 2.2)) * 98
      : 100);

    if(currentPct < targetPct){
      currentPct = Math.min(currentPct + 1.2, targetPct);
    }
    var display = Math.round(currentPct);
    pctEl.textContent = display;
    barFill.style.width = display + '%';
    drawRing(display);

    // cycle status messages
    var msgIdx = Math.floor((display / 100) * (statusMessages.length - 1));
    if(msgIdx !== statusIdx){
      statusIdx = msgIdx;
      statusEl.style.opacity = '0';
      setTimeout(function(){
        statusEl.textContent = statusMessages[statusIdx];
        statusEl.style.transition = 'opacity 0.35s ease';
        statusEl.style.opacity = '1';
      }, 150);
    }

    if(natural < 1 || currentPct < 100){
      setTimeout(loadTick, 25);
    } else {
      loadDone = true;
      // auto-enter after a brief pause at 100%
      setTimeout(function(){ doDive(); }, 400);
    }
  }
  setTimeout(loadTick, 900);

  // ── Auto transition at 100% ───────────────────────────────────────
  var diving = false;

  function doDive(){
    if(diving) return;
    diving = true;

    splash.style.transition = 'opacity 0.6s ease';
    splash.style.opacity = '0';

    setTimeout(function(){
      cancelAnimationFrame(splashAnim);
      splash.style.display = 'none';
      mainSite.style.display = 'block';
      mainSite.style.opacity = '0';
      mainSite.style.transform = 'translateY(20px)';
      mainSite.style.transition = 'none';
      void mainSite.offsetWidth;
      mainSite.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
      mainSite.style.opacity = '1';
      mainSite.style.transform = 'translateY(0)';
      initScrollAnimations();
    }, 600);
  }

})();