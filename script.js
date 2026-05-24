/* === script.js === main interactions === */

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1 && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---------- Video Modal (YouTube) ---------- */
const modal = document.getElementById('video-modal');
const modalIframe = document.getElementById('modal-iframe');
const modalTitle = document.getElementById('modal-title');

function openYouTube(youtubeId, title) {
  if (!youtubeId) return;
  modalIframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  modalTitle.textContent = title || 'Demo';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeVideo() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modalIframe.src = '';
}

modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeVideo));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideo(); });

// Wire up every project card
document.querySelectorAll('.project').forEach(card => {
  const ytId = card.getAttribute('data-youtube');
  const title = card.getAttribute('data-title') || 'Demo';
  if (!ytId) return; // skip cards with no demo yet
  const media = card.querySelector('.project-media');
  const btn = card.querySelector('.play-btn');
  const handler = () => openYouTube(ytId, title);
  if (media) { media.style.cursor = 'pointer'; media.addEventListener('click', handler); }
  if (btn) btn.addEventListener('click', handler);
});

/* ---------- Assistant open/close ---------- */
const fab = document.getElementById('assistant-fab');
const panel = document.getElementById('assistant');
const closeAssistantBtn = document.getElementById('close-assistant');
const openCTA = document.getElementById('open-assistant-cta');
const askMoreBtn = document.getElementById('ask-more-btn');

function openAssistant(initialQuery) {
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  setTimeout(() => document.getElementById('chat-text')?.focus(), 200);
  if (initialQuery && window.AssistantAPI) {
    window.AssistantAPI.ask(initialQuery);
  }
}
function closeAssistant() {
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  if (window.AssistantAPI) window.AssistantAPI.stopSpeaking();
}

fab.addEventListener('click', () => panel.classList.contains('open') ? closeAssistant() : openAssistant());
closeAssistantBtn.addEventListener('click', closeAssistant);
openCTA?.addEventListener('click', (e) => { e.preventDefault(); openAssistant(); });
askMoreBtn?.addEventListener('click', () => openAssistant('Tell me about your other and early academic projects'));

// Mute / unmute voice
const muteBtn = document.getElementById('mute-btn');
muteBtn.addEventListener('click', () => {
  const muted = window.AssistantAPI.toggleMute();
  muteBtn.textContent = muted ? '🔇' : '🔊';
});

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section, .project, .skill-card, .cert-card, .t-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io.observe(el);
});
