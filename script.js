// Dibyajit Das Gupta — Personal Portfolio Interactivity Script (Awwwards Edition)

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

  // --- 3. Live Dhaka Time Widget (GMT+6) ---
  function updateDhakaClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    try {
      const dhakaTimeStr = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      clockEl.textContent = `DHAKA ${dhakaTimeStr} GMT+6`;
    } catch (e) {
      clockEl.textContent = `DHAKA 16:00:00 GMT+6`;
    }
  }
  setInterval(updateDhakaClock, 1000);
  updateDhakaClock();

  // --- 4. Custom Cursor & Ambient Spotlight Lerp ---
  const cursorDot = document.getElementById('cursor-dot');
  const cursorFollower = document.getElementById('cursor-follower');
  const cursorText = document.getElementById('cursor-text');
  const ambientSpotlight = document.getElementById('ambient-spotlight');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      if (ambientSpotlight) {
        ambientSpotlight.style.left = `${mouseX}px`;
        ambientSpotlight.style.top = `${mouseY}px`;
      }
    });

    function animateCursor() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      if (cursorFollower) {
        cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      }

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Interactive Hover Listeners for Cursor State
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, .magnetic-target, .timeline-header, .filter-btn, [data-cursor], .glass-card, .project-card'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        const text = el.getAttribute('data-cursor');
        if (cursorFollower) {
          cursorFollower.classList.add('hovering');
          if (text) {
            cursorFollower.classList.add('has-text');
            if (cursorText) cursorText.textContent = text;
          }
        }
        if (cursorDot) cursorDot.classList.add('hovering');
        playSound('hover');
      });

      el.addEventListener('mouseleave', () => {
        if (cursorFollower) {
          cursorFollower.classList.remove('hovering', 'has-text');
          if (cursorText) cursorText.textContent = '';
        }
        if (cursorDot) cursorDot.classList.remove('hovering');
      });

      el.addEventListener('click', () => {
        playSound('click');
      });
    });
  }

  // --- Scroll Parallax Floating Cutout Physics (Enhanced Scale & Drift) ---
  const parallaxImages = document.querySelectorAll('.scroll-parallax, .scroll-parallax-large');
  if (parallaxImages.length && !isTouchDevice) {
    window.addEventListener('scroll', () => {
      parallaxImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const isLarge = img.classList.contains('scroll-parallax-large');
          const speed = isLarge ? 0.09 : 0.05;
          const offsetY = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed;
          const scale = isLarge ? 1 + Math.abs(offsetY) * 0.0003 : 1;
          img.style.transform = `translate3d(0, ${offsetY}px, 0) scale(${scale})`;
        }
      });
    });
  }

  // --- 5. Magnetic Targets Pull Effect ---
  if (!isTouchDevice) {
    const magneticTargets = document.querySelectorAll('.magnetic-target');
    magneticTargets.forEach(target => {
      target.addEventListener('mousemove', (e) => {
        const rect = target.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;

        target.style.transform = `translate3d(${relX * 0.22}px, ${relY * 0.22}px, 0)`;
      });

      target.addEventListener('mouseleave', () => {
        target.style.transform = 'translate3d(0px, 0px, 0)';
        target.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        setTimeout(() => {
          target.style.transition = '';
        }, 400);
      });
    });
  }

  // --- 6. 3D Tilt Interaction ---
  if (!isTouchDevice) {
    const tiltCards = document.querySelectorAll('.glass-card, .project-card, .avatar-wrapper, .bento-item');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const cardRect = card.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;

        const relX = e.clientX - cardRect.left - cardWidth / 2;
        const relY = e.clientY - cardRect.top - cardHeight / 2;

        const rotateX = -(relY / (cardHeight / 2)) * 5;
        const rotateY = (relX / (cardWidth / 2)) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
        card.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(6, 182, 212, 0.15)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  // --- 7. Theme Switcher Handler (Minimal Icon Toggle Button) ---
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

  // --- 8. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // --- 9. Navbar Shrink on Scroll ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('shrunk');
      } else {
        navbar.classList.remove('shrunk');
      }
    });
  }

  // --- 10. Experience Timeline Accordion ---
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    // First experience opened by default
    if (index === 0) {
      item.classList.add('expanded');
    }

    const header = item.querySelector('.timeline-header');
    if (header) {
      header.addEventListener('click', () => {
        const isExpanded = item.classList.contains('expanded');

        // Toggle current accordion
        if (isExpanded) {
          item.classList.remove('expanded');
        } else {
          // Collapse others for clean accordion feel
          timelineItems.forEach(other => other.classList.remove('expanded'));
          item.classList.add('expanded');
        }
      });
    }
  });

  // --- 11. Typing Role Animation ---
  const typedTextSpan = document.getElementById('typed-text');
  const roles = [
    'Full-Stack Software Engineer',
    'AI & Data Analytics Specialist',
    'Cybersecurity Developer',
    'B.Tech CSE @ NIT Sikkim'
  ];
  const typingSpeed = 90;
  const erasingSpeed = 45;
  const newRoleDelay = 2200;
  let roleIndex = 0;
  let charIndex = 0;

  function type() {
    if (!typedTextSpan) return;
    if (charIndex < roles[roleIndex].length) {
      typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, newRoleDelay);
    }
  }

  function erase() {
    if (!typedTextSpan) return;
    if (charIndex > 0) {
      typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, typingSpeed + 400);
    }
  }

  if (typedTextSpan) {
    setTimeout(type, 800);
  }

  // --- 12. Project Filtering Logic ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories') || '';

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- 13. Intersection Observer Scroll Reveal ---
  const revealElements = document.querySelectorAll(
    '.section-header, .bento-item, .skill-category, .timeline-item, .project-card, .ach-card, .contact-card'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('scroll-reveal');
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // --- 14. Contact Form Submission Handler ---
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitButton = document.getElementById('form-submit');

  if (contactForm && submitButton) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const originalContent = submitButton.innerHTML;
      submitButton.innerHTML = '<i data-lucide="loader-2" class="spin-icon"></i> Transmitting...';
      submitButton.style.pointerEvents = 'none';
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        submitButton.innerHTML = '<i data-lucide="check-circle-2"></i> Message Sent!';
        submitButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        if (typeof lucide !== 'undefined') lucide.createIcons();
        contactForm.reset();

        setTimeout(() => {
          submitButton.innerHTML = originalContent;
          submitButton.style.background = '';
          submitButton.style.pointerEvents = 'auto';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 3500);
      }, 1400);
    });
  // --- 15. Avatar Image Mode Switcher (Formal vs Casual) ---
  const avatarModeBtns = document.querySelectorAll('.avatar-mode-btn');
  const heroAvatarImg = document.getElementById('hero-avatar-img');

  if (avatarModeBtns.length && heroAvatarImg) {
    avatarModeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        avatarModeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const newImgSrc = btn.getAttribute('data-img');
        if (newImgSrc) {
          heroAvatarImg.style.opacity = '0.3';
          heroAvatarImg.style.transform = 'scale(0.96)';

          setTimeout(() => {
            heroAvatarImg.src = newImgSrc;
            heroAvatarImg.style.opacity = '1';
            heroAvatarImg.style.transform = 'scale(1)';
          }, 200);
        }
      });
    });
  }

});
