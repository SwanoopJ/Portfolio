// ===== CERT SECTION PARTICLES =====

(function(){
  var canvas = document.getElementById('cert-particles');
  var section = document.getElementById('education');
  if (!canvas || !section) return;
  var ctx = canvas.getContext('2d');
  var W, H, particles = [];

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', function(){ resize(); init(); });

  var COLS = ['rgba(0,245,255,', 'rgba(120,90,255,', 'rgba(40,200,64,', 'rgba(100,160,255,'];

  function makeParticle() {
    return {
      x: Math.random()*W, y: Math.random()*H,
      r: 0.6 + Math.random()*2.2,
      vx:(Math.random()-0.5)*0.18,
      vy:(Math.random()-0.5)*0.18,
      col: COLS[Math.floor(Math.random()*COLS.length)],
      alpha: 0.1 + Math.random()*0.45,
      pulse: Math.random()*Math.PI*2,
      pulseSpeed: 0.008 + Math.random()*0.018,
      glowing: Math.random() < 0.25
    };
  }

  function init() {
    particles = [];
    var count = Math.floor((W*H)/5000);
    count = Math.max(40, Math.min(count, 160));
    for (var i=0; i<count; i++) particles.push(makeParticle());
  }
  init();

  // Connection lines between nearby particles
  function drawLines() {
    for (var i=0; i<particles.length; i++) {
      for (var j=i+1; j<particles.length; j++) {
        var dx=particles[i].x-particles[j].x;
        var dy=particles[i].y-particles[j].y;
        var dist=Math.sqrt(dx*dx+dy*dy);
        if (dist<90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          var la=(1-dist/90)*0.08;
          ctx.strokeStyle='rgba(0,200,255,'+la+')';
          ctx.lineWidth=0.4; ctx.stroke();
        }
      }
    }
  }

  function draw() {
    requestAnimationFrame(draw);
    var rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    ctx.clearRect(0,0,W,H);

    drawLines();

    particles.forEach(function(p) {
      p.x += p.vx; p.y += p.vy;
      p.pulse += p.pulseSpeed;
      if (p.x<0) p.x=W; if (p.x>W) p.x=0;
      if (p.y<0) p.y=H; if (p.y>H) p.y=0;

      var pa = p.alpha * (0.6 + Math.sin(p.pulse)*0.4);

      if (p.glowing) {
        // Glow orb
        var gr = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
        gr.addColorStop(0, p.col+(pa*0.9)+')');
        gr.addColorStop(0.4, p.col+(pa*0.3)+')');
        gr.addColorStop(1, p.col+'0)');
        ctx.fillStyle=gr;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2); ctx.fill();
      }

      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.col+pa+')'; ctx.fill();
    });
  }
  draw();
})();