// Dibyajit Das Gupta — Personal Portfolio Interactivity & Cinematic Scroll Script

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Initialize Lucide Icons ---
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- 2. Web Audio Synthesizer (Click & Hover FX) ---
  let audioCtx = null;
  let soundEnabled = true;

  function playSound(type = 'click') {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.03);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (e) {
      // Ignore audio policy restrictions gracefully
    }
  }

  // Sound FX Toggle Button Handler
  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    const soundOnIcon = soundToggle.querySelector('.sound-on-icon');
    const soundOffIcon = soundToggle.querySelector('.sound-off-icon');

    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        if (soundOnIcon) soundOnIcon.style.display = 'inline-block';
        if (soundOffIcon) soundOffIcon.style.display = 'none';
        playSound('click');
      } else {
        if (soundOnIcon) soundOnIcon.style.display = 'none';
        if (soundOffIcon) soundOffIcon.style.display = 'inline-block';
      }
    });
  }

  // --- 3. Cinematic Video-Like Frame Scrubbing & Scroll Progress ---
  const progressBar = document.getElementById('cinematic-progress');
  const ambientSpotlight = document.getElementById('ambient-spotlight');
  const cinematicSlides = document.querySelectorAll('.canva-slide');

  function updateCinematicScroll() {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    
    // Top progress bar update
    if (totalScroll > 0 && progressBar) {
      const scrollPercentage = (currentScroll / totalScroll) * 100;
      progressBar.style.width = `${scrollPercentage}%`;
    }

    // Video Scrubbing Frame Effect for Slides & Parallax
    const viewCenter = window.innerHeight / 2;
    cinematicSlides.forEach(slide => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.top + rect.height / 2;
      const distanceFromCenter = slideCenter - viewCenter;
      const normalizedDist = distanceFromCenter / (window.innerHeight * 0.85);
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const content = slide.querySelector('.canva-slide-content, .hero-stage');
        if (content) {
          const clampedDist = Math.max(-1, Math.min(1, normalizedDist));
          const scale = 1 - Math.abs(clampedDist) * 0.05;
          const opacity = 1 - Math.abs(clampedDist) * 0.22;
          content.style.transform = `scale(${scale}) translate3d(0, ${clampedDist * -18}px, 0)`;
          content.style.opacity = Math.max(0.7, opacity);
        }
      }
    });

    // Parallax on Dibyajit's real photos
    document.querySelectorAll('.scroll-parallax, .scroll-parallax-large').forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const isLarge = img.classList.contains('scroll-parallax-large');
        const speed = isLarge ? 0.12 : 0.06;
        const offsetY = (viewCenter - (rect.top + rect.height / 2)) * speed;
        img.style.transform = `translate3d(0, ${offsetY}px, 0)`;
      }
    });
  }

  window.addEventListener('scroll', updateCinematicScroll, { passive: true });
  updateCinematicScroll();

  // IntersectionObserver for Reveal Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const cinematicObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.cinematic-reveal').forEach(el => {
    cinematicObserver.observe(el);
  });

  // Spotlight Follower Mouse Listener
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
      if (ambientSpotlight) {
        ambientSpotlight.style.left = `${e.clientX}px`;
        ambientSpotlight.style.top = `${e.clientY}px`;
      }
    });
  }

  // --- 5. Theme Switcher Handler (Minimal Icon Toggle Button) ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'light') {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
    } else {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
    }

    if (themeToggleBtn) {
      const moonIcon = themeToggleBtn.querySelector('.theme-moon-icon');
      const sunIcon = themeToggleBtn.querySelector('.theme-sun-icon');
      if (theme === 'light') {
        if (moonIcon) moonIcon.style.display = 'inline-block';
        if (sunIcon) sunIcon.style.display = 'none';
      } else {
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'inline-block';
      }
    }
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      playSound('click');
    });
  }

  // --- 6. Contact Form Submission Handler ---
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSound('click');
      const name = document.getElementById('name').value;
      alert(`Thank you ${name}! Your message has been received. I will get back to you shortly.`);
      contactForm.reset();
    });
  }

});
