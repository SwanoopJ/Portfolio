// ===== CURSOR LOGIC =====

const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
const trailContainer = document.getElementById('cursor-trail-container');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
let lastTrailTime = 0;

if (dot && ring) {
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';

  const now = Date.now();
  if (now - lastTrailTime > 30) {
    createTrail(mouseX, mouseY);
    lastTrailTime = now;
  }
});

function lerp(a, b, t) { return a + (b - a) * t; }

function animateRing() {
  ringX = lerp(ringX, mouseX, 0.14);
  ringY = lerp(ringY, mouseY, 0.14);
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

function createTrail(x, y) {
  const p = document.createElement('div');
  p.className = 'trail-particle';
  p.style.left = x + 'px'; p.style.top = y + 'px';
  const hue = Math.random() > 0.5 ? '180' : '20';
  p.style.background = `hsl(${hue}, 100%, 60%)`;
  p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
  trailContainer.appendChild(p);
  setTimeout(() => p.remove(), 600);
}

document.addEventListener('mouseenter', (e) => {
  if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.classList.contains('cta-btn')) {
    ring.classList.add('hovered');
  }
}, true);
document.addEventListener('mouseleave', (e) => {
  if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.classList.contains('cta-btn')) {
    ring.classList.remove('hovered');
  }
}, true);
} // end if (dot && ring)

const techLogos = [
  { name: 'WINDOWS', color: '#00adef', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="37" height="37" fill="#f25022"/><rect x="47" y="4" width="37" height="37" fill="#7fba00"/><rect x="4" y="47" width="37" height="37" fill="#00a4ef"/><rect x="47" y="47" width="37" height="37" fill="#ffb900"/></svg>` },
  { name: 'LINUX', color: '#ffc107', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="44" cy="32" rx="18" ry="22" fill="#ffc107"/><circle cx="37" cy="28" r="3" fill="#333"/><circle cx="51" cy="28" r="3" fill="#333"/><path d="M37 38 Q44 44 51 38" stroke="#333" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M26 54 Q28 42 44 44 Q60 42 62 54 Q64 66 56 70 Q52 75 44 75 Q36 75 32 70 Q24 66 26 54Z" fill="#ffc107"/><path d="M32 70 Q28 74 24 78 Q20 82 22 84 Q26 86 30 80" stroke="#ffc107" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M56 70 Q60 74 64 78 Q68 82 66 84 Q62 86 58 80" stroke="#ffc107" stroke-width="4" stroke-linecap="round" fill="none"/></svg>` },
  { name: 'AWS', color: '#ff9900', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 52 Q20 64 28 68 Q36 72 44 68 Q52 72 60 68 Q68 64 64 52" stroke="#ff9900" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M14 60 Q10 56 12 50 Q16 42 24 44" stroke="#ff9900" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M74 60 Q78 56 76 50 Q72 42 64 44" stroke="#ff9900" stroke-width="3" fill="none" stroke-linecap="round"/><text x="44" y="36" font-family="Arial" font-weight="bold" font-size="13" fill="#ff9900" text-anchor="middle">aws</text><path d="M30 22 L44 14 L58 22 L58 38 L44 46 L30 38Z" stroke="#ff9900" stroke-width="2.5" fill="rgba(255,153,0,0.1)"/></svg>` },
  { name: 'AZURE', color: '#0078d4', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 66 L44 14 L56 40 L36 40 Z" fill="#0078d4"/><path d="M36 40 L56 40 L66 66 Z" fill="#0050a0"/><path d="M14 66 L36 40 L22 66Z" fill="#50c0ff"/></svg>` },
  { name: 'DOCKER', color: '#2496ed', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="36" width="12" height="10" rx="1" fill="#2496ed" stroke="#2496ed" stroke-width="1"/><rect x="28" y="36" width="12" height="10" rx="1" fill="#2496ed" stroke="#2496ed" stroke-width="1"/><rect x="42" y="36" width="12" height="10" rx="1" fill="#2496ed" stroke="#2496ed" stroke-width="1"/><rect x="28" y="24" width="12" height="10" rx="1" fill="#2496ed" stroke="#2496ed" stroke-width="1"/><rect x="42" y="24" width="12" height="10" rx="1" fill="#2496ed" stroke="#2496ed" stroke-width="1"/><path d="M56 42 Q62 38 68 42 Q70 52 62 56 L20 56 Q12 56 12 48 Q12 40 20 40" stroke="#2496ed" stroke-width="2" fill="rgba(36,150,237,0.15)"/><path d="M64 34 Q68 28 74 30" stroke="#2496ed" stroke-width="2" stroke-linecap="round"/></svg>` },
  { name: 'VMWARE', color: '#607078', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="20" width="64" height="14" rx="3" fill="rgba(96,112,120,0.3)" stroke="#607078" stroke-width="2"/><rect x="16" y="24" width="6" height="6" rx="1" fill="#607078"/><rect x="12" y="38" width="64" height="14" rx="3" fill="rgba(96,112,120,0.3)" stroke="#00b0da" stroke-width="2"/><rect x="16" y="42" width="6" height="6" rx="1" fill="#00b0da"/><rect x="12" y="56" width="64" height="14" rx="3" fill="rgba(96,112,120,0.3)" stroke="#607078" stroke-width="2"/><rect x="16" y="60" width="6" height="6" rx="1" fill="#607078"/></svg>` },
  { name: 'PYTHON', color: '#3776ab', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 10 C28 10 22 18 22 26 L22 34 L44 34 L44 38 L18 38 C12 38 8 42 8 50 C8 58 12 68 24 68 L34 68 L34 60 C34 54 38 50 44 50 L54 50 C60 50 64 46 64 40 L64 26 C64 18 58 10 44 10Z" fill="#3776ab"/><path d="M44 78 C60 78 66 70 66 62 L66 54 L44 54 L44 50 L70 50 C76 50 80 46 80 38 C80 30 76 20 64 20 L54 20 L54 28 C54 34 50 38 44 38 L34 38 C28 38 24 42 24 48 L24 62 C24 70 30 78 44 78Z" fill="#ffd43b"/><circle cx="36" cy="25" r="4" fill="white"/><circle cx="52" cy="63" r="4" fill="white"/></svg>` },
  { name: 'FORTINET', color: '#ee3124', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="44,8 76,26 76,62 44,80 12,62 12,26" fill="none" stroke="#ee3124" stroke-width="3"/><text x="44" y="52" font-family="Arial" font-weight="bold" font-size="22" fill="#ee3124" text-anchor="middle">F</text></svg>` },
  { name: 'HYPER-V', color: '#00adef', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="14" width="26" height="26" rx="3" fill="rgba(0,173,239,0.2)" stroke="#00adef" stroke-width="2"/><rect x="48" y="14" width="26" height="26" rx="3" fill="rgba(0,173,239,0.1)" stroke="#00adef" stroke-width="2" stroke-dasharray="4 2"/><rect x="14" y="48" width="26" height="26" rx="3" fill="rgba(0,173,239,0.1)" stroke="#00adef" stroke-width="2" stroke-dasharray="4 2"/><rect x="48" y="48" width="26" height="26" rx="3" fill="rgba(0,173,239,0.1)" stroke="#00adef" stroke-width="2" stroke-dasharray="4 2"/></svg>` },
  { name: 'POWERSHELL', color: '#5391fe', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="18" width="68" height="52" rx="5" fill="rgba(83,145,254,0.15)" stroke="#5391fe" stroke-width="2"/><path d="M20 38 L34 44 L20 50" stroke="#5391fe" stroke-width="2.5" stroke-linejoin="round" fill="none"/><line x1="36" y1="50" x2="52" y2="50" stroke="#5391fe" stroke-width="2.5" stroke-linecap="round"/></svg>` },
  { name: 'INTUNE', color: '#0078d4', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="14" width="52" height="38" rx="4" fill="rgba(0,120,212,0.15)" stroke="#0078d4" stroke-width="2"/><rect x="30" y="52" width="28" height="6" rx="2" fill="#0078d4"/><rect x="24" y="58" width="40" height="4" rx="2" fill="#0078d4" opacity="0.5"/><circle cx="44" cy="33" r="10" fill="none" stroke="#0078d4" stroke-width="2"/><path d="M40 33 L43 36 L50 29" stroke="#0078d4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>` },
  { name: 'VEEAM', color: '#00b336', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="44" cy="44" r="30" fill="rgba(0,179,54,0.12)" stroke="#00b336" stroke-width="2"/><path d="M28 44 A16 16 0 1 1 44 60" stroke="#00b336" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M38 60 L44 60 L44 66" stroke="#00b336" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>` },
  { name: 'ZERO TRUST', color: '#00f5ff', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 8 L70 20 L70 50 C70 64 58 74 44 80 C30 74 18 64 18 50 L18 20 Z" fill="rgba(0,245,255,0.08)" stroke="#00f5ff" stroke-width="2"/><path d="M34 44 L40 50 L54 36" stroke="#00f5ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>` },
  { name: 'PALO ALTO', color: '#fa582d', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="28" width="52" height="8" rx="4" fill="#fa582d"/><rect x="24" y="40" width="40" height="8" rx="4" fill="#fa582d" opacity="0.75"/><rect x="30" y="52" width="28" height="8" rx="4" fill="#fa582d" opacity="0.5"/></svg>` },
  { name: 'ENTRA ID', color: '#0078d4', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="44" cy="32" r="14" fill="rgba(0,120,212,0.2)" stroke="#0078d4" stroke-width="2.5"/><path d="M22 72 C22 58 30 52 44 52 C58 52 66 58 66 72" stroke="#0078d4" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="30" cy="54" r="8" fill="rgba(0,120,212,0.15)" stroke="#0078d4" stroke-width="1.5" opacity="0.6"/><circle cx="58" cy="54" r="8" fill="rgba(0,120,212,0.15)" stroke="#0078d4" stroke-width="1.5" opacity="0.6"/></svg>` },
  { name: 'CISCO', color: '#1ba0d7', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="18" width="8" height="20" rx="4" fill="#1ba0d7"/><rect x="26" y="26" width="8" height="16" rx="4" fill="#1ba0d7" opacity="0.8"/><rect x="54" y="26" width="8" height="16" rx="4" fill="#1ba0d7" opacity="0.8"/><rect x="12" y="34" width="8" height="12" rx="4" fill="#1ba0d7" opacity="0.5"/><rect x="68" y="34" width="8" height="12" rx="4" fill="#1ba0d7" opacity="0.5"/><path d="M16 52 Q44 68 72 52" stroke="#1ba0d7" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/></svg>` },
  { name: 'SENTINEL', color: '#009fc7', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 10 L72 24 L72 56 C72 68 58 78 44 82 C30 78 16 68 16 56 L16 24 Z" fill="rgba(0,159,199,0.1)" stroke="#009fc7" stroke-width="2"/><circle cx="44" cy="46" r="14" fill="none" stroke="#009fc7" stroke-width="2" stroke-dasharray="5 3"/><circle cx="44" cy="46" r="6" fill="#009fc7" opacity="0.5"/></svg>` },
  { name: 'EXCHANGE', color: '#0078d4', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="24" width="56" height="40" rx="4" fill="rgba(0,120,212,0.12)" stroke="#0078d4" stroke-width="2"/><path d="M16 36 L44 54 L72 36" stroke="#0078d4" stroke-width="2" fill="none"/></svg>` },
  { name: 'SHAREPOINT', color: '#038387', svg: `<svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="44" cy="44" r="28" fill="rgba(3,131,135,0.12)" stroke="#038387" stroke-width="2"/><circle cx="44" cy="44" r="14" fill="rgba(3,131,135,0.2)" stroke="#038387" stroke-width="2"/><circle cx="44" cy="44" r="5" fill="#038387"/><line x1="44" y1="16" x2="44" y2="72" stroke="#038387" stroke-width="1.5" opacity="0.5"/><line x1="16" y1="44" x2="72" y2="44" stroke="#038387" stroke-width="1.5" opacity="0.5"/></svg>` },
];