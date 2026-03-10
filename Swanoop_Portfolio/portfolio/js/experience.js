// ===== EXP JOURNEY BRANCH TREE ANIMATION =====

(function(){
  document.querySelectorAll('.exp-journey').forEach(function(journey) {
    var r        = journey.getAttribute('data-color') || '0,245,255';
    var trigger  = journey.querySelector('.exj-trigger');
    var wrap     = journey.querySelector('.exj-branch-wrap');
    var cv       = journey.querySelector('.exj-canvas');
    var nodes    = Array.from(journey.querySelectorAll('.exj-node'));
    var ctx      = cv.getContext('2d');
    var open     = false;
    var animId, loopId;

    trigger.addEventListener('click', function() {
      if (!open) {
        open = true;
        journey.classList.add('open', 'played');
        nodes.forEach(function(n){ n.classList.remove('visible'); n.classList.remove('orb-lit'); });
        ctx.clearRect(0, 0, cv.width, cv.height);
        cancelAnimationFrame(animId);
        clearInterval(loopId);
        // wait for max-height transition to fully expand before measuring
        setTimeout(runBranch, 750);
      } else {
        open = false;
        journey.classList.remove('open');
        cancelAnimationFrame(animId);
        clearInterval(loopId);
        nodes.forEach(function(n){ n.classList.remove('visible'); n.classList.remove('orb-lit'); });
        setTimeout(function(){ ctx.clearRect(0, 0, cv.width, cv.height); }, 700);
      }
    });

    function runBranch() {
      // Size canvas to the inner nodes container — not the clipped wrap
      var nodesDiv = journey.querySelector('.exj-branch-nodes');
      cv.width  = wrap.offsetWidth;
      cv.height = nodesDiv.offsetHeight;
      var W = cv.width, H = cv.height;
      var cx = W / 2;

      // Collect per-node geometry AFTER they exist in layout
      // Each node's vertical mid-point relative to the wrap
      var wrapRect = wrap.getBoundingClientRect();
      var nodeData = nodes.map(function(nd) {
        var nr   = nd.getBoundingClientRect();
        var midY = nr.top - wrapRect.top + nr.height / 2;
        var side = nd.getAttribute('data-side');
        // branch endpoint x: tip of branch reaching toward node
        var tipX = side === 'left' ? nr.right - wrapRect.left + 10
                                   : nr.left  - wrapRect.left - 10;
        return { midY: midY, tipX: tipX, side: side, el: nd, revealed: false };
      });

      var TRUNK_TOP  = 10;
      var TRUNK_BOT  = H - 10;
      var TRUNK_SPAN = TRUNK_BOT - TRUNK_TOP;

      // Cursor travels from top → bottom over FRAMES frames
      var FRAMES = 120;
      var t = 0;

      // static dim trunk (drawn once as base)
      function drawStaticTrunk() {
        ctx.save();
        ctx.strokeStyle = 'rgba(' + r + ',0.07)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath(); ctx.moveTo(cx, TRUNK_TOP); ctx.lineTo(cx, TRUNK_BOT); ctx.stroke();
        ctx.restore();
      }

      function easeInOut(x){ return x<0.5 ? 2*x*x : 1-Math.pow(-2*x+2,2)/2; }

      function draw() {
        t++;
        var p      = easeInOut(Math.min(t / FRAMES, 1));
        var curY   = TRUNK_TOP + TRUNK_SPAN * p;

        ctx.clearRect(0, 0, W, H);
        drawStaticTrunk();

        // ── glowing trunk trail ──
        var trailLen = 80;
        var trailTop = Math.max(TRUNK_TOP, curY - trailLen);
        var tg = ctx.createLinearGradient(0, trailTop, 0, curY);
        tg.addColorStop(0, 'rgba(' + r + ',0)');
        tg.addColorStop(1, 'rgba(' + r + ',0.9)');
        ctx.save();
        ctx.strokeStyle = tg;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(' + r + ',1)';
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(cx, trailTop); ctx.lineTo(cx, curY); ctx.stroke();
        ctx.restore();

        // ── branches already passed ──
        nodeData.forEach(function(nd) {
          if (curY < nd.midY - 8) return;
          var bAlpha = Math.min(1, (curY - nd.midY + 8) / 18);

          // branch line: cx → tipX at nd.midY (smooth curve)
          ctx.save();
          ctx.globalAlpha = bAlpha;
          ctx.strokeStyle = 'rgba(' + r + ',0.75)';
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(' + r + ',1)';
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(cx, nd.midY);
          // bezier for natural branch curve
          var cp1x = cx + (nd.tipX - cx) * 0.35;
          var cp2x = cx + (nd.tipX - cx) * 0.65;
          ctx.bezierCurveTo(cp1x, nd.midY, cp2x, nd.midY, nd.tipX, nd.midY);
          ctx.stroke();

          // leaf dot at branch tip
          ctx.beginPath();
          ctx.arc(nd.tipX, nd.midY, 3.5, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(' + r + ',0.3)';
          ctx.strokeStyle = 'rgba(' + r + ',0.9)';
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 12;
          ctx.fill(); ctx.stroke();
          ctx.restore();

          // reveal DOM node
          if (!nd.revealed) {
            nd.revealed = true;
            nd.el.classList.add('visible');
          }
        });

        // ── cursor dot on trunk ──
        var pulse = 5 + Math.sin(t * 0.35) * 1.5;
        ctx.save();
        // outer glow ring
        ctx.beginPath();
        ctx.arc(cx, curY, pulse * 2, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(' + r + ',0.1)';
        ctx.shadowBlur = 20; ctx.shadowColor = 'rgba(' + r + ',1)';
        ctx.fill();
        // core dot
        ctx.beginPath();
        ctx.arc(cx, curY, pulse * 0.6, 0, Math.PI*2);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 14; ctx.shadowColor = 'rgba(' + r + ',1)';
        ctx.fill();
        ctx.restore();

        if (t < FRAMES) {
          animId = requestAnimationFrame(draw);
        } else {
          // idle glow + travelling pulse after complete
          startIdleGlow();
        }
      }

      animId = requestAnimationFrame(draw);

      // smooth back-and-forth glow pulse after animation finishes
      function startIdleGlow() {
        var it = 0;
        var pulsePos = 0;   // 0 = top of trunk, 1 = bottom
        var pulseDir = 1;   // 1 = travelling down, -1 = travelling up
        var SPEED    = 0.007;

        loopId = setInterval(function(){
          it++;
          ctx.clearRect(0, 0, W, H);
          drawStaticTrunk();

          // ── static dim branches ──
          nodeData.forEach(function(nd) {
            var a = 0.3 + Math.sin(it * 0.03 + nd.midY * 0.007) * 0.1;
            ctx.save();
            ctx.globalAlpha = a;
            ctx.strokeStyle = 'rgba(' + r + ',0.65)';
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 5; ctx.shadowColor = 'rgba(' + r + ',1)';
            ctx.beginPath();
            ctx.moveTo(cx, nd.midY);
            var cp1x = cx + (nd.tipX - cx) * 0.35;
            var cp2x = cx + (nd.tipX - cx) * 0.65;
            ctx.bezierCurveTo(cp1x, nd.midY, cp2x, nd.midY, nd.tipX, nd.midY);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(nd.tipX, nd.midY, 3.5, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(' + r + ',0.18)';
            ctx.strokeStyle = 'rgba(' + r + ',0.75)';
            ctx.lineWidth = 1.2; ctx.shadowBlur = 7;
            ctx.fill(); ctx.stroke();
            ctx.restore();
          });

          // ── base trunk glow ──
          var tg = ctx.createLinearGradient(0, TRUNK_TOP, 0, TRUNK_BOT);
          tg.addColorStop(0,   'rgba(' + r + ',0.03)');
          tg.addColorStop(0.5, 'rgba(' + r + ',' + (0.18 + Math.sin(it*0.04)*0.07) + ')');
          tg.addColorStop(1,   'rgba(' + r + ',0.03)');
          ctx.save();
          ctx.strokeStyle = tg; ctx.lineWidth = 2;
          ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(' + r + ',0.7)';
          ctx.beginPath(); ctx.moveTo(cx, TRUNK_TOP); ctx.lineTo(cx, TRUNK_BOT); ctx.stroke();
          ctx.restore();

          // ── advance pulse ──
          pulsePos += SPEED * pulseDir;
          if (pulsePos >= 1) { pulsePos = 1; pulseDir = -1; }
          if (pulsePos <= 0) { pulsePos = 0; pulseDir =  1; }
          var pulseY = TRUNK_TOP + TRUNK_SPAN * pulsePos;

          // ── tail streak behind orb ──
          var TAIL = 60;
          var t0 = pulseDir === 1 ? Math.max(TRUNK_TOP, pulseY - TAIL) : pulseY;
          var t1 = pulseDir === 1 ? pulseY : Math.min(TRUNK_BOT, pulseY + TAIL);
          var tailG = ctx.createLinearGradient(0, t0, 0, t1);
          if (pulseDir === 1) {
            tailG.addColorStop(0, 'rgba(' + r + ',0)');
            tailG.addColorStop(1, 'rgba(' + r + ',0.65)');
          } else {
            tailG.addColorStop(0, 'rgba(' + r + ',0.65)');
            tailG.addColorStop(1, 'rgba(' + r + ',0)');
          }
          ctx.save();
          ctx.strokeStyle = tailG; ctx.lineWidth = 3;
          ctx.shadowBlur = 18; ctx.shadowColor = 'rgba(' + r + ',1)';
          ctx.beginPath(); ctx.moveTo(cx, t0); ctx.lineTo(cx, t1); ctx.stroke();
          ctx.restore();

          // ── glowing orb on trunk ──
          var orbR = 13;
          var og = ctx.createRadialGradient(cx, pulseY, 0, cx, pulseY, orbR);
          og.addColorStop(0,    'rgba(255,255,255,1)');
          og.addColorStop(0.3,  'rgba(' + r + ',0.85)');
          og.addColorStop(1,    'rgba(' + r + ',0)');
          ctx.save();
          ctx.beginPath(); ctx.arc(cx, pulseY, orbR, 0, Math.PI*2);
          ctx.fillStyle = og;
          ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(' + r + ',1)';
          ctx.fill();
          ctx.restore();

          // ── light up each branch as orb passes ──
          // clear all orb-lit classes first
          nodeData.forEach(function(nd) { nd.el.classList.remove('orb-lit'); });

          nodeData.forEach(function(nd) {
            var dist = Math.abs(pulseY - nd.midY);
            if (dist > 50) return;
            var intensity = 1 - dist / 50;

            // mark tile as orb-lit for CSS boost
            nd.el.classList.add('orb-lit');

            // bright branch
            ctx.save();
            ctx.globalAlpha = intensity * 0.88;
            ctx.strokeStyle = 'rgba(255,255,255,0.65)';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 22; ctx.shadowColor = 'rgba(' + r + ',1)';
            ctx.beginPath();
            ctx.moveTo(cx, nd.midY);
            var cp1x = cx + (nd.tipX - cx) * 0.35;
            var cp2x = cx + (nd.tipX - cx) * 0.65;
            ctx.bezierCurveTo(cp1x, nd.midY, cp2x, nd.midY, nd.tipX, nd.midY);
            ctx.stroke();
            ctx.restore();

            // bright tip dot
            ctx.save();
            ctx.globalAlpha = intensity * 0.9;
            var tipR = 4 + intensity * 4;
            var tg2 = ctx.createRadialGradient(nd.tipX, nd.midY, 0, nd.tipX, nd.midY, tipR);
            tg2.addColorStop(0,   'rgba(255,255,255,1)');
            tg2.addColorStop(0.4, 'rgba(' + r + ',0.8)');
            tg2.addColorStop(1,   'rgba(' + r + ',0)');
            ctx.beginPath(); ctx.arc(nd.tipX, nd.midY, tipR, 0, Math.PI*2);
            ctx.fillStyle = tg2;
            ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(' + r + ',1)';
            ctx.fill();
            ctx.restore();
          });

        }, 24);
      }
    }
  });
})();