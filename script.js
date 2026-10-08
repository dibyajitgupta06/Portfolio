// Dibyajit Das Gupta — Professional Interactive Portfolio Script

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────────────────────────────────
  // 1. LUCIDE ICON INIT
  // ─────────────────────────────────────────────────────────────────────────
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 1b. MOBILE HAMBURGER MENU
  // ─────────────────────────────────────────────────────────────────────────
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const mobileScrim = document.getElementById('mobile-scrim');

  function openMobileMenu() {
    navMenu.classList.add('mobile-open');
    if (mobileScrim) mobileScrim.classList.add('visible');
    document.body.style.overflow = 'hidden';
    if (mobileToggle) {
      mobileToggle.innerHTML = '<i data-lucide="x"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  function closeMobileMenu() {
    navMenu.classList.remove('mobile-open');
    if (mobileScrim) mobileScrim.classList.remove('visible');
    document.body.style.overflow = '';
    if (mobileToggle) {
      mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.contains('mobile-open') ? closeMobileMenu() : openMobileMenu();
    });
  }

  if (mobileScrim) {
    mobileScrim.addEventListener('click', closeMobileMenu);
  }

  // Close drawer on any nav link tap
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMobileMenu();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 2. DEVICE CAPABILITY
  // ─────────────────────────────────────────────────────────────────────────
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ─────────────────────────────────────────────────────────────────────────
  // 3. CINEMATIC 3D SCROLL & PARALLAX ENGINE FOR IMAGES & CARDS
  // ─────────────────────────────────────────────────────────────────────────
  const progressBar = document.getElementById('cinematic-progress');
  const cinematicSlides = document.querySelectorAll('.canva-slide');
  const heroCutout = document.querySelector('.hero-full-cutout-img');
  const heroStage = document.querySelector('.hero-stage');

  // Mouse & touch tracking variables for 3D hero cutout rotation only
  let heroPointerRotX = 0, heroPointerRotY = 0;

  if (heroStage && heroCutout) {
    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      heroPointerRotY = dx * 10;
      heroPointerRotX = dy * -8;
      updateCinematicScroll();
    });

    heroStage.addEventListener('mouseleave', () => {
      heroPointerRotX = 0;
      heroPointerRotY = 0;
      updateCinematicScroll();
    });

    // Touch interaction for phone
    heroStage.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = heroStage.getBoundingClientRect();
      const dx = (touch.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (touch.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      heroPointerRotY = Math.max(-8, Math.min(8, dx * 8));
      heroPointerRotX = Math.max(-6, Math.min(6, dy * -6));
      updateCinematicScroll();
    }, { passive: true });

    heroStage.addEventListener('touchend', () => {
      heroPointerRotX = 0;
      heroPointerRotY = 0;
      updateCinematicScroll();
    });
  }

  function updateCinematicScroll() {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;

    // Top progress bar
    if (totalScroll > 0 && progressBar) {
      progressBar.style.width = `${(currentScroll / totalScroll) * 100}%`;
    }

    const viewCenter = window.innerHeight / 2;

    // Frame scrubbing (video-like) on slides
    cinematicSlides.forEach(slide => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.top + rect.height / 2;
      const dist = slideCenter - viewCenter;
      const norm = Math.max(-1, Math.min(1, dist / (window.innerHeight * 0.85)));

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const content = slide.querySelector('.canva-slide-content, .hero-stage');
        if (content && slide.id !== 'hero') {
          const scale = 1 - Math.abs(norm) * 0.035;
          const opacity = 1 - Math.abs(norm) * 0.16;
          content.style.transform = `scale(${scale}) translate3d(0, ${norm * -12}px, 0)`;
          content.style.opacity = Math.max(0.75, opacity);
        }
      }
    });

    // ─────────────────────────────────────────────────────────────────
    // 3D HERO CUTOUT TRANSFORMATION ON SCROLL
    // ─────────────────────────────────────────────────────────────────
    if (heroCutout && heroStage) {
      const heroRect = heroStage.getBoundingClientRect();
      if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
        const scrollFraction = Math.max(0, Math.min(1, currentScroll / (window.innerHeight * 0.85)));
        const rotX = scrollFraction * 16 + heroPointerRotX;
        const rotY = Math.sin(scrollFraction * Math.PI) * -5 + heroPointerRotY;
        const transZ = scrollFraction * 60;
        const transY = currentScroll * -0.20;
        const scale = 1 + scrollFraction * 0.05;

        heroCutout.style.transform = `
          perspective(1200px)
          translate3d(0, ${transY}px, ${transZ}px)
          rotateX(${rotX}deg)
          rotateY(${rotY}deg)
          scale3d(${scale}, ${scale}, ${scale})
        `;
        heroCutout.style.filter = `
          drop-shadow(0px ${25 + scrollFraction * 35}px ${45 + scrollFraction * 25}px rgba(0, 0, 0, ${0.32 + scrollFraction * 0.15}))
          drop-shadow(0px 0px ${20 + scrollFraction * 25}px rgba(var(--red-rgb), ${0.2 + scrollFraction * 0.2}))
        `;
      }
    }


    // ─────────────────────────────────────────────────────────────────
    // 3D CARDS PITCH TILT ON SCROLL
    // ─────────────────────────────────────────────────────────────────
    document.querySelectorAll('.glass-card, .exp-role-card, .project-card-editorial, .timeline-item').forEach(card => {
      if (!card.matches(':hover') && !card.classList.contains('touch-active') && !card.classList.contains('hero-status-hud')) {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const norm = (rect.top + rect.height / 2 - viewCenter) / (window.innerHeight * 0.7);
          const pitchX = Math.max(-5, Math.min(5, norm * 6));
          card.style.transform = `perspective(900px) rotateX(${pitchX}deg)`;
        }
      }
    });
  }

  window.addEventListener('scroll', updateCinematicScroll, { passive: true });
  updateCinematicScroll();

  // ─────────────────────────────────────────────────────────────────────────
  // 5. ACTIVE NAV LINK TRACKING (IntersectionObserver per section)
  // ─────────────────────────────────────────────────────────────────────────
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  document.querySelectorAll('.canva-slide[id]').forEach(section => {
    sectionObserver.observe(section);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 6. STAGGERED CINEMATIC REVEAL (IntersectionObserver)
  // ─────────────────────────────────────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger children
        const children = entry.target.querySelectorAll('.stagger-child');
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 90}ms`;
          child.classList.add('visible');
        });
      }
    });
  }, { root: null, rootMargin: '0px 0px -70px 0px', threshold: 0.08 });

  document.querySelectorAll('.cinematic-reveal').forEach((el, i) => {
    revealObserver.observe(el);
  });

  // Also observe directional reveal elements
  document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // Auto-assign stagger delays to grid card children inside parent sections
  document.querySelectorAll('.exp-full-grid, .projects-editorial-grid, .achieve-editorial-grid, .about-highlights-grid, .domain-tags-wrap').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.setProperty('--stagger-i', i);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 7. 3D CARD TILT & INTERACTIVE SPOTLIGHT GLARE (Mouse & Mobile Touch)
  // ─────────────────────────────────────────────────────────────────────────
  const interactiveCards = document.querySelectorAll(
    '.glass-card, .exp-role-card, .project-card-editorial, .academic-badge-card, .skills-domain-card, .contact-form-column, .tech-matrix-card, .timeline-item, .hero-status-hud'
  );

  interactiveCards.forEach(card => {
    // Mouse Interaction
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      card.style.setProperty('--card-mouse-x', `${mouseX}px`);
      card.style.setProperty('--card-mouse-y', `${mouseY}px`);

      if (!isTouchDevice) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (mouseX - cx) / cx;
        const dy = (mouseY - cy) / cy;
        const rotX = dy * -5.5;
        const rotY = dx * 5.5;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.boxShadow = `${-dx * 10}px ${-dy * 10}px 36px rgba(var(--red-rgb), 0.12), var(--shadow-card)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    // Mobile Touch Interaction
    card.addEventListener('touchstart', (e) => {
      card.classList.add('touch-active');
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--card-mouse-x', `${touch.clientX - rect.left}px`);
      card.style.setProperty('--card-mouse-y', `${touch.clientY - rect.top}px`);
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      card.style.setProperty('--card-mouse-x', `${touchX}px`);
      card.style.setProperty('--card-mouse-y', `${touchY}px`);

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (touchX - cx) / cx;
      const dy = (touchY - cy) / cy;
      const rotX = Math.max(-4, Math.min(4, dy * -4));
      const rotY = Math.max(-4, Math.min(4, dx * 4));
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(0.99)`;
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.classList.remove('touch-active');
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 8. MAGNETIC BUTTON EFFECT (red pills, HUD chip & submit)
  // ─────────────────────────────────────────────────────────────────────────
  if (!isTouchDevice) {
    document.querySelectorAll('.contact-red-pill, .btn-red-submit, .hero-status-hud').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px) scale(1.04)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 9. TYPED TEXT ANIMATION (hero subtitle cycling)
  // ─────────────────────────────────────────────────────────────────────────
  const typedEl = document.getElementById('typed-roles');
  if (typedEl) {
    const roles = [
      'ML Researcher',
      'Full-Stack Engineer',
      'VANET Specialist',
      'IIT Bombay Finalist',
      'Open-Source Contributor',
      'Cloud & IoT Enthusiast'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeLoop() {
      const current = roles[roleIdx];
      if (!isDeleting) {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          isDeleting = true;
          typingSpeed = 2200; // pause at end
        } else {
          typingSpeed = 75;
        }
      } else {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 38;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, typingSpeed);
    }
    typeLoop();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 10. SECTION TITLE UNDERLINE DRAW ON SCROLL
  // ─────────────────────────────────────────────────────────────────────────
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('title-drawn');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.slide-giant-red-title, .skill-cat-title, .domain-card-title').forEach(el => {
    titleObserver.observe(el);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 11. HOVER LINE SWEEP on nav-link
  // ─────────────────────────────────────────────────────────────────────────
  // Handled in CSS with ::after pseudo-element

  // ─────────────────────────────────────────────────────────────────────────
  // 12. DOMAIN TAG PILL HOVER RIPPLE & CATEGORY CONNECTION
  // ─────────────────────────────────────────────────────────────────────────
  const skillCategoryBlocks = document.querySelectorAll('.skill-category-block');
  document.querySelectorAll('.domain-tag-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.className = 'pill-ripple';
      const rect = pill.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      pill.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      // Interactive category glow connection
      const text = pill.textContent.toLowerCase();
      skillCategoryBlocks.forEach(block => {
        const blockText = block.textContent.toLowerCase();
        const keywords = text.split('&').map(k => k.trim());
        if (keywords.some(kw => blockText.includes(kw))) {
          block.classList.add('category-highlight');
          setTimeout(() => block.classList.remove('category-highlight'), 1800);
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 13. THEME SWITCHER
  // ─────────────────────────────────────────────────────────────────────────
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
      const current = htmlElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 14. CONTACT FORM
  // ─────────────────────────────────────────────────────────────────────────
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const submitBtn = contactForm.querySelector('.btn-red-submit');
      if (submitBtn) {
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = '#16a34a';
        setTimeout(() => {
          submitBtn.textContent = 'Send Message';
          submitBtn.style.background = '';
        }, 3500);
      }
      contactForm.reset();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 15. NAVBAR GLASS BLUR ON SCROLL + HIDE/SHOW
  // ─────────────────────────────────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (navbar) {
      if (currentY > 80) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
      if (currentY > lastScrollY + 8 && currentY > 200) {
        navbar.classList.add('navbar-hidden');
      } else if (currentY < lastScrollY - 4) {
        navbar.classList.remove('navbar-hidden');
      }
    }
    lastScrollY = currentY;
  }, { passive: true });

  // ─────────────────────────────────────────────────────────────────────────
  // 16. HERO HEADLINE LETTER SPLIT ANIMATION
  // ─────────────────────────────────────────────────────────────────────────
  document.querySelectorAll('.split-letters').forEach(el => {
    const text = el.textContent;
    el.innerHTML = text.split('').map((ch, i) =>
      `<span class="letter-span" style="--li:${i}">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
    setTimeout(() => el.classList.add('letters-visible'), 100);
  });

  // ─────────────────────────────────────────────────────────────────────────
  
});
