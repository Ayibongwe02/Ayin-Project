// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  mobileMenu.classList.toggle('flex');
});

mobileLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
  });
});

// ---------------------------------------------------------------------------
// 3D logo: follows the mouse across the page; eye tracks on scroll
// ---------------------------------------------------------------------------
const logo3d = document.getElementById('logo3d');
const logoStage = document.getElementById('logoStage');
const logoEye = document.getElementById('logoEye');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (logo3d && logoStage && !reducedMotion) {
  logo3d.classList.remove('auto');

  let mouseX = 0.5;
  let mouseY = 0.5;
  let hasPointer = false;

  let rotX = 0;
  let rotY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  let eyeX = 0;
  let eyeY = 0;
  let targetEyeX = 0;
  let targetEyeY = 0;

  let scrollTilt = 0;
  let targetScrollTilt = 0;

  const maxRot = 18; // degrees — sensitive but not wild
  const maxEye = 10; // px pupil shift inside the iris
  const lerp = (a, b, t) => a + (b - a) * t;

  window.addEventListener(
    'mousemove',
    (e) => {
      hasPointer = true;
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;

      // Logo faces the cursor relative to viewport centre
      targetRotY = (mouseX - 0.5) * maxRot * 2;
      targetRotX = (0.5 - mouseY) * maxRot * 1.6;

      // Eye looks toward the cursor even more closely
      targetEyeX = (mouseX - 0.5) * maxEye * 2;
      targetEyeY = (mouseY - 0.5) * maxEye * 2;
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = window.scrollY / maxScroll;
      // Gentle continuous eye drift as you move down the page
      targetScrollTilt = progress * 14 - 4;
      if (!hasPointer) {
        targetEyeY = Math.sin(progress * Math.PI * 2) * 6;
        targetEyeX = Math.cos(progress * Math.PI * 1.5) * 5;
        targetRotX = progress * -8;
        targetRotY = Math.sin(progress * Math.PI) * 6;
      } else {
        // Blend a little scroll influence even while the mouse is active
        targetRotX += progress * -3;
      }
    },
    { passive: true }
  );

  // Touch: follow finger when it moves on the page
  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length !== 1) return;
      hasPointer = true;
      const t = e.touches[0];
      mouseX = t.clientX / window.innerWidth;
      mouseY = t.clientY / window.innerHeight;
      targetRotY = (mouseX - 0.5) * maxRot * 2;
      targetRotX = (0.5 - mouseY) * maxRot * 1.6;
      targetEyeX = (mouseX - 0.5) * maxEye * 2;
      targetEyeY = (mouseY - 0.5) * maxEye * 2;
    },
    { passive: true }
  );

  function frame() {
    // Fast, responsive follow (high lerp = more sensitive)
    rotX = lerp(rotX, targetRotX, 0.14);
    rotY = lerp(rotY, targetRotY, 0.14);
    eyeX = lerp(eyeX, targetEyeX, 0.18);
    eyeY = lerp(eyeY, targetEyeY, 0.18);
    scrollTilt = lerp(scrollTilt, targetScrollTilt, 0.08);

    const totalRotX = rotX + scrollTilt * 0.25;
    logo3d.style.transform = `rotateX(${totalRotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;

    if (logoEye) {
      // Clamp pupil so it stays inside the iris
      const clampedX = Math.max(-8, Math.min(8, eyeX));
      const clampedY = Math.max(-8, Math.min(8, eyeY + scrollTilt * 0.35));
      logoEye.style.transform = `translate(${clampedX.toFixed(2)}px, ${clampedY.toFixed(2)}px)`;
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
} else if (logo3d) {
  logo3d.classList.add('auto');
}

// Contact form (front-end only demo)
const form = document.getElementById('contactForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'Message received — thank you';
  btn.disabled = true;
  btn.classList.add('opacity-80');

  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    btn.classList.remove('opacity-80');
    form.reset();
  }, 2800);
});

// Scroll reveals — sections and staggered cards
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('section > div.max-w-7xl, section > div.max-w-3xl').forEach((el) => {
  el.classList.add('reveal-block');
  revealObserver.observe(el);
});

document.querySelectorAll('.reveal-item').forEach((el, i) => {
  el.style.setProperty('--reveal-delay', `${(i % 6) * 70}ms`);
  revealObserver.observe(el);
});

// Hero stays visible
const heroContent = document.querySelector('#hero > div');
if (heroContent) {
  heroContent.classList.add('is-visible');
  heroContent.classList.remove('reveal-block');
}

// ---------------------------------------------------------------------------
// Background: drifting software-icon doodles
// ---------------------------------------------------------------------------
(function initDoodles() {
  const field = document.getElementById('doodleField');
  if (!field || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Minimal line icons — software / systems doodles
  const shapes = [
    // brackets / code
    `<svg viewBox="0 0 32 32"><path d="M10 6L4 16l6 10M22 6l6 10-6 10"/></svg>`,
    // terminal
    `<svg viewBox="0 0 32 32"><rect x="3" y="6" width="26" height="20" rx="2"/><path d="M8 14l4 3-4 3M15 20h7"/></svg>`,
    // database
    `<svg viewBox="0 0 32 32"><ellipse cx="16" cy="8" rx="10" ry="4"/><path d="M6 8v12c0 2.2 4.5 4 10 4s10-1.8 10-4V8"/><path d="M6 14c0 2.2 4.5 4 10 4s10-1.8 10-4"/></svg>`,
    // chip
    `<svg viewBox="0 0 32 32"><rect x="9" y="9" width="14" height="14" rx="2"/><path d="M9 13H5M9 16H4M9 19H5M23 13h4M23 16h5M23 19h4M13 9V5M16 9V4M19 9V5M13 23v4M16 23v5M19 23v4"/></svg>`,
    // nodes / graph
    `<svg viewBox="0 0 32 32"><circle cx="8" cy="10" r="3"/><circle cx="24" cy="8" r="3"/><circle cx="16" cy="24" r="3"/><circle cx="22" cy="18" r="2.5"/><path d="M10.5 12l10-2.5M10 12.5l4.5 9M19.5 10.5l1.5 5.5M18.5 22.5l2-2.5"/></svg>`,
    // gear
    `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="4"/><path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M24.5 7.5l-2.8 2.8M10.3 21.7l-2.8 2.8"/></svg>`,
    // cloud
    `<svg viewBox="0 0 32 32"><path d="M10 22h14a5 5 0 0 0 0-10 7 7 0 0 0-13.5-2A4.5 4.5 0 0 0 10 22z"/></svg>`,
    // branch / git
    `<svg viewBox="0 0 32 32"><circle cx="10" cy="8" r="3"/><circle cx="10" cy="24" r="3"/><circle cx="22" cy="16" r="3"/><path d="M10 11v10M13 8c6 0 9 4 9 5"/></svg>`,
    // cursor / pointer
    `<svg viewBox="0 0 32 32"><path d="M8 4l4 22 5-7 8-2z"/></svg>`,
    // layers
    `<svg viewBox="0 0 32 32"><path d="M16 5L4 12l12 7 12-7z"/><path d="M4 17l12 7 12-7"/><path d="M4 22l12 7 12-7"/></svg>`,
    // function / lambda-ish
    `<svg viewBox="0 0 32 32"><path d="M10 6h8M14 6c0 8-6 12-6 20M18 14h6"/><path d="M18 14c4 4 4 8 2 12"/></svg>`,
    // lock
    `<svg viewBox="0 0 32 32"><rect x="8" y="14" width="16" height="12" rx="2"/><path d="M12 14V10a4 4 0 0 1 8 0v4"/></svg>`,
  ];

  const COUNT = window.innerWidth < 640 ? 10 : window.innerWidth < 1024 ? 14 : 18;
  const doodles = [];

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'doodle-icon';
    el.innerHTML = shapes[i % shapes.length];
    const size = rand(22, 48);
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    field.appendChild(el);

    doodles.push({
      el,
      x: rand(0, 100),
      y: rand(0, 100),
      // velocity in % of viewport per second — slow drift
      vx: rand(-3.5, 3.5) || 1.2,
      vy: rand(-2.8, 2.8) || 0.9,
      rot: rand(0, 360),
      vr: rand(-18, 18),
      scale: rand(0.75, 1.25),
      opacity: rand(0.08, 0.2),
      pulse: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.4, 1.1),
    });
  }

  let last = performance.now();

  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    for (const d of doodles) {
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.rot += d.vr * dt;
      d.pulse += d.pulseSpeed * dt;

      // soft bounce at edges
      if (d.x < -5) d.x = 105;
      if (d.x > 105) d.x = -5;
      if (d.y < -5) d.y = 105;
      if (d.y > 105) d.y = -5;

      // occasional gentle direction change
      if (Math.random() < 0.002) {
        d.vx += rand(-1.2, 1.2);
        d.vy += rand(-1.2, 1.2);
        d.vx = Math.max(-4.5, Math.min(4.5, d.vx));
        d.vy = Math.max(-3.5, Math.min(3.5, d.vy));
      }

      const breathe = 1 + Math.sin(d.pulse) * 0.06;
      const op = d.opacity * (0.85 + Math.sin(d.pulse * 0.7) * 0.15);

      d.el.style.opacity = op.toFixed(3);
      d.el.style.transform = `translate(${d.x}vw, ${d.y}vh) rotate(${d.rot.toFixed(1)}deg) scale(${(d.scale * breathe).toFixed(3)})`;
    }

    requestAnimationFrame(tick);
  }

  // seed positions once so first paint isn't all at 0,0
  for (const d of doodles) {
    d.el.style.opacity = String(d.opacity);
    d.el.style.transform = `translate(${d.x}vw, ${d.y}vh) rotate(${d.rot}deg) scale(${d.scale})`;
  }

  requestAnimationFrame(tick);
})();
