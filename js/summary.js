// ===== SUMMARY SECTION BACKGROUND =====

(function(){
  var cv = document.getElementById('summary-bg-canvas');
  var section = document.getElementById('summary');
  if (!cv || !section) return;
  var ctx = cv.getContext('2d');
  var W, H, t = 0;

  function resize(){
    W = cv.width  = section.offsetWidth;
    H = cv.height = section.offsetHeight;
  }
  resize();
  window.addEventListener('resize', function(){ resize(); buildCodeLines(); buildBinaryColumns(); });

  // ── Plexus network nodes ──────────────────────────────
  var NODE_COUNT = 52;
  var nodes = [];
  function makeNode(){
    return {
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*0.22,
      vy: (Math.random()-0.5)*0.18,
      r: 1.8 + Math.random()*2.8,
      cluster: Math.random()<0.45 ? 'cyan' : Math.random()<0.55 ? 'red' : 'blue',
      pulse: Math.random()*Math.PI*2,
    };
  }
  for(var i=0;i<NODE_COUNT;i++) nodes.push(makeNode());
  var CONNECT_DIST = 170;

  // ── Floating code fragments (drift upward like reference) ─
  var codeSnippets = [
    'mirror_mod.use_x = True',
    'elif _operation == "MIRROR_Z":',
    '  mirror_mod.use_y = False',
    'modifier_ob.select = 1',
    'bpy.context.scene.objects.active = modifier_ob',
    'print("Selected" + str(modifier_ob))',
    'zero_trust_policy.enforce()',
    'azure.connect(tenant_id=env.TENANT)',
    'vlan.tag(id=20, trunk=True)',
    'fw_rule.apply(src="10.0.0.0/8")',
    'ad.sync(delta=True, scope="OU=Corp")',
    'k8s.deploy(namespace="prod")',
    'terraform.apply(auto_approve=True)',
    'ssl_cert.renew(days=365)',
    'nsg.add_rule(priority=100)',
    'if modifier_ob is not None:',
    '  modifier_ob.select = -0',
    '#selection at the end — add back deselected',
    'ipsec.establish(peer=vpn_gw, mode="tunnel")',
  ];

  var codeLines = [];
  function buildCodeLines(){
    codeLines = [];
    for(var i=0;i<22;i++){
      codeLines.push({
        text: codeSnippets[i % codeSnippets.length],
        x: W*0.05 + Math.random()*(W*0.55),
        y: Math.random()*H,
        vy: 0.18 + Math.random()*0.22,
        alpha: 0.07 + Math.random()*0.13,
        size: 9 + Math.random()*4,
        color: Math.random()<0.5 ? 'cyan' : Math.random()<0.5 ? 'orange' : 'white',
        highlighted: Math.random() < 0.18,
      });
    }
  }
  buildCodeLines();

  // ── Binary columns on left (like reference) ──────────
  var binCols = [];
  function buildBinaryColumns(){
    binCols = [];
    var cols = Math.floor(W*0.12 / 14);
    for(var i=0;i<cols;i++){
      binCols.push({
        x: 8 + i*14,
        y: Math.random()*H,
        speed: 0.5 + Math.random()*1.2,
        chars: Array.from({length:28},function(){ return Math.random()<0.5?'1':'0'; }),
        alpha: 0.06 + Math.random()*0.1,
      });
    }
  }
  buildBinaryColumns();

  // ── Color helpers ─────────────────────────────────────
  function nodeColor(n, a){
    if(n.cluster==='cyan') return 'rgba(0,220,255,'+a+')';
    if(n.cluster==='red')  return 'rgba(255,50,80,'+a+')';
    return 'rgba(50,110,255,'+a+')';
  }
  function lineColor(n1,n2,a){
    if(n1.cluster===n2.cluster) return nodeColor(n1,a);
    if((n1.cluster==='cyan'&&n2.cluster==='red')||(n1.cluster==='red'&&n2.cluster==='cyan'))
      return 'rgba(180,80,200,'+a+')';
    return 'rgba(100,180,255,'+a+')';
  }

  // ── Render ─────────────────────────────────────────────
  function draw(){
    requestAnimationFrame(draw);
    var rect = section.getBoundingClientRect();
    if(rect.top > window.innerHeight*1.2 || rect.bottom < -100) return;
    t++;
    ctx.clearRect(0,0,W,H);

    // Base — near black deep navy
    ctx.fillStyle='#010306'; ctx.fillRect(0,0,W,H);

    // Left zone: deep blue (server rack / code region)
    var lg=ctx.createRadialGradient(W*0.12,H*0.35,0,W*0.12,H*0.35,W*0.5);
    lg.addColorStop(0,'rgba(0,30,130,0.55)');
    lg.addColorStop(0.5,'rgba(0,20,80,0.2)');
    lg.addColorStop(1,'transparent');
    ctx.fillStyle=lg; ctx.fillRect(0,0,W,H);

    // Right zone: red/magenta plexus region
    var rg=ctx.createRadialGradient(W*0.82,H*0.6,0,W*0.82,H*0.6,W*0.42);
    rg.addColorStop(0,'rgba(200,0,60,0.3)');
    rg.addColorStop(0.6,'rgba(120,0,40,0.1)');
    rg.addColorStop(1,'transparent');
    ctx.fillStyle=rg; ctx.fillRect(0,0,W,H);

    // Center-right cyan plexus glow
    var cg=ctx.createRadialGradient(W*0.6,H*0.55,0,W*0.6,H*0.55,W*0.38);
    cg.addColorStop(0,'rgba(0,160,220,0.14)');
    cg.addColorStop(1,'transparent');
    ctx.fillStyle=cg; ctx.fillRect(0,0,W,H);

    // ── Binary columns ────────────────────────────────
    ctx.save();
    ctx.font='bold 11px "Courier New",monospace';
    binCols.forEach(function(bc){
      bc.y += bc.speed;
      if(bc.y > H+20) { bc.y=-20; bc.chars=bc.chars.map(function(){return Math.random()<0.5?'1':'0';}); }
      bc.chars.forEach(function(ch,ci){
        var cy=bc.y - ci*13;
        if(cy<-10||cy>H+10) return;
        var fade = 1 - Math.abs(ci/bc.chars.length - 0.5)*2;
        ctx.fillStyle='rgba(0,200,80,'+(bc.alpha*fade)+')';
        ctx.fillText(ch, bc.x, cy);
      });
    });
    ctx.restore();

    // ── Plexus connection lines ───────────────────────
    for(var i=0;i<nodes.length;i++){
      for(var j=i+1;j<nodes.length;j++){
        var dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
        var d=Math.sqrt(dx*dx+dy*dy);
        if(d<CONNECT_DIST){
          var a=(1-d/CONNECT_DIST)*0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x,nodes[i].y);
          ctx.lineTo(nodes[j].x,nodes[j].y);
          ctx.strokeStyle=lineColor(nodes[i],nodes[j],a);
          ctx.lineWidth=0.8; ctx.stroke();
        }
      }
    }

    // ── Plexus nodes ──────────────────────────────────
    nodes.forEach(function(n){
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
      n.pulse+=0.025;
      var pulse=0.55+Math.sin(n.pulse)*0.38;
      var grd=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*5.5);
      grd.addColorStop(0,nodeColor(n,0.35*pulse));
      grd.addColorStop(1,'transparent');
      ctx.fillStyle=grd;
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r*5.5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(n.x,n.y,n.r*pulse,0,Math.PI*2);
      ctx.fillStyle=nodeColor(n,0.9);
      ctx.shadowColor=nodeColor(n,1); ctx.shadowBlur=12;
      ctx.fill(); ctx.shadowBlur=0;
    });

    // ── Floating code fragments ───────────────────────
    ctx.save();
    codeLines.forEach(function(cl){
      cl.y -= cl.vy;
      if(cl.y < -20){
        cl.y=H+20; cl.x=W*0.02+Math.random()*(W*0.58);
        cl.text=codeSnippets[Math.floor(Math.random()*codeSnippets.length)];
        cl.highlighted=Math.random()<0.18;
      }
      // highlighted lines get a background tint like in reference
      if(cl.highlighted){
        ctx.fillStyle=cl.color==='cyan'?'rgba(0,100,160,0.18)':'rgba(160,60,0,0.15)';
        ctx.fillRect(cl.x-4, cl.y-cl.size, ctx.measureText(cl.text).width+8, cl.size+4);
      }
      var col = cl.color==='cyan'   ? 'rgba(80,200,255,'+cl.alpha*1.4+')'
              : cl.color==='orange' ? 'rgba(255,160,40,'+cl.alpha*1.3+')'
              : 'rgba(200,220,255,'+cl.alpha+')';
      ctx.font=cl.size+'px "Courier New",monospace';
      ctx.fillStyle=col;
      ctx.fillText(cl.text, cl.x, cl.y);
    });
    ctx.restore();
  }
  draw();
})();

// ── Laptop centre particles ──────────────────────────────────────────
(function(){
  var cv = document.getElementById('laptop-particle-canvas');
  if (!cv) return;
  var wrap = cv.parentElement;
  var ctx = cv.getContext('2d');
  var W, H, particles = [];

  function resize() {
    W = cv.width  = wrap.offsetWidth;
    H = cv.height = wrap.offsetHeight;
  }

  function Particle() { this.reset(); }
  Particle.prototype.reset = function() {
    var angle = Math.random() * Math.PI * 2;
    var dist  = 20 + Math.random() * 35;
    this.x  = W/2 + Math.cos(angle) * dist;
    this.y  = H/2 + Math.sin(angle) * dist;
    var speed = 0.4 + Math.random() * 1.2;
    this.vx = Math.cos(angle) * speed + (Math.random()-0.5)*0.3;
    this.vy = Math.sin(angle) * speed + (Math.random()-0.5)*0.3;
    this.life = 0;
    this.maxLife = 90 + Math.random() * 110;
    this.r = 1.2 + Math.random() * 2.0;
    this.type = Math.random() > 0.55 ? 'dot' : 'line';
    this.lineLen = 5 + Math.random() * 14;
    var roll = Math.random();
    this.color = roll > 0.78 ? '255,255,255' : roll > 0.90 ? '255,140,60' : '0,245,255';
  };
  Particle.prototype.update = function() {
    this.x += this.vx; this.y += this.vy;
    var dx = this.x - W/2, dy = this.y - H/2;
    var d = Math.sqrt(dx*dx + dy*dy) || 1;
    this.vx += (dx/d) * 0.013;
    this.vy += (dy/d) * 0.013;
    this.life++;
  };
  Particle.prototype.draw = function() {
    var p = this.life / this.maxLife;
    var alpha = p < 0.15 ? p/0.15 : 1-(p-0.15)/0.85;
    alpha = Math.max(0, alpha) * 0.78;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (this.type === 'dot') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r*(1-p*0.4), 0, Math.PI*2);
      ctx.fillStyle = 'rgba('+this.color+',1)';
      ctx.shadowBlur = this.r*7; ctx.shadowColor = 'rgba('+this.color+',0.9)';
      ctx.fill();
    } else {
      var spd = Math.sqrt(this.vx*this.vx+this.vy*this.vy)||1;
      var nx = this.vx/spd, ny = this.vy/spd;
      ctx.beginPath();
      ctx.moveTo(this.x-nx*this.lineLen*0.5, this.y-ny*this.lineLen*0.5);
      ctx.lineTo(this.x+nx*this.lineLen*0.5, this.y+ny*this.lineLen*0.5);
      ctx.strokeStyle = 'rgba('+this.color+',1)';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 7; ctx.shadowColor = 'rgba('+this.color+',0.9)';
      ctx.stroke();
    }
    ctx.restore();
  };

  for (var i = 0; i < 60; i++) {
    var pt = new Particle();
    pt.life = Math.floor(Math.random() * pt.maxLife);
    particles.push(pt);
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function(p){ p.update(); p.draw(); if(p.life>=p.maxLife) p.reset(); });
    requestAnimationFrame(tick);
  }

  var obs = new IntersectionObserver(function(entries){
    if (entries[0].isIntersecting) {
      obs.disconnect(); resize();
      window.addEventListener('resize', resize);
      tick();
    }
  }, { threshold: 0.1 });
  obs.observe(document.getElementById('summary'));
})();

// ── Status panel uptime counter ─────────────────────────────────────
(function(){
  var el = document.getElementById('sp-uptime');
  if (!el) return;
  var start = Date.now();
  function pad(n){ return String(n).padStart(2,'0'); }
  function tick(){
    var s = Math.floor((Date.now() - start) / 1000);
    var h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    el.textContent = pad(h)+':'+pad(m)+':'+pad(sec);
    requestAnimationFrame(tick);
  }
  tick();
})();

// ===== SCROLLING LOG PANEL =====

(function(){
  const lines = [
    { ts:'08:14:02', lvl:'ok',    msg:'<span class="hl-g">Booted</span> swanoop.portfolio <span class="hl">v3.0</span>' },
    { ts:'08:14:03', lvl:'info',  msg:'Loaded module <span class="hl">AWS :: CloudArchitect</span>' },
    { ts:'08:14:03', lvl:'trace', msg:'Connecting to Azure AD tenant …' },
    { ts:'08:14:04', lvl:'ok',    msg:'Auth handshake <span class="hl-g">success</span> — IAM policy attached' },
    { ts:'08:14:05', lvl:'info',  msg:'Injecting <span class="hl">Terraform</span> plan — 42 resources queued' },
    { ts:'08:14:06', lvl:'trace', msg:'Running <span class="hl">ansible-playbook</span> site.yml …' },
    { ts:'08:14:07', lvl:'ok',    msg:'Kubernetes cluster <span class="hl-g">HEALTHY</span> — 12/12 nodes ready' },
    { ts:'08:14:08', lvl:'warn',  msg:'<span class="hl-o">Latency spike</span> detected on us-east-1 — auto-scaling triggered' },
    { ts:'08:14:09', lvl:'ok',    msg:'Scale-out <span class="hl-g">complete</span> — 3 new pods online' },
    { ts:'08:14:10', lvl:'info',  msg:'CI/CD pipeline <span class="hl">stage:deploy</span> — pushing to prod' },
    { ts:'08:14:11', lvl:'ok',    msg:'Docker image <span class="hl-g">pushed</span> → ecr.amazonaws.com/swanoop:latest' },
    { ts:'08:14:12', lvl:'trace', msg:'Syncing <span class="hl">S3</span> bucket … 1,204 objects updated' },
    { ts:'08:14:13', lvl:'info',  msg:'CloudFront cache invalidated — TTL reset to <span class="hl">86400s</span>' },
    { ts:'08:14:14', lvl:'ok',    msg:'SSL certificate <span class="hl-g">renewed</span> — expires 2026-03-05' },
    { ts:'08:14:15', lvl:'trace', msg:'Polling <span class="hl">Prometheus</span> metrics endpoint …' },
    { ts:'08:14:16', lvl:'ok',    msg:'All health checks <span class="hl-g">passed</span> — 99.97% uptime recorded' },
    { ts:'08:14:17', lvl:'info',  msg:'Backup job <span class="hl">snapshot-daily</span> scheduled — next: 23:00 UTC' },
    { ts:'08:14:18', lvl:'warn',  msg:'<span class="hl-o">Disk usage</span> at 81% on /dev/sda1 — alert threshold 85%' },
    { ts:'08:14:19', lvl:'ok',    msg:'Log rotation <span class="hl-g">complete</span> — 2.3 GB archived to Glacier' },
    { ts:'08:14:20', lvl:'info',  msg:'VPN tunnel <span class="hl">site-to-site</span> re-keyed successfully' },
    { ts:'08:14:21', lvl:'trace', msg:'Fetching <span class="hl">Grafana</span> dashboard snapshot …' },
    { ts:'08:14:22', lvl:'ok',    msg:'Firewall rules <span class="hl-g">applied</span> — 0 policy violations' },
    { ts:'08:14:23', lvl:'info',  msg:'New <span class="hl">SSO</span> token issued — expires in 8h' },
    { ts:'08:14:24', lvl:'trace', msg:'Running unit tests … <span class="hl-g">148/148 passed</span>' },
    { ts:'08:14:25', lvl:'ok',    msg:'Deployment <span class="hl-g">successful</span> — zero downtime rollout complete' },
  ];

  function makeLine(l) {
    return `<div class="log-line">
      <span class="log-ts">[${l.ts}]</span>
      <span class="log-lvl ${l.lvl}">${l.lvl.toUpperCase()}</span>
      <span class="log-msg">${l.msg}</span>
    </div>`;
  }

  const track = document.getElementById('log-track');
  if (track) {
    // duplicate for seamless loop
    const html = lines.map(makeLine).join('') + lines.map(makeLine).join('');
    track.innerHTML = html;
  }
})();

// ===== CMD TERMINAL TYPEWRITER =====

(function() {
  var lines = [
    { type:'cmd', text:'whoami' },
    { type:'output', text:'swanoop.john — Senior Cloud & Systems Architect', cls:'highlight' },
    { type:'blank' },
    { type:'cmd', text:'cat profile.txt' },
    { type:'output', text:'Senior Cloud, Systems & Network Administrator with 12+ years of experience' },
    { type:'output', text:'architecting, securing, and modernizing enterprise IT environments.' },
    { type:'output', text:'Expertise in Windows Server 2016-2025, hybrid cloud (Azure & AWS),' },
    { type:'output', text:'Microsoft 365, Intune, advanced networking, and enterprise security.' },
    { type:'output', text:'Strong Level 3 escalation background in network infrastructure,' },
    { type:'output', text:'identity federation (SSO/SAML), Zero Trust implementation,' },
    { type:'output', text:'and high-availability architecture.' },
    { type:'blank' },
    { type:'cmd', text:'./connect --hire swanoop', cursor:true },
  ];

  function prompt() {
    return '<span class="cmd-prompt-user">swanoop</span><span class="cmd-prompt-sym">@</span><span class="cmd-prompt-host">portfolio</span><span class="cmd-prompt-sym">:</span><span class="cmd-prompt-path">~/about</span><span class="cmd-prompt-sym">$</span> ';
  }

  function typewriterLine(el, text, cb) {
    var i=0, cmd=el.querySelector('.cmd-command'), cursor=el.querySelector('.cmd-cursor');
    function tick(){ cmd.textContent=text.slice(0,i); if(i<=text.length){i++;setTimeout(tick,36+Math.random()*26);} else{if(cursor)cursor.style.display='none';if(cb)cb();} }
    tick();
  }

  function renderLines() {
    var body=document.getElementById('cmd-body'); if(!body) return;
    body.innerHTML=''; var delay=200;
    lines.forEach(function(line,idx){
      var isLast=idx===lines.length-1;
      if(line.type==='blank'){var sp=document.createElement('div');sp.style.height='8px';body.appendChild(sp);return;}
      var el=document.createElement('div'); el.className='cmd-line';
      if(line.type==='cmd'){
        el.innerHTML=prompt()+'<span class="cmd-command"></span>'+(isLast?'<span class="cmd-cursor"></span>':'');
        body.appendChild(el);
        setTimeout(function(){ el.classList.add('visible'); typewriterLine(el,line.text,function(){ if(isLast){var c=el.querySelector('.cmd-cursor');if(c)c.style.display='inline-block';} }); },delay);
        delay+=line.text.length*40+480;
      } else if(line.type==='output'){
        el.innerHTML='<span class="cmd-output '+(line.cls||'')+'">'+line.text+'</span>';
        body.appendChild(el); setTimeout(function(){ el.classList.add('visible'); },delay); delay+=75;
      }
    });
  }

  var overlay=document.getElementById('cmd-overlay'), trigger=document.getElementById('laptop-trigger');
  var closeBtn=document.getElementById('cmd-close-btn'), closeDot=document.getElementById('cmd-close-dot');
  var played=false;

  function openModal(){ overlay.classList.add('open'); if(!played){played=true;setTimeout(renderLines,280);} }
  function closeModal(){ overlay.classList.remove('open'); }
  if(trigger)  trigger.addEventListener('click', openModal);
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(closeDot) closeDot.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });
})();