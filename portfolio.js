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
  const playPlopSound = () => {
    const context = getSoundContext();
    if (!context) return;
    const now = context.currentTime;
    const tone = context.createOscillator();
    const toneGain = context.createGain();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(155, now);
    tone.frequency.exponentialRampToValueAtTime(48, now + .2);
    toneGain.gain.setValueAtTime(.0001, now);
    toneGain.gain.exponentialRampToValueAtTime(.24, now + .012);
    toneGain.gain.exponentialRampToValueAtTime(.0001, now + .24);
    tone.connect(toneGain).connect(context.destination);
    tone.start(now);
    tone.stop(now + .25);

    const splat = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const splatGain = context.createGain();
    splat.buffer = getNoiseBuffer(context);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, now);
    splatGain.gain.setValueAtTime(.0001, now);
    splatGain.gain.exponentialRampToValueAtTime(.11, now + .008);
    splatGain.gain.exponentialRampToValueAtTime(.0001, now + .16);
    splat.connect(filter).connect(splatGain).connect(context.destination);
    splat.start(now);
    splat.stop(now + .17);
  };
  const playFlushSound = () => {
    const context = getSoundContext();
    if (!context) return;
    const now = context.currentTime;
    const water = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const waterGain = context.createGain();
    water.buffer = getNoiseBuffer(context);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.frequency.exponentialRampToValueAtTime(330, now + 1.7);
    waterGain.gain.setValueAtTime(.0001, now);
    waterGain.gain.exponentialRampToValueAtTime(.2, now + .08);
    waterGain.gain.setValueAtTime(.17, now + .42);
    waterGain.gain.exponentialRampToValueAtTime(.0001, now + 1.75);
    water.connect(filter).connect(waterGain).connect(context.destination);
    water.start(now);
    water.stop(now + 1.8);

    [.18, .55, .92, 1.22].forEach((delay, index) => {
      const bubble = context.createOscillator();
      const bubbleGain = context.createGain();
      const start = now + delay;
      bubble.type = 'sine';
      bubble.frequency.setValueAtTime(190 - index * 18, start);
      bubble.frequency.exponentialRampToValueAtTime(62 - index * 5, start + .2);
      bubbleGain.gain.setValueAtTime(.0001, start);
      bubbleGain.gain.exponentialRampToValueAtTime(.12, start + .018);
      bubbleGain.gain.exponentialRampToValueAtTime(.0001, start + .24);
      bubble.connect(bubbleGain).connect(context.destination);
      bubble.start(start);
      bubble.stop(start + .25);
    });
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
  let lastScrollPlopAt = -Infinity;
  window.addEventListener('scroll', () => {
    const now = performance.now();
    if (now - lastScrollPlopAt >= 2400) {
      lastScrollPlopAt = now;
      playPlopSound();
    }
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      navbar?.classList.toggle('navbar-scrolled', window.scrollY > 80);
      ticking = false;
    });
  }, { passive: true });

  const form = document.getElementById('portfolio-contact-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const button = form.querySelector('.btn-red-submit');
    if (!button) return;
    button.textContent = '✓ Message Sent!';
    button.style.backgroundColor = '#16a34a';
    form.reset();
    window.setTimeout(() => {
      button.textContent = 'Send Message';
      button.style.backgroundColor = '';
    }, 3500);
  });

  const backdrop = document.getElementById('studio-backdrop');
  const switcher = document.getElementById('studio-view-switch');
  switcher?.addEventListener('click', () => {
    backdrop.dataset.scene = backdrop.dataset.scene === 'desk' ? 'room' : 'desk';
    switcher.classList.toggle('is-room-view', backdrop.dataset.scene === 'room');
  });

  document.getElementById('toilet-coder-sound')?.addEventListener('click', playFlushSound);

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
        const x = ((event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2)) * 4.5;
        const y = ((event.clientY - (rect.top + rect.height * .43)) / (window.innerHeight / 2)) * 1.3;
        chibi.style.setProperty('--gaze-x', `${Math.max(-4.5, Math.min(4.5, x)).toFixed(1)}px`);
        chibi.style.setProperty('--gaze-y', `${Math.max(-1.3, Math.min(1.3, y)).toFixed(1)}px`);
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
