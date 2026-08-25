'use strict';
/* ================================================================
   ABDUL RAHIM — AI ENGINEER PORTFOLIO
   Main JavaScript
================================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Year ──────────────────────────────────────────────────────────
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Custom Cursor ─────────────────────────────────────────────────
(function initCursor() {
  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower || window.matchMedia('(pointer: coarse)').matches) return;

  let mx = -200, my = -200, fx = -200, fy = -200;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function animate() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    cursor.style.left   = mx + 'px';
    cursor.style.top    = my + 'px';
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animate);
  })();

  const interactive = 'a, button, .proj-card, .tool-tag, .social-link, input, textarea, .spotlight-card, .other-card';
  document.addEventListener('mouseover',  e => { if (e.target.closest(interactive)) { cursor.classList.add('hovered'); follower.classList.add('hovered'); } });
  document.addEventListener('mouseout',   e => { if (e.target.closest(interactive)) { cursor.classList.remove('hovered'); follower.classList.remove('hovered'); } });
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
  // Show cursor only after first movement
  cursor.style.opacity = '0'; follower.style.opacity = '0';
  document.addEventListener('mousemove', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; }, { once: true });
})();

// ── Navbar scroll ─────────────────────────────────────────────────
(function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── Mobile Menu ───────────────────────────────────────────────────
(function initMobileMenu() {
  const btn   = $('#menuBtn');
  const menu  = $('#mobileMenu');
  const links = $$('.menu-link');
  if (!btn || !menu) return;
  const open  = () => { menu.classList.add('open'); btn.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { menu.classList.remove('open'); btn.classList.remove('open'); document.body.style.overflow = ''; };
  btn.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  links.forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// ── Hero image fade-in ────────────────────────────────────────────
(function initHeroImage() {
  const img = $('#heroBgImg');
  if (!img) return;
  const mark = () => img.classList.add('loaded');
  img.addEventListener('load', mark);
  if (img.complete && img.naturalWidth > 0) mark();
})();

// ── Hero name: glow on hover (CSS glitch handles auto) ────────────────────────────
(function initNameGlow() {
  const el = $('#heroName');
  if (!el) return;
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.textShadow = `
      ${(x - r.width/2)*0.04}px ${(y - r.height/2)*0.04}px 20px rgba(204,17,17,.9),
      0 0 60px rgba(204,17,17,.5), 0 0 120px rgba(204,17,17,.25), 0 4px 12px rgba(0,0,0,.6)`;
  });
  el.addEventListener('mouseleave', () => { el.style.textShadow = ''; });
})();

// ── Hero parallax disabled (steady background) ───────────────────

// ── Skill bars ────────────────────────────────────────────────────
(function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.width;
        if (w) requestAnimationFrame(() => { e.target.style.width = w + '%'; });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  fills.forEach(f => { f.style.width = '0'; obs.observe(f); });
})();

// ── Scroll reveal ─────────────────────────────────────────────────
(function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
})();

// ── Active nav link ───────────────────────────────────────────────
(function initActiveNav() {
  const links    = $$('.nav-links a');
  const sections = $$('section[id]');
  if (!links.length || !sections.length) return;
  const update = () => {
    const sy = window.scrollY + 120;
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].offsetTop <= sy) {
        links.forEach(l => l.classList.remove('active'));
        const a = links.find(l => l.getAttribute('href') === '#' + sections[i].id);
        if (a) a.classList.add('active');
        break;
      }
    }
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ── Project cards: heights equalized by CSS min-height ───────────


document.addEventListener('click', e => {
  const toggle = e.target.closest('.card-toggle');
  if (!toggle) return;
  e.stopPropagation();
  const card = toggle.closest('.proj-card');
  if (!card) return;
  const isOpen = card.classList.toggle('card-open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

// ── Smooth scroll ─────────────────────────────────────────────────
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  });
})();

// ── Marquee pause on hover ────────────────────────────────────────
(function initMarquee() {
  const t = $('.marquee-track');
  if (!t) return;
  t.addEventListener('mouseenter', () => { t.style.animationPlayState = 'paused'; });
  t.addEventListener('mouseleave', () => { t.style.animationPlayState = 'running'; });
})();

// ── Video Modal ───────────────────────────────────────────────────
const modal       = $('#video-modal');
const modalIframe = $('#modal-iframe');
const modalTitle  = $('#modal-title');

function openYouTube(ytId, title) {
  if (!ytId || !modal) return;
  modalIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
  modalTitle.textContent = title || 'Demo';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeVideo() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modalIframe.src = '';
}

if (modal) {
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeVideo));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeVideo(); closeAssistant(); } });
}

// Wire project cards + spotlight
$$('[data-youtube]').forEach(card => {
  const ytId  = card.dataset.youtube;
  const title = card.dataset.title || 'Demo';
  const media = card.querySelector('.proj-media, .proj-thumb');
  const btn   = card.querySelector('.play-btn');
  const handler = () => openYouTube(ytId, title);
  if (media) { media.style.cursor = 'none'; media.addEventListener('click', handler); }
  if (btn)   btn.addEventListener('click', handler);
});

// ── AI Assistant ──────────────────────────────────────────────────
const fab         = $('#assistant-fab');
const panel       = $('#assistant');
const closeBtn    = $('#close-assistant');
const openCTA     = $('#open-assistant-cta');
const askMoreBtn  = $('#ask-more-btn');
const muteBtn     = $('#mute-btn');

function openAssistant(query) {
  if (!panel) return;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  setTimeout(() => $('#chat-text')?.focus(), 200);
  if (query && window.AssistantAPI) window.AssistantAPI.ask(query);
}
function closeAssistant() {
  if (!panel) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  if (window.AssistantAPI) window.AssistantAPI.stopSpeaking();
}

if (fab)        fab.addEventListener('click',  () => panel.classList.contains('open') ? closeAssistant() : openAssistant());
if (closeBtn)   closeBtn.addEventListener('click', closeAssistant);
if (openCTA)    openCTA.addEventListener('click', e => { e.preventDefault(); openAssistant(); });
if (askMoreBtn) askMoreBtn.addEventListener('click', () => openAssistant('Tell me about your other and early academic projects'));
if (muteBtn)    muteBtn.addEventListener('click', () => {
  const muted = window.AssistantAPI?.toggleMute();
  muteBtn.textContent = muted ? '\uD83D\uDD07' : '\uD83D\uDD0A';
});

// Contact form (static — mailto fallback)
(function initContactForm() {
  const form      = $('#contactForm');
  const submitBtn = $('#submitBtn');
  if (!form || !submitBtn) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    if (!name || !email || !message) return;
    const btnText  = submitBtn.querySelector('.btn-text');
    const btnArrow = submitBtn.querySelector('.btn-arrow');
    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject: form.querySelector('#subject')?.value.trim(), message })
      });
      if (res.ok) {
        submitBtn.classList.add('success');
        if (btnText)  btnText.textContent  = 'Message Sent!';
        if (btnArrow) btnArrow.textContent = '\u2713';
        form.reset();
      } else throw new Error();
    } catch {
      // Fallback: open mail client
      window.location.href = `mailto:rahimxofficial@gmail.com?subject=Portfolio%20Contact&body=${encodeURIComponent(message)}`;
    }
    setTimeout(() => {
      submitBtn.classList.remove('success');
      if (btnText)  btnText.textContent  = 'SEND MESSAGE';
      if (btnArrow) btnArrow.textContent = '\u2192';
    }, 4000);
  });
})();
