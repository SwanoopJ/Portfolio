// ===== GHOST CARD =====

(function(){
  var zone  = document.getElementById('ghost-zone');
  var card  = document.getElementById('ghost-card');
  if (!zone || !card) return;

  var scan   = document.getElementById('ghost-card-scan');
  var icon   = document.getElementById('ghost-card-icon');
  var name   = document.getElementById('ghost-card-name');
  var detail = document.getElementById('ghost-card-detail');

  var cards = [
    { icon:'☁️',  name:'Azure',        detail:'IaaS · PaaS · Entra ID',  color:'0,210,255',  glow:'rgba(0,210,255,0.18)' },
    { icon:'🛡️',  name:'Zero Trust',   detail:'IAM · MFA · RBAC · PKI',  color:'180,80,255', glow:'rgba(180,80,255,0.18)' },
    { icon:'🌐',  name:'Networking',   detail:'BGP · SD-WAN · VLANs',    color:'0,245,180',  glow:'rgba(0,245,180,0.18)' },
    { icon:'🔒',  name:'Security',     detail:'SIEM · IDS/IPS · NSG',    color:'255,80,120', glow:'rgba(255,80,120,0.18)' },
    { icon:'⚙️',  name:'Windows Srv',  detail:'2016–2025 · AD · GPO',    color:'60,160,255', glow:'rgba(60,160,255,0.18)' },
    { icon:'🖧',  name:'Active Dir',   detail:'LDAP · SSO · SAML · FS',  color:'80,200,255', glow:'rgba(80,200,255,0.18)' },
    { icon:'📦',  name:'VMware',       detail:'vSphere · Hyper-V · HA',  color:'100,220,120',glow:'rgba(100,220,120,0.18)' },
    { icon:'🔧',  name:'PowerShell',   detail:'Scripting · Automation',  color:'80,140,255', glow:'rgba(80,140,255,0.18)' },
    { icon:'☁️',  name:'AWS',          detail:'EC2 · S3 · VPC · IAM',    color:'255,160,40', glow:'rgba(255,160,40,0.18)' },
    { icon:'📡',  name:'Intune',       detail:'MDM · Autopilot · MAM',   color:'0,220,200',  glow:'rgba(0,220,200,0.18)' },
    { icon:'🌩️', name:'Terraform',    detail:'IaC · Modules · State',   color:'160,90,255', glow:'rgba(160,90,255,0.18)' },
    { icon:'🔑',  name:'Cisco',        detail:'CCNA · Switching · VPN',  color:'0,200,80',   glow:'rgba(0,200,80,0.18)' },
  ];

  var current = -1;   // which card is showing
  var visible = false;
  var hideTimer = null;
  function pickCard(mx, my) {
    // deterministically pick a card based on position so the same
    // region always shows the same tech — feels like a real spatial layout
    var rect = zone.getBoundingClientRect();
    var rx = (mx - rect.left) / rect.width;   // 0→1
    var ry = (my - rect.top)  / rect.height;  // 0→1
    // 4 cols × 3 rows virtual grid mapped to 12 cards
    var col = Math.min(3, Math.floor(rx * 4));
    var row = Math.min(2, Math.floor(ry * 3));
    return row * 4 + col;
  }

  function showCard(idx, mx, my) {
    var c = cards[idx];
    card.style.setProperty('--gc-color', 'rgba('+c.color+',0.7)');
    card.style.setProperty('--gc-glow',  c.glow);
    icon.textContent   = c.icon;
    name.textContent   = c.name;
    detail.textContent = c.detail;
    positionCard(mx, my);
    card.classList.add('visible');
    visible = true;
  }

  function positionCard(mx, my) {
    // offset so card doesn't sit under cursor
    var cx = mx + 18;
    var cy = my - 20;
    // keep on screen
    if (cx + 160 > window.innerWidth)  cx = mx - 166;
    if (cy + 120 > window.innerHeight) cy = my - 120;
    if (cy < 0) cy = my + 10;
    card.style.left = cx + 'px';
    card.style.top  = cy + 'px';
  }

  function hideCard() {
    card.classList.remove('visible');
    visible = false;
    current = -1;
  }

  zone.addEventListener('mouseenter', function(e) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    var idx = pickCard(e.clientX, e.clientY);
    current = idx;
    showCard(idx, e.clientX, e.clientY);
  });

  zone.addEventListener('mousemove', function(e) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    var idx = pickCard(e.clientX, e.clientY);
    if (idx !== current) {
      current = idx;
      showCard(idx, e.clientX, e.clientY);
    } else {
      positionCard(e.clientX, e.clientY);
    }
  });

  zone.addEventListener('mouseleave', function() {
    hideTimer = setTimeout(hideCard, 80);
  });

})();