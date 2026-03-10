// ===== EDU JOURNEY ROAD ANIMATION — UNIFIED =====

(function(){
  var card = document.getElementById('ej-unified');
  if (!card) return;
  var cv   = card.querySelector('.ej-canvas');
  var wrap = card.querySelector('.ej-road-wrap');
  var ctx  = cv.getContext('2d');
  var playing = false;

  card.addEventListener('click', function() {
    if (playing) return;
    playing = true;
    card.classList.remove('played','arrived','midpoint');
    ctx.clearRect(0, 0, cv.width, cv.height);
    runJourney();
  });

  // ── Draw walker at given scale (1=teen, 2=adult) ──────────────
  function drawWalker(x, y, frame, alpha, scale) {
    ctx.save();
    ctx.globalAlpha = alpha;

    var swing  = Math.sin(frame * 0.36) * 0.42;
    var bounce = Math.abs(Math.sin(frame * 0.36)) * 2.2 * scale;
    var lean   = Math.sin(frame * 0.36) * 0.04;

    ctx.translate(x, y - bounce);
    ctx.scale(scale, scale);
    ctx.rotate(lean);

    var cyan     = 'rgba(0,245,255,1)';
    var cyanDim  = 'rgba(0,245,255,0.55)';
    var cyanFill = 'rgba(0,245,255,0.18)';
    var cyanMid  = 'rgba(0,245,255,0.38)';
    var white    = 'rgba(220,245,255,0.95)';
    var skin     = 'rgba(0,245,255,0.22)';

    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';

    function shape(fill, stroke, lw, fn) {
      ctx.save();
      ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw;
      ctx.shadowBlur = 7; ctx.shadowColor = cyan;
      ctx.beginPath(); fn(); ctx.fill(); ctx.stroke();
      ctx.restore();
    }

    // SHOES
    ctx.save(); ctx.translate(-4, 0); ctx.rotate(-swing * 0.85);
    shape(cyanMid, cyan, 1.2, function(){ ctx.ellipse(0, -2, 6, 3, 0.2, 0, Math.PI*2); });
    ctx.restore();
    ctx.save(); ctx.translate(4, 0); ctx.rotate(swing * 0.85);
    shape(cyanMid, cyan, 1.2, function(){ ctx.ellipse(0, -2, 6, 3, -0.2, 0, Math.PI*2); });
    ctx.restore();

    // LEGS
    ctx.save(); ctx.translate(-4, -2); ctx.rotate(-swing);
    shape(cyanFill, cyanDim, 2.2, function(){ ctx.roundRect(-3, -9, 6, 10, 2); });
    ctx.save(); ctx.translate(0, -9); ctx.rotate(swing * 1.15);
    shape(cyanFill, cyanDim, 2, function(){ ctx.roundRect(-2.5, -9, 5, 10, 2); });
    ctx.restore(); ctx.restore();
    ctx.save(); ctx.translate(4, -2); ctx.rotate(swing);
    shape(cyanFill, cyanDim, 2.2, function(){ ctx.roundRect(-3, -9, 6, 10, 2); });
    ctx.save(); ctx.translate(0, -9); ctx.rotate(-swing * 1.15);
    shape(cyanFill, cyanDim, 2, function(){ ctx.roundRect(-2.5, -9, 5, 10, 2); });
    ctx.restore(); ctx.restore();

    // HOODIE
    shape(cyanFill, cyan, 1.8, function(){
      ctx.moveTo(-7,-18); ctx.lineTo(7,-18);
      ctx.quadraticCurveTo(9,-18,9,-15); ctx.lineTo(6,-2);
      ctx.quadraticCurveTo(5,0,0,0); ctx.quadraticCurveTo(-5,0,-6,-2);
      ctx.lineTo(-9,-15); ctx.quadraticCurveTo(-9,-18,-7,-18); ctx.closePath();
    });
    ctx.save(); ctx.strokeStyle = cyanDim; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(-4,-8); ctx.lineTo(-4,-3); ctx.lineTo(4,-3); ctx.lineTo(4,-8); ctx.stroke();
    ctx.restore();

    // BACKPACK
    shape('rgba(0,245,255,0.1)', cyanDim, 1, function(){ ctx.roundRect(-13,-17,5,11,2); });
    ctx.save(); ctx.strokeStyle = cyanDim; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(-10,-17); ctx.quadraticCurveTo(-7,-20,-4,-17); ctx.stroke();
    ctx.restore();

    // ARMS
    ctx.save(); ctx.translate(-8,-16); ctx.rotate(swing * 0.75);
    shape(cyanFill, cyanDim, 2, function(){ ctx.roundRect(-2.5,0,5,8,2); });
    ctx.save(); ctx.translate(-1,8); ctx.rotate(-swing * 0.45);
    shape(cyanFill, cyanDim, 1.8, function(){ ctx.roundRect(-2,0,4,7,2); });
    ctx.restore(); ctx.restore();
    ctx.save(); ctx.translate(8,-16); ctx.rotate(-swing * 0.75);
    shape(cyanFill, cyanDim, 2, function(){ ctx.roundRect(-2.5,0,5,8,2); });
    ctx.save(); ctx.translate(1,8); ctx.rotate(swing * 0.45);
    shape(cyanFill, cyanDim, 1.8, function(){ ctx.roundRect(-2,0,4,7,2); });
    ctx.restore(); ctx.restore();

    // NECK
    shape(skin, cyanDim, 1, function(){ ctx.roundRect(-2.5,-22,5,5,1); });

    // HEAD
    shape(skin, cyan, 1.8, function(){ ctx.ellipse(0,-28,6.5,7.5,0,0,Math.PI*2); });
    ctx.save(); ctx.fillStyle = white; ctx.shadowBlur = 3; ctx.shadowColor = cyan;
    ctx.beginPath(); ctx.arc(2.2,-28,1.2,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.fillStyle = 'rgba(0,30,40,0.9)';
    ctx.beginPath(); ctx.arc(2.5,-28,0.5,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.save(); ctx.strokeStyle = cyanDim; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.arc(1,-26,2.5,0.2,Math.PI-0.2); ctx.stroke(); ctx.restore();

    // HAIR
    ctx.save(); ctx.fillStyle = 'rgba(0,245,255,0.48)';
    ctx.strokeStyle = cyan; ctx.lineWidth = 1; ctx.shadowBlur = 6; ctx.shadowColor = cyan;
    ctx.beginPath();
    ctx.moveTo(-6,-33); ctx.bezierCurveTo(-9,-39,3,-41,7,-36);
    ctx.bezierCurveTo(9,-34,7,-31,6,-31); ctx.bezierCurveTo(2,-33,-2,-33,-6,-33);
    ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();

    ctx.restore();
  }

  function runJourney() {
    var W = cv.width  = wrap.offsetWidth;
    var H = cv.height = wrap.offsetHeight;
    var cy      = H / 2;
    var groundY = cy + 18;

    // phases: 0→MID = teen (scale 1), pause at mid, MID→END = adult (scale 1.7)
    var ROAD_END  = W * 0.88;
    var MID_X     = W * 0.42;
    var PHASE1    = 80;   // frames teen → mid
    var PAUSE     = 28;   // frames pause + grow at mid
    var PHASE2    = 80;   // frames adult → end
    var TOTAL     = PHASE1 + PAUSE + PHASE2;

    var t = 0;
    var footsteps = [];
    var lastStepX = -99;
    var midReached = false;

    function easeInOut(x){ return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2; }

    function drawRoad(walkerX) {
      // dashed centre line
      ctx.save();
      ctx.setLineDash([16,9]); ctx.lineDashOffset = -t * 1.4;
      ctx.strokeStyle = 'rgba(0,245,255,0.1)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(ROAD_END,cy); ctx.stroke();
      ctx.restore();
      // edges
      ctx.save();
      ctx.strokeStyle = 'rgba(0,245,255,0.06)'; ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(0,cy-22); ctx.lineTo(ROAD_END,cy-22); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,cy+22); ctx.lineTo(ROAD_END,cy+22); ctx.stroke();
      ctx.restore();
      // glow trail
      var ts = Math.max(0, walkerX-120);
      var tg = ctx.createLinearGradient(ts,0,walkerX,0);
      tg.addColorStop(0,'rgba(0,245,255,0)');
      tg.addColorStop(1,'rgba(0,245,255,0.45)');
      ctx.save(); ctx.strokeStyle=tg; ctx.lineWidth=3;
      ctx.shadowBlur=14; ctx.shadowColor='rgba(0,245,255,0.8)';
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(ts,cy); ctx.lineTo(walkerX,cy); ctx.stroke(); ctx.restore();
    }

    function drawFootsteps(wx) {
      if (wx - lastStepX > 16) { footsteps.push({x:wx, life:1}); lastStepX = wx; }
      footsteps.forEach(function(f){ f.life -= 0.016; });
      footsteps = footsteps.filter(function(f){ return f.life>0; });
      footsteps.forEach(function(f){
        ctx.save(); ctx.globalAlpha = f.life * 0.6;
        ctx.fillStyle = 'rgba(0,245,255,0.5)'; ctx.shadowBlur=8; ctx.shadowColor='rgba(0,245,255,1)';
        ctx.beginPath(); ctx.ellipse(f.x-3, cy+18, 4, 2, 0, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(f.x+3, cy+21, 4, 2, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      });
    }

    // milestone: mid marker (BSc)
    function drawMidMarker(walkerX) {
      if (walkerX < MID_X - 10) return;
      var a = Math.min(1, (walkerX - MID_X + 10) / 20);
      ctx.save(); ctx.globalAlpha = a * 0.75;
      ctx.strokeStyle = 'rgba(0,245,255,0.6)'; ctx.lineWidth = 1; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(MID_X, cy-32); ctx.lineTo(MID_X, cy+32); ctx.stroke();
      ctx.restore();
    }

    // destination marker
    function drawDestMarker(walkerX) {
      var a = Math.min(1, Math.max(0, (walkerX - ROAD_END + 20)/20));
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a;
      ctx.beginPath(); ctx.arc(ROAD_END, cy, 9, 0, Math.PI*2);
      ctx.fillStyle='rgba(0,245,255,0.18)'; ctx.strokeStyle='rgba(0,245,255,0.9)'; ctx.lineWidth=1.5;
      ctx.shadowBlur=22; ctx.shadowColor='rgba(0,245,255,1)';
      ctx.fill(); ctx.stroke(); ctx.restore();
    }

    // growth burst particle ring at midpoint
    var burstDone = false;
    function drawGrowthBurst(cx2, cy2, progress) {
      if (burstDone) return;
      var rings = 3;
      for (var i=0; i<rings; i++) {
        var r = progress * 40 * (i * 0.4 + 0.5);
        var a = (1 - progress) * (0.6 - i * 0.15);
        if (a<=0) continue;
        ctx.save(); ctx.globalAlpha = a;
        ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(0,245,255,0.8)'; ctx.lineWidth = 1.5;
        ctx.shadowBlur=14; ctx.shadowColor='rgba(0,245,255,1)';
        ctx.stroke(); ctx.restore();
      }
      if (progress >= 1) burstDone = true;
    }

    function draw() {
      t++;
      ctx.clearRect(0, 0, W, H);

      var walkerX, walkerScale, walkerAlpha, frame;

      if (t <= PHASE1) {
        // Phase 1: teen walks left → mid
        var p1 = easeInOut(t / PHASE1);
        walkerX     = p1 * MID_X;
        walkerScale = 1.0;
        walkerAlpha = 1;
        frame       = t;
        drawRoad(walkerX);
        drawMidMarker(walkerX);
        drawFootsteps(walkerX);

      } else if (t <= PHASE1 + PAUSE) {
        // Phase 2: pause + grow burst at mid
        var pp = (t - PHASE1) / PAUSE;
        walkerX     = MID_X;
        walkerScale = 1.0 + pp * 0.7;  // teen→adult scale
        walkerAlpha = 1;
        frame       = t;

        if (!midReached) {
          midReached = true;
          card.classList.add('midpoint');
        }

        drawRoad(walkerX);
        drawMidMarker(walkerX);
        drawFootsteps(walkerX);
        drawGrowthBurst(walkerX, groundY - 20 * walkerScale, pp);

      } else {
        // Phase 3: adult walks mid → end
        var p3 = easeInOut((t - PHASE1 - PAUSE) / PHASE2);
        walkerX     = MID_X + p3 * (ROAD_END - MID_X);
        walkerScale = 1.7;
        // start fading walker only in the very last 8% so text appears first
        walkerAlpha = p3 > 0.94 ? 1 - (p3 - 0.94) / 0.06 : 1;
        frame       = t;

        // trigger arrived class early so destination fades in smoothly
        if (p3 >= 0.72 && !card.classList.contains('arrived')) {
          card.classList.add('arrived');
        }

        drawRoad(walkerX);
        drawMidMarker(walkerX);
        drawDestMarker(walkerX);
        drawFootsteps(walkerX);
      }

      // ground glow under feet
      ctx.save();
      ctx.globalAlpha = 0.28 * walkerAlpha;
      var fg = ctx.createRadialGradient(walkerX, cy+20, 0, walkerX, cy+20, 16*walkerScale);
      fg.addColorStop(0,'rgba(0,245,255,0.6)'); fg.addColorStop(1,'rgba(0,245,255,0)');
      ctx.beginPath(); ctx.ellipse(walkerX, cy+20, 16*walkerScale, 5, 0, 0, Math.PI*2);
      ctx.fillStyle = fg; ctx.fill(); ctx.restore();

      drawWalker(walkerX, groundY, frame, walkerAlpha, walkerScale);

      if (t < TOTAL) {
        requestAnimationFrame(draw);
      } else {
        playing = false;
      }
    }

    card.classList.add('played');
    requestAnimationFrame(draw);
  }
})();