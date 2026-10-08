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
  // 2. CUSTOM CURSOR RING
  // ─────────────────────────────────────────────────────────────────────────
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorRing);
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Smooth lag ring
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover expand on interactive elements
    document.querySelectorAll('a, button, .glass-card, .exp-role-card, .project-card-editorial, .contact-red-pill, .nav-link, .domain-tag-pill').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('expanded'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('expanded'));
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. AMBIENT SPOTLIGHT
  // ─────────────────────────────────────────────────────────────────────────
  const ambientSpotlight = document.getElementById('ambient-spotlight');
  if (!isTouchDevice && ambientSpotlight) {
    window.addEventListener('mousemove', (e) => {
      ambientSpotlight.style.left = `${e.clientX}px`;
      ambientSpotlight.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. CINEMATIC SCROLL PROGRESS + FRAME SCRUBBING + PARALLAX
  // ─────────────────────────────────────────────────────────────────────────
  const progressBar = document.getElementById('cinematic-progress');
  const cinematicSlides = document.querySelectorAll('.canva-slide');
  const sections = document.querySelectorAll('[data-section]');

  function updateCinematicScroll() {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;

    // Top progress bar
    if (totalScroll > 0 && progressBar) {
      progressBar.style.width = `${(currentScroll / totalScroll) * 100}%`;
    }

    // Frame scrubbing (video-like)
    const viewCenter = window.innerHeight / 2;
    cinematicSlides.forEach(slide => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.top + rect.height / 2;
      const dist = slideCenter - viewCenter;
      const norm = Math.max(-1, Math.min(1, dist / (window.innerHeight * 0.85)));

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const content = slide.querySelector('.canva-slide-content, .hero-stage');
        if (content) {
          const scale = 1 - Math.abs(norm) * 0.04;
          const opacity = 1 - Math.abs(norm) * 0.18;
          content.style.transform = `scale(${scale}) translate3d(0, ${norm * -14}px, 0)`;
          content.style.opacity = Math.max(0.72, opacity);
        }
      }
    });

    // Parallax on real photos
    document.querySelectorAll('.scroll-parallax, .scroll-parallax-large').forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = img.classList.contains('scroll-parallax-large') ? 0.10 : 0.055;
        const offsetY = (viewCenter - (rect.top + rect.height / 2)) * speed;
        img.style.transform = `translate3d(0, ${offsetY}px, 0)`;
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
  // 7. 3D CARD TILT ON MOUSE MOVE (glass cards)
  // ─────────────────────────────────────────────────────────────────────────
  if (!isTouchDevice) {
    document.querySelectorAll('.glass-card, .exp-role-card, .project-card-editorial, .academic-badge-card, .skills-domain-card, .contact-form-column').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotX = dy * -6;
        const rotY = dx * 6;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.025, 1.025, 1.025)`;
        card.style.boxShadow = `${-dx * 12}px ${-dy * 12}px 40px rgba(var(--red-rgb), 0.14), var(--shadow-card)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. MAGNETIC BUTTON EFFECT (red pills & submit)
  // ─────────────────────────────────────────────────────────────────────────
  if (!isTouchDevice) {
    document.querySelectorAll('.contact-red-pill, .btn-red-submit').forEach(btn => {
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
  // 12. DOMAIN TAG PILL HOVER RIPPLE
  // ─────────────────────────────────────────────────────────────────────────
  document.querySelectorAll('.domain-tag-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.className = 'pill-ripple';
      const rect = pill.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      pill.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
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
  // 17. INTERACTIVE CANVAS PARTICLE FIELD
  //     - Particles float + connect with lines
  //     - Mouse repels nearby particles
  //     - Click creates ripple burst
  //     - Scroll shifts particle parallax
  //     - Light/dark aware colors
  // ─────────────────────────────────────────────────────────────────────────
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 72;
    const CONNECTION_DIST = 130;
    const REPEL_DIST = 120;
    const REPEL_STRENGTH = 5.5;

    let mouse = { x: -9999, y: -9999 };
    let scrollY = 0;
    let isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    // Build particles
    class Particle {
      constructor() { this.reset(true); }
      reset(initial = false) {
        this.x  = Math.random() * W;
        this.y  = initial ? Math.random() * H : -10;
        this.vx = (Math.random() - 0.5) * 0.38;
        this.vy = (Math.random() - 0.5) * 0.38;
        this.r  = Math.random() * 1.6 + 0.6;
        this.alpha = Math.random() * 0.45 + 0.12;
        this.ox = this.x; // original x for scroll parallax
        this.oy = this.y;
        this.scrollFactor = Math.random() * 0.06 + 0.01;
      }
      update(scrollDelta) {
        this.x += this.vx;
        this.y += this.vy + scrollDelta * this.scrollFactor;

        // Soft-wall bounce
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
        this.x = Math.max(0, Math.min(W, this.x));
        this.y = Math.max(0, Math.min(H, this.y));

        // Mouse repulsion
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_DIST && dist > 0) {
          const force = (1 - dist / REPEL_DIST) * REPEL_STRENGTH;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }
      }
      draw() {
        const dark = isDark();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(255, 43, 43, ${this.alpha * 0.9})`
          : `rgba(255, 43, 43, ${this.alpha * 0.55})`;
        ctx.fill();
      }
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

    // Ripple clicks — listen on window since canvas has pointer-events: none
    const ripples = [];
    window.addEventListener('click', (e) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.65, maxR: 100 });
    }, { passive: true });

    // Track mouse
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    // Track scroll for parallax
    let lastScrollForParticle = 0;
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    }, { passive: true });

    // Resize
    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    // Draw loop
    function drawLoop() {
      ctx.clearRect(0, 0, W, H);

      const scrollDelta = scrollY - lastScrollForParticle;
      lastScrollForParticle = scrollY;
      const dark = isDark();

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i], p2 = particles[j];
          const dx = p1.x - p2.x, dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const lineAlpha = (1 - dist / CONNECTION_DIST) * (dark ? 0.18 : 0.1);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 43, 43, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      particles.forEach(p => { p.update(scrollDelta); p.draw(); });

      // Draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 3.5;
        rp.alpha -= 0.018;
        if (rp.alpha <= 0 || rp.r > rp.maxR) { ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 43, 43, ${rp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Mouse hover glow cluster
      if (mouse.x > 0) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
        g.addColorStop(0, `rgba(255, 43, 43, ${dark ? 0.07 : 0.04})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(drawLoop);
    }

    drawLoop();
  }

});

