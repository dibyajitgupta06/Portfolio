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

  // Mouse & touch tracking variables for 3D hero cutout & orbitals
  let heroPointerRotX = 0, heroPointerRotY = 0;
  let heroPointerDx = 0, heroPointerDy = 0;

  if (heroStage && heroCutout) {
    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      heroPointerDx = dx;
      heroPointerDy = dy;
      heroPointerRotY = dx * 10;
      heroPointerRotX = dy * -8;
      updateCinematicScroll();
    });

    heroStage.addEventListener('mouseleave', () => {
      heroPointerRotX = 0;
      heroPointerRotY = 0;
      heroPointerDx = 0;
      heroPointerDy = 0;
      updateCinematicScroll();
    });

    // Touch interaction for phone
    heroStage.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      const rect = heroStage.getBoundingClientRect();
      const dx = (touch.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (touch.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      heroPointerDx = dx;
      heroPointerDy = dy;
      heroPointerRotY = Math.max(-8, Math.min(8, dx * 8));
      heroPointerRotX = Math.max(-6, Math.min(6, dy * -6));
      updateCinematicScroll();
    }, { passive: true });

    heroStage.addEventListener('touchend', () => {
      heroPointerRotX = 0;
      heroPointerRotY = 0;
      heroPointerDx = 0;
      heroPointerDy = 0;
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
    // 3D FLOATING GLASS ORBITALS ON SCROLL & POINTER
    // ─────────────────────────────────────────────────────────────────
    const orbitals = document.querySelectorAll('.hero-orbital-card');
    if (orbitals.length > 0) {
      const scrollFactor = Math.min(1.2, currentScroll / (window.innerHeight * 0.75));
      orbitals.forEach(card => {
        if (!card.matches(':hover') && !card.classList.contains('touch-active')) {
          const depth = parseFloat(card.getAttribute('data-depth')) || 1.6;
          let spreadX = 0, spreadY = 0;
          if (card.classList.contains('orbital-tl')) {
            spreadX = -scrollFactor * depth * 75 + heroPointerDx * depth * 14;
            spreadY = -scrollFactor * depth * 55 + heroPointerDy * depth * 12;
          } else if (card.classList.contains('orbital-tr')) {
            spreadX = scrollFactor * depth * 75 + heroPointerDx * depth * 14;
            spreadY = -scrollFactor * depth * 55 + heroPointerDy * depth * 12;
          } else if (card.classList.contains('orbital-bl')) {
            spreadX = -scrollFactor * depth * 65 + heroPointerDx * depth * 14;
            spreadY = scrollFactor * depth * 45 + heroPointerDy * depth * 12;
          } else if (card.classList.contains('orbital-br')) {
            spreadX = scrollFactor * depth * 65 + heroPointerDx * depth * 14;
            spreadY = scrollFactor * depth * 45 + heroPointerDy * depth * 12;
          }
          const transZ = scrollFactor * depth * 120;
          const rotX = heroPointerDy * -6;
          const rotY = heroPointerDx * 6;
          const opacity = Math.max(0, 1 - scrollFactor * 1.5);
          card.style.transform = `perspective(1000px) translate3d(${spreadX}px, ${spreadY}px, ${transZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
          card.style.opacity = opacity;
        }
      });
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
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
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
  // 17. HARDWARE-ACCELERATED THREE.JS 3D HERO ARCHITECTURAL CORE
  // ─────────────────────────────────────────────────────────────────────────
  function initHero3D() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('hero-3d-canvas');
    const wrap = document.getElementById('hero-3d-wrap');
    if (!canvas || !wrap) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.z = 8.8;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);

    // Geometry Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const isDarkTheme = () => document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.classList.contains('dark');

    // 1. Concentric Gyroscopic Rings (Precision Toruses)
    const ringGeo1 = new THREE.TorusGeometry(3.6, 0.035, 16, 120);
    const ringGeo2 = new THREE.TorusGeometry(2.85, 0.04, 16, 100);
    const ringGeo3 = new THREE.TorusGeometry(2.15, 0.03, 16, 80);

    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xff2b2b,
      metalness: 0.9,
      roughness: 0.2
    });
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: isDarkTheme() ? 0x71717a : 0x27272a,
      metalness: 0.85,
      roughness: 0.3
    });
    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0xff2b2b,
      metalness: 0.9,
      roughness: 0.2
    });

    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    const ringMesh3 = new THREE.Mesh(ringGeo3, ringMat3);

    ringMesh2.rotation.x = Math.PI / 4;
    ringMesh3.rotation.y = Math.PI / 3;

    coreGroup.add(ringMesh1);
    coreGroup.add(ringMesh2);
    coreGroup.add(ringMesh3);

    // 2. Central Floating Icosahedron Crystal
    const icoGeo = new THREE.IcosahedronGeometry(1.35, 0);
    const icoEdges = new THREE.EdgesGeometry(icoGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: isDarkTheme() ? 0xff4d4d : 0x18181b,
      linewidth: 1.5,
      transparent: true,
      opacity: isDarkTheme() ? 0.8 : 0.6
    });
    const icoWireframe = new THREE.LineSegments(icoEdges, edgeMat);

    const icoFacetMat = new THREE.MeshPhysicalMaterial({
      color: isDarkTheme() ? 0x180505 : 0xffffff,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: isDarkTheme() ? 0.6 : 0.4
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoFacetMat);

    coreGroup.add(icoWireframe);
    coreGroup.add(icoMesh);

    // 3. Orbiting Satellite Nodes (Octahedrons)
    const satGroup = new THREE.Group();
    coreGroup.add(satGroup);
    const satCount = 4;
    const satellites = [];
    const satGeo = new THREE.OctahedronGeometry(0.2, 0);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xff2b2b,
      metalness: 0.9,
      roughness: 0.1
    });

    for (let i = 0; i < satCount; i++) {
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satellites.push({
        mesh: satMesh,
        angle: (i / satCount) * Math.PI * 2,
        radius: 2.6,
        speed: 0.015 * (i % 2 === 0 ? 1 : -1)
      });
      satGroup.add(satMesh);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkTheme() ? 0.7 : 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xff2b2b, isDarkTheme() ? 3.5 : 2.0, 15);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Drag & Touch Interaction
    let isDragging = false;
    let prevMouseX = 0, prevMouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    let rotX = 0, rotY = 0;
    let autoRotY = 0;

    function onPointerDown(clientX, clientY) {
      isDragging = true;
      prevMouseX = clientX;
      prevMouseY = clientY;
    }

    function onPointerMove(clientX, clientY) {
      if (!isDragging) return;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      targetRotY += deltaX * 0.007;
      targetRotX += deltaY * 0.007;
      prevMouseX = clientX;
      prevMouseY = clientY;
    }

    function onPointerUp() {
      isDragging = false;
    }

    wrap.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onPointerUp);

    wrap.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    wrap.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    wrap.addEventListener('touchend', onPointerUp);

    // Theme Update
    window.addEventListener('theme-changed', () => {
      const dark = isDarkTheme();
      edgeMat.color.setHex(dark ? 0xff4d4d : 0x18181b);
      edgeMat.opacity = dark ? 0.8 : 0.6;
      icoFacetMat.color.setHex(dark ? 0x180505 : 0xffffff);
      ringMat2.color.setHex(dark ? 0x71717a : 0x27272a);
      ambientLight.intensity = dark ? 0.7 : 1.2;
      pointLight.intensity = dark ? 3.5 : 2.0;
    });

    // Resize
    function handleResize() {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);

    // Observer
    let isHeroVisible = true;
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    }

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      if (!isHeroVisible) return;

      if (!isDragging) {
        autoRotY += 0.004;
      }

      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;

      coreGroup.rotation.y = autoRotY + rotY;
      coreGroup.rotation.x = rotX;

      ringMesh1.rotation.z += 0.003;
      ringMesh2.rotation.x += 0.006;
      ringMesh3.rotation.y += 0.005;

      icoMesh.rotation.x -= 0.003;
      icoMesh.rotation.y += 0.004;
      icoWireframe.rotation.x -= 0.003;
      icoWireframe.rotation.y += 0.004;

      satellites.forEach(sat => {
        sat.angle += sat.speed;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.radius;
        sat.mesh.position.y = Math.sin(sat.angle * 2) * 0.5;
        sat.mesh.rotation.x += 0.02;
        sat.mesh.rotation.y += 0.02;
      });

      renderer.render(scene, camera);
    }
    animate();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 18. INTERACTIVE 3D SYSTEM ARCHITECTURE SHOWCASE (RESEARCH & BUILDS)
  // ─────────────────────────────────────────────────────────────────────────
  function initShowcase3D() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('showcase-3d-canvas');
    const wrap = document.querySelector('.showcase-viewport-wrap');
    if (!canvas || !wrap) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);

    // Root model groups
    const vanetGroup = new THREE.Group();
    const neuralGroup = new THREE.Group();
    const meshGroup = new THREE.Group();

    scene.add(vanetGroup);
    scene.add(neuralGroup);
    scene.add(meshGroup);

    neuralGroup.visible = false;
    meshGroup.visible = false;
    vanetGroup.visible = true;

    // Model 1: VANET Cryptographic Node
    const ddecGeo = new THREE.DodecahedronGeometry(1.6, 0);
    const ddecEdges = new THREE.EdgesGeometry(ddecGeo);
    const ddecEdgeMat = new THREE.LineBasicMaterial({ color: 0xff2b2b, linewidth: 2 });
    const ddecMesh = new THREE.LineSegments(ddecEdges, ddecEdgeMat);
    vanetGroup.add(ddecMesh);

    const ddecFillMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f23,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.35
    });
    vanetGroup.add(new THREE.Mesh(ddecGeo, ddecFillMat));

    const authRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.035, 16, 90),
      new THREE.MeshStandardMaterial({ color: 0xff2b2b, metalness: 0.95, roughness: 0.1 })
    );
    const authRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.03, 16, 80),
      new THREE.MeshStandardMaterial({ color: 0x71717a, metalness: 0.85, roughness: 0.2 })
    );
    authRing2.rotation.x = Math.PI / 2;
    vanetGroup.add(authRing1);
    vanetGroup.add(authRing2);

    const packetGeo = new THREE.TetrahedronGeometry(0.18, 0);
    const packetMat = new THREE.MeshStandardMaterial({ color: 0xff2b2b, roughness: 0.1 });
    const vanetPackets = [];
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(packetGeo, packetMat);
      vanetGroup.add(p);
      vanetPackets.push({ mesh: p, angle: (i / 6) * Math.PI * 2, radius: 2.7, speed: 0.02 * (i % 2 ? 1 : -1) });
    }

    // Model 2: Neural Tensor Core
    const icoTensorGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const icoTensorEdges = new THREE.EdgesGeometry(icoTensorGeo);
    const tensorEdgeMat = new THREE.LineBasicMaterial({ color: 0xff2b2b, transparent: true, opacity: 0.8 });
    const tensorMesh = new THREE.LineSegments(icoTensorEdges, tensorEdgeMat);
    neuralGroup.add(tensorMesh);

    const coreOcta = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.0, 0),
      new THREE.MeshPhysicalMaterial({ color: 0xff2b2b, metalness: 0.9, roughness: 0.1, transmission: 0.6, transparent: true, opacity: 0.7 })
    );
    neuralGroup.add(coreOcta);

    // Model 3: Enterprise Data Mesh (Torus Knot)
    const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.38, 100, 20, 2, 3);
    const knotEdges = new THREE.EdgesGeometry(knotGeo);
    const knotWire = new THREE.LineSegments(knotEdges, new THREE.LineBasicMaterial({ color: 0xff2b2b, transparent: true, opacity: 0.7 }));
    const knotMesh = new THREE.Mesh(knotGeo, new THREE.MeshStandardMaterial({ color: 0x1a1a20, metalness: 0.95, roughness: 0.2, transparent: true, opacity: 0.5 }));
    meshGroup.add(knotWire);
    meshGroup.add(knotMesh);

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(4, 6, 5);
    scene.add(dir);
    const pt = new THREE.PointLight(0xff2b2b, 3, 12);
    pt.position.set(0, 0, 0);
    scene.add(pt);

    // Active Model Manager
    let currentModelKey = 'vanet';
    const models = { vanet: vanetGroup, neural: neuralGroup, mesh: meshGroup };

    const modelInfoData = {
      vanet: {
        node: 'VANET NDN CRYPTO',
        heading: 'Certificateless Short Signature Scheme (VANETs • NDN)',
        desc: '3D cryptographic key-exchange node simulating lightweight bilinear pairings and signature verification in high-mobility vehicular networks with zero certificate overhead.'
      },
      neural: {
        node: 'NEURAL TENSOR (MEDFLOW)',
        heading: 'Neural Diagnostic Tensor Core (Healthcare AI)',
        desc: 'Interactive 3D tensor lattice powering conversational image recognition, feature extraction matrices, and dermatological computer vision classification.'
      },
      mesh: {
        node: 'ENTERPRISE MESH (SELISE)',
        heading: 'High-Concurrency Digital Workflow Mesh (SELISE)',
        desc: 'Distributed microservices architecture topological knot modeling low-code automated workflows, approval queues, and normalized database transactions.'
      }
    };

    const telemetryNode = document.getElementById('telemetry-node');
    const infoHeading = document.getElementById('model-info-heading');
    const infoDesc = document.getElementById('model-info-desc');
    const modelButtons = document.querySelectorAll('.model-select-btn');

    modelButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-model');
        if (key === currentModelKey || !models[key]) return;

        modelButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const oldGroup = models[currentModelKey];
        const newGroup = models[key];

        oldGroup.visible = false;
        newGroup.visible = true;
        newGroup.scale.set(0.4, 0.4, 0.4);

        let scale = 0.4;
        const popAnim = () => {
          scale += (1 - scale) * 0.16;
          newGroup.scale.set(scale, scale, scale);
          if (scale < 0.995) requestAnimationFrame(popAnim);
          else newGroup.scale.set(1, 1, 1);
        };
        popAnim();

        currentModelKey = key;
        const info = modelInfoData[key];
        if (telemetryNode) telemetryNode.textContent = info.node;
        if (infoHeading) infoHeading.textContent = info.heading;
        if (infoDesc) infoDesc.textContent = info.desc;
      });
    });

    // Orbit Drag & Zoom Interaction
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let rotX = 0.2, rotY = 0;
    let targetRotX = 0.2, targetRotY = 0;
    let autoY = 0;

    wrap.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      targetRotY += dx * 0.008;
      targetRotX += dy * 0.008;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    wrap.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    }, { passive: true });

    wrap.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - prevX;
        const dy = e.touches[0].clientY - prevY;
        targetRotY += dx * 0.008;
        targetRotX += dy * 0.008;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    }, { passive: true });

    wrap.addEventListener('touchend', () => { isDragging = false; });

    wrap.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.position.z = Math.max(4.2, Math.min(9.5, camera.position.z + e.deltaY * 0.004));
    }, { passive: false });

    function handleResize() {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);

    let isShowcaseVisible = true;
    const researchSection = document.getElementById('research-builds');
    if (researchSection) {
      const showcaseObserver = new IntersectionObserver((entries) => {
        isShowcaseVisible = entries[0].isIntersecting;
      }, { threshold: 0.05 });
      showcaseObserver.observe(researchSection);
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!isShowcaseVisible) return;

      if (!isDragging) {
        autoY += 0.005;
      }

      rotX += (targetRotX - rotX) * 0.08;
      rotY += (targetRotY - rotY) * 0.08;

      const activeGroup = models[currentModelKey];
      activeGroup.rotation.x = rotX;
      activeGroup.rotation.y = autoY + rotY;

      authRing1.rotation.y += 0.008;
      authRing2.rotation.z += 0.006;
      vanetPackets.forEach(p => {
        p.angle += p.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.radius;
        p.mesh.position.y = Math.sin(p.angle) * p.radius;
        p.mesh.position.z = Math.sin(p.angle * 2) * 0.6;
      });

      coreOcta.rotation.y += 0.01;
      coreOcta.rotation.x += 0.006;

      renderer.render(scene, camera);
    }
    animate();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 19. WELCOME SLIDE INTERACTIVE 3D MATRIX CATEGORY FILTER
  // ─────────────────────────────────────────────────────────────────────────
  function initWelcomeMatrix() {
    const tabBtns = document.querySelectorAll('.matrix-tab-btn');
    const pills = document.querySelectorAll('.matrix-pill.3d-pop');
    if (!tabBtns.length || !pills.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const pillar = btn.getAttribute('data-pillar');

        pills.forEach((pill) => {
          const cat = pill.getAttribute('data-cat');
          if (pillar === 'all' || cat === pillar) {
            pill.classList.remove('hidden-by-filter');
            pill.style.transform = 'scale(1)';
          } else {
            pill.classList.add('hidden-by-filter');
            pill.style.transform = 'scale(0.85)';
          }
        });
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INITIALIZE 3D MODULES
  // ─────────────────────────────────────────────────────────────────────────
  initHero3D();
  initShowcase3D();
  initWelcomeMatrix();
  if (typeof lucide !== 'undefined') lucide.createIcons();

});
