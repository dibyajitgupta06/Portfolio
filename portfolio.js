/* Lightweight interactions for the portfolio. No WebGL or animation engine. */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  let soundContext;
  let noiseBuffer;
  const getSoundContext = () => {
    if (!AudioContextClass) return null;
    if (!soundContext) soundContext = new AudioContextClass();
    if (soundContext.state === 'suspended') soundContext.resume().catch(() => {});
    return soundContext;
  };
  const getNoiseBuffer = context => {
    if (!noiseBuffer) {
      noiseBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 2), context.sampleRate);
      const samples = noiseBuffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
  };
  const unlockAudio = () => getSoundContext();
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(eventName => {
    document.addEventListener(eventName, unlockAudio, { once:true, passive:true });
  });
  const playFartSound = () => {
    const context = getSoundContext();
    if (!context) return;
    const now = context.currentTime;
    const duration = 1.65;
    const fart = context.createOscillator();
    const wobble = context.createOscillator();
    const wobbleDepth = context.createGain();
    const filter = context.createBiquadFilter();
    const fartGain = context.createGain();
    fart.type = 'sawtooth';
    fart.frequency.setValueAtTime(128, now);
    fart.frequency.exponentialRampToValueAtTime(54, now + 1.45);
    wobble.type = 'sine';
    wobble.frequency.setValueAtTime(7.5, now);
    wobbleDepth.gain.setValueAtTime(20, now);
    wobble.connect(wobbleDepth).connect(fart.frequency);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(410, now);
    filter.frequency.exponentialRampToValueAtTime(220, now + duration);
    fartGain.gain.setValueAtTime(.0001, now);
    fartGain.gain.exponentialRampToValueAtTime(.25, now + .08);
    fartGain.gain.setValueAtTime(.19, now + 1.05);
    fartGain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    fart.connect(filter).connect(fartGain).connect(context.destination);
    fart.start(now);
    fart.stop(now + duration);
    wobble.start(now);
    wobble.stop(now + duration);

    const rasp = context.createBufferSource();
    const raspFilter = context.createBiquadFilter();
    const raspGain = context.createGain();
    rasp.buffer = getNoiseBuffer(context);
    raspFilter.type = 'bandpass';
    raspFilter.frequency.setValueAtTime(560, now);
    raspFilter.frequency.exponentialRampToValueAtTime(260, now + duration);
    raspGain.gain.setValueAtTime(.0001, now);
    raspGain.gain.exponentialRampToValueAtTime(.12, now + .04);
    raspGain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    rasp.connect(raspFilter).connect(raspGain).connect(context.destination);
    rasp.start(now);
    rasp.stop(now + duration);
  };
  const flushAudio = new Audio('assets/toilet-flush.mp3');
  flushAudio.preload = 'auto';
  const playFlushSound = () => {
    flushAudio.pause();
    flushAudio.currentTime = 0;
    flushAudio.play().catch(() => {});
  };

  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  const scrim = document.getElementById('mobile-scrim');
  const closeMenu = () => {
    menu?.classList.remove('mobile-open');
    scrim?.classList.remove('visible');
    document.body.style.overflow = '';
    if (toggle) {
      toggle.setAttribute('aria-label', 'Open mobile menu');
      toggle.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) window.lucide.createIcons();
    }
  };
  toggle?.addEventListener('click', () => {
    const open = menu?.classList.toggle('mobile-open');
    scrim?.classList.toggle('visible', Boolean(open));
    document.body.style.overflow = open ? 'hidden' : '';
    toggle.setAttribute('aria-label', open ? 'Close mobile menu' : 'Open mobile menu');
    toggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });
  scrim?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  const revealItems = document.querySelectorAll('.cinematic-reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { rootMargin: '0px 0px -48px 0px', threshold: 0.04 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  const navbar = document.getElementById('navbar');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      navbar?.classList.toggle('navbar-scrolled', window.scrollY > 80);
      ticking = false;
    });
  }, { passive: true });

  const form = document.getElementById('portfolio-contact-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('.btn-red-submit');
    const status = document.getElementById('contact-form-status');
    if (!button || button.disabled) return;

    const originalButton = button.innerHTML;
    const payload = new URLSearchParams(new FormData(form));
    payload.set('_subject', `Portfolio message: ${payload.get('subject') || 'New contact'}`);
    payload.set('_replyto', payload.get('email') || '');
    button.disabled = true;
    button.textContent = 'Sending…';
    if (status) status.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });
      const result = await response.json();
      if (!response.ok || (result.success !== 'true' && result.success !== true)) {
        throw new Error(result.message || 'The message could not be sent.');
      }
      form.reset();
      button.textContent = '✓ Message sent';
      button.style.backgroundColor = '#16a34a';
      if (status) status.textContent = 'Thanks — your message was submitted.';
    } catch (error) {
      button.textContent = 'Could not send';
      if (status) status.textContent = 'Please try again or email dibyajit2002das@gmail.com directly.';
    } finally {
      window.setTimeout(() => {
        button.innerHTML = originalButton;
        button.disabled = false;
        button.style.backgroundColor = '';
      }, 3500);
    }
  });

  const backdrop = document.getElementById('studio-backdrop');
  const switcher = document.getElementById('studio-view-switch');
  switcher?.addEventListener('click', () => {
    backdrop.dataset.scene = backdrop.dataset.scene === 'desk' ? 'room' : 'desk';
    switcher.classList.toggle('is-room-view', backdrop.dataset.scene === 'room');
  });

  const toiletCoder = document.getElementById('toilet-coder-sound');
  let lastFartAt = -Infinity;
  toiletCoder?.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch' || soundContext?.state !== 'running') return;
    const now = performance.now();
    if (now - lastFartAt < 1400) return;
    lastFartAt = now;
    playFartSound();
  });
  toiletCoder?.addEventListener('click', playFlushSound);

  const chibi = document.getElementById('chibi-interactive');
  const avatar = document.getElementById('chibi-avatar');
  if (chibi && avatar) {
    let gazeFrame = 0;
    let angryTimer;
    let angryGeneration = 0;
    const angrySprite = new Image();
    angrySprite.src = avatar.dataset.angrySrc;
    const moveEyes = event => {
      if (chibi.classList.contains('is-angry') || gazeFrame) return;
      gazeFrame = requestAnimationFrame(() => {
        gazeFrame = 0;
        const rect = chibi.getBoundingClientRect();
        const maxX = Math.min(60, rect.width * .15);
        const maxY = Math.min(34, rect.height * .09);
        const x = ((event.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * maxX;
        const y = ((event.clientY - (rect.top + rect.height * .43)) / (window.innerHeight / 2)) * maxY;
        chibi.style.setProperty('--gaze-x', `${Math.max(-maxX, Math.min(maxX, x)).toFixed(1)}px`);
        chibi.style.setProperty('--gaze-y', `${Math.max(-maxY, Math.min(maxY, y)).toFixed(1)}px`);
      });
    };
    window.addEventListener('pointermove', moveEyes, { passive:true });
    window.addEventListener('pointerleave', () => {
      chibi.style.setProperty('--gaze-x', '0px');
      chibi.style.setProperty('--gaze-y', '0px');
    });

    chibi.addEventListener('click', () => {
      window.clearTimeout(angryTimer);
      const generation = ++angryGeneration;
      chibi.classList.add('is-angry');
      chibi.setAttribute('aria-pressed', 'true');
      chibi.setAttribute('aria-label', "Dibyajit's chibi is angry");
      const startResetTimer = () => {
        if (generation !== angryGeneration) return;
        angryTimer = window.setTimeout(() => {
          if (generation !== angryGeneration) return;
          chibi.classList.remove('is-angry');
          chibi.setAttribute('aria-pressed', 'false');
          chibi.setAttribute('aria-label', "Make Dibyajit's chibi angry");
          avatar.src = avatar.dataset.normalSrc;
        }, 1100);
      };
      if (angrySprite.complete && angrySprite.naturalWidth > 0) {
        avatar.src = angrySprite.src;
        startResetTimer();
      } else {
        avatar.addEventListener('load', startResetTimer, { once:true });
        avatar.addEventListener('error', startResetTimer, { once:true });
        avatar.src = angrySprite.src;
      }
    });
  }
});
