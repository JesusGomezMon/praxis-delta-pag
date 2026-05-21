/* ============================================
   PRAXIS DELTA – Script
   ============================================ */

/* ════════════════════════════
   LANGUAGE SYSTEM
════════════════════════════ */
let currentLang = localStorage.getItem('pd_lang') || 'es';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('pd_lang', lang);

  const dict = translations[lang];
  if (!dict) return;

  /* text content */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  /* innerHTML (allows <strong> etc.) */
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  /* placeholder */
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (dict[key] !== undefined) el.placeholder = dict[key];
  });

  /* html lang attribute */
  document.documentElement.lang = lang;

  /* update all toggle buttons */
  updateLangButtons(lang);
}

function updateLangButtons(lang) {
  const pairs = [
    ['langES', 'langEN'],
    ['langESMob', 'langENMob'],
  ];
  pairs.forEach(([esId, enId]) => {
    const esEl = document.getElementById(esId);
    const enEl = document.getElementById(enId);
    if (!esEl || !enEl) return;
    esEl.classList.toggle('active', lang === 'es');
    enEl.classList.toggle('active', lang === 'en');
  });
}

function toggleLanguage() {
  applyLanguage(currentLang === 'es' ? 'en' : 'es');
}

/* bind both toggle buttons */
['langToggle', 'langToggleMob'].forEach(id => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', toggleLanguage);
});

/* init on load */
applyLanguage(currentLang);


/* ════════════════════════════
   NAVBAR SCROLL
════════════════════════════ */
const navbar = document.getElementById('navbar');
function syncMobileMenuOffset() {
  if (!mobileMenu || !navbar) return;
  const navHeight = navbar.offsetHeight;
  mobileMenu.style.top = `${navHeight}px`;
  mobileMenu.style.height = `calc(100vh - ${navHeight}px)`;
}
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  syncMobileMenuOffset();
}, { passive: true });


/* ════════════════════════════
   HAMBURGER / MOBILE MENU
════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobLinks   = document.querySelectorAll('.mob-link');

syncMobileMenuOffset();
window.addEventListener('resize', syncMobileMenuOffset);

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  navbar.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
  });
});


/* ════════════════════════════
   SCROLL REVEAL
════════════════════════════ */
const revealEls = document.querySelectorAll(
  '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-card'
);

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ════════════════════════════
   COUNTER ANIMATION
════════════════════════════ */
function animateCounter(el, target) {
  const duration = 1800;
  const steps    = duration / 16;
  const inc      = target / steps;
  let current    = 0;

  const tick = () => {
    current += inc;
    if (current >= target) { el.textContent = target; return; }
    el.textContent = Math.round(current);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-target]').forEach(el => {
  counterObserver.observe(el);
});


/* ════════════════════════════
   SMOOTH ANCHOR SCROLL
════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});


/* ════════════════════════════
   CONTACT FORM
════════════════════════════ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const nombre  = document.getElementById('nombre').value.trim();
    const empresa = document.getElementById('empresa').value.trim();
    const email   = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    const waText = encodeURIComponent(
      `Hola Praxis Delta, me contacto desde el sitio web.\n\n` +
      `Nombre: ${nombre}\n` +
      (empresa ? `Empresa: ${empresa}\n` : '') +
      `Correo: ${email}\n` +
      (mensaje ? `\nMensaje: ${mensaje}` : '')
    );
    window.open(`https://api.whatsapp.com/send?phone=5560914901&text=${waText}`, '_blank');

    contactForm.innerHTML = `
      <div class="form-success">
        <h3>¡Gracias, ${nombre}!</h3>
        <p>Te redirigimos a WhatsApp para continuar. Pronto te contactaremos.</p>
      </div>`;
  });
}


/* ════════════════════════════
   ACTIVE NAV ON SCROLL
════════════════════════════ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) a.style.color = 'var(--blue-lite)';
      });
    });
  },
  { rootMargin: '-40% 0px -50% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));


/* ════════════════════════════
   CURSOR GLOW  (desktop)
════════════════════════════ */
if (window.innerWidth > 900) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    width:380px; height:380px; border-radius:50%;
    background: radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 65%);
    transform: translate(-50%,-50%);
    transition: left 0.55s ease, top 0.55s ease;
    left:-200px; top:-200px;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}


/* ════════════════════════════
   PARALLAX HERO ORBS
════════════════════════════ */
const orb1 = document.querySelector('.hero-orb-1');
const orb2 = document.querySelector('.hero-orb-2');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (orb1) orb1.style.transform = `translateY(${y * 0.1}px)`;
  if (orb2) orb2.style.transform = `translateY(${-y * 0.07}px)`;
}, { passive: true });


/* ════════════════════════════
   CARD TILT
════════════════════════════ */
document.querySelectorAll('.problem-card, .servicio-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const rotX = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -5;
    const rotY = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  5;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
