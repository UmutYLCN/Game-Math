/* Navigation and focus management, independent of the question generators. */
let resumePracticeTimer = false;

function showArea(area) {
  if (area === activeArea) return;
  activeArea = area;
  const learning = area === 'learning';
  document.getElementById('practice-area').classList.toggle('hidden', learning);
  document.getElementById('learning-area').classList.toggle('hidden', !learning);
  document.getElementById('practice-nav').toggleAttribute('aria-current', !learning);
  document.getElementById('learn-nav').toggleAttribute('aria-current', learning);
  document.querySelector('.area-nav [aria-current]').setAttribute('aria-current', 'page');
  if (learning) {
    resumePracticeTimer = state.timerInterval !== null;
    stopHackerTimer();
    document.getElementById('learning-timer-notice').classList.toggle('hidden', !resumePracticeTimer);
    document.getElementById('lesson-title').focus({ preventScroll: true });
  } else {
    if (resumePracticeTimer && state.hackerTimerEnabled && state.timerSeconds > 0) startHackerTimer(false);
    resumePracticeTimer = false;
    if (pendingLevelUp) triggerLevelUpModal();
    else if (state.activeMode === 'DAILY_CHALLENGE' && state.dailyState.currentIndex >= state.dailyState.questions.length) openDailyModal();
    else answerInput.focus({ preventScroll: true });
  }
}

function dismissModal(modal) {
  const dismissers = {
    'mode-modal': closeModeModal,
    'docs-modal': closeDocsModal,
    'stats-modal': closeStatsModal,
    'daily-modal': closeDailyModal,
    'levelup-modal': closeLevelupModal
  };
  if (dismissers[modal.id]) dismissers[modal.id]();
  // Timeout stays actionable: Escape returns to practice; submitting reopens restart.
  else if (modal === timeupModal) modal.classList.add('hidden');
}

function initModalAccessibility() {
  const app = document.querySelector('.app-container');
  const modals = [...document.querySelectorAll('.modal-overlay')];
  let activeModal = null;
  let previousFocus = null;
  const focusable = modal => [...modal.querySelectorAll('button, input, summary, a[href], [tabindex="0"]')]
    .filter(element => !element.disabled && element.getClientRects().length && !element.closest('[inert]'));
  for (const modal of modals) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.tabIndex = -1;
    const title = modal.querySelector('h3, h2');
    if (title) {
      if (!title.id) title.id = `${modal.id}-title`;
      modal.setAttribute('aria-labelledby', title.id);
    }
    modal.querySelectorAll('.close-btn').forEach(button => button.setAttribute('aria-label', 'Pencereyi kapat'));
    modal.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const elements = focusable(modal);
      const first = elements[0] || modal;
      const last = elements.at(-1) || modal;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === modal)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
  }
  function syncModalFocus() {
    const next = modals.find(modal => !modal.classList.contains('hidden')) || null;
    if (next === activeModal) return;
    if (next) {
      if (!activeModal) previousFocus = document.activeElement;
      app.inert = true;
      document.body.style.overflow = 'hidden';
      activeModal = next;
      (focusable(next)[0] || next).focus({ preventScroll: true });
    } else {
      activeModal = null;
      app.inert = false;
      document.body.style.overflow = '';
      const target = previousFocus?.getClientRects().length ? previousFocus : (activeArea === 'practice' ? answerInput : document.getElementById('lesson-title'));
      target?.focus({ preventScroll: true });
    }
  }
  const observer = new MutationObserver(syncModalFocus);
  modals.forEach(modal => observer.observe(modal, { attributes: true, attributeFilter: ['class'] }));
}

function initInterface() {
  initLearning();
  initModalAccessibility();
  document.getElementById('practice-nav').addEventListener('click', () => showArea('practice'));
  document.getElementById('learn-nav').addEventListener('click', () => showArea('learning'));
  document.getElementById('learn-start-btn').addEventListener('click', () => {
    showArea('learning');
    document.getElementById('learning-title').scrollIntoView({ block: 'start' });
  });
  // Capture phase returns to the practice workspace before existing mode handlers run.
  [modeBtn, dailyBtn].forEach(button => button.addEventListener('click', () => showArea('practice'), true));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateMotion = () => {
    if (motion.matches && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    matrixToggleBtn.title = motion.matches ? 'Azaltılmış hareket tercihi nedeniyle yağmur animasyonu duraklatıldı.' : 'Matrix yağmurunu aç/kapat';
  };
  motion.addEventListener('change', updateMotion);
  updateMotion();

}

document.addEventListener('DOMContentLoaded', initInterface);
