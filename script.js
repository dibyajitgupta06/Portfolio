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
  // 17. INTERACTIVE CANVAS — INVISIBLE NODE NETWORK
  //     No dots. No circles. Only ultra-thin connection lines + mouse glow.
  //     Nodes are invisible — lines appear only between close nodes.
  //     Mouse attracts nearby nodes. Click fires expanding ring.
  // ─────────────────────────────────────────────────────────────────────────
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const NODE_COUNT     = window.innerWidth < 768 ? 30 : 55;
    const CONNECT_DIST   = 160;
    const MOUSE_ATTRACT  = 90;   // range in px
    const ATTRACT_FORCE  = 1.8;
    const SPEED          = 0.28;

    let mouse = { x: -9999, y: -9999 };
    let lastScroll = window.scrollY;
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    // Invisible nodes — no draw() call
    class Node {
      constructor() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * SPEED;
        this.vy = (Math.random() - 0.5) * SPEED;
        this.scrollSpeed = Math.random() * 0.04 + 0.01;
      }
      update(scrollDelta) {
        // Mouse soft-attract
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_ATTRACT && d > 0) {
          const f = (1 - d / MOUSE_ATTRACT) * ATTRACT_FORCE * 0.012;
          this.vx += dx / d * f;
          this.vy += dy / d * f;
        }

        // Velocity damping
        this.vx *= 0.992;
        this.vy *= 0.992;

        // Clamp speed
        const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (spd > SPEED * 2.5) {
          this.vx = (this.vx / spd) * SPEED * 2.5;
          this.vy = (this.vy / spd) * SPEED * 2.5;
        }

        this.x += this.vx;
        this.y += this.vy + scrollDelta * this.scrollSpeed;

        // Wrap edges (nodes reappear on opposite side — no flicker bounce)
        if (this.x < -20)  this.x = W + 20;
        if (this.x > W+20) this.x = -20;
        if (this.y < -20)  this.y = H + 20;
        if (this.y > H+20) this.y = -20;
      }
    }

    const nodes = Array.from({ length: NODE_COUNT }, () => new Node());

    // Click ripples
    const ripples = [];
    window.addEventListener('click', (e) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 4, maxR: 110, alpha: 0.55 });
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('scroll', () => {}, { passive: true });
    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    function drawLoop() {
      ctx.clearRect(0, 0, W, H);

      const currentScroll = window.scrollY;
      const scrollDelta   = (currentScroll - lastScroll) * 0.35;
      lastScroll = currentScroll;
      const dark = isDark();

      // Update nodes
      nodes.forEach(n => n.update(scrollDelta));

      // Draw connection lines ONLY — no node dots
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            // Fade out near edge of range
            const t = 1 - dist / CONNECT_DIST;
            const alpha = t * t * (dark ? 0.14 : 0.06);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(180, 180, 200, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Mouse zone — brighten lines within mouse radius
      nodes.forEach(n => {
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          const t = 1 - d / 160;
          const alpha = t * t * (dark ? 0.28 : 0.14);
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 43, 43, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });

      // Expand ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r     += 4;
        rp.alpha -= 0.013;
        if (rp.alpha <= 0 || rp.r > rp.maxR) { ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 43, 43, ${rp.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // Inner faint fill
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 43, 43, ${rp.alpha * 0.3})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      requestAnimationFrame(drawLoop);
    }

    drawLoop();
  }

});

