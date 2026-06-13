// Personal Portfolio Interactivity Script

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Theme Toggle Handler ---
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme preference, default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  
  if (savedTheme === 'light') {
    htmlElement.classList.remove('dark');
    htmlElement.classList.add('light');
  } else {
    htmlElement.classList.remove('light');
    htmlElement.classList.add('dark');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'light') {
      htmlElement.classList.remove('dark');
      htmlElement.classList.add('light');
    } else {
      htmlElement.classList.remove('light');
      htmlElement.classList.add('dark');
    }
  });

  // --- Mobile Navigation Menu ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  // --- Navbar Shrink on Scroll ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('shrunk');
    } else {
      navbar.classList.remove('shrunk');
    }
  });

  // --- Timeline Accordion Expansion ---
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    // Expand the first item by default
    if (index === 0) {
      item.classList.add('expanded');
    }

    const header = item.querySelector('.timeline-header');
    if (header) {
      header.addEventListener('click', () => {
        const isExpanded = item.classList.contains('expanded');
        
        // Close other items
        timelineItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('expanded');
          }
        });

        item.classList.toggle('expanded');
      });
    }
  });

  // --- Typing Text Animation ---
  const typedTextSpan = document.getElementById('typed-text');
  const roles = [
    'Computer Science Engineer',
    'Full-Stack Developer',
    'AI & Data Analyst',
    'Cybersecurity Enthusiast',
    'Business Analyst'
  ];
  const typingSpeed = 100;
  const erasingSpeed = 50;
  const newRoleDelay = 2000;
  let roleIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < roles[roleIndex].length) {
      typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, newRoleDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, typingSpeed + 500);
    }
  }

  // Init typing cycle
  if (typedTextSpan) {
    setTimeout(type, 1000);
  }

  // --- Project Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Set active button style
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories');
        
        if (filterValue === 'all') {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else if (categories && categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // --- Scroll Reveal Animation ---
  // Let's add the scroll-reveal class to section-headers, cards, and timeline items
  const revealElements = [];
  
  document.querySelectorAll('.section-header, .about-card, .skill-category, .timeline-item, .project-card, .ach-item, .contact-info, .contact-form').forEach(el => {
    el.classList.add('scroll-reveal');
    revealElements.push(el);
  });

  // Setup IntersectionObserver for reveal triggers
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: make everything visible immediately
    revealElements.forEach(el => el.classList.add('active'));
  }

  // --- Contact Form Submission MOCK ---
  const contactForm = document.getElementById('portfolio-contact-form');
  const submitButton = document.getElementById('form-submit');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Visual feedback
      const originalContent = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="spin-icon" style="animation: rotate 1s linear infinite;">↻</i> Sending...';
      submitButton.style.pointerEvents = 'none';

      // Mock delay
      setTimeout(() => {
        submitButton.innerHTML = '<i data-lucide="check"></i> Message Sent!';
        submitButton.style.background = 'linear-gradient(135deg, #22c55e, #10b981)'; // Green success accent
        
        // Re-init lucide icons inside button
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }

        // Reset form
        contactForm.reset();

        setTimeout(() => {
          submitButton.innerHTML = originalContent;
          submitButton.style.background = '';
          submitButton.style.pointerEvents = 'auto';
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }, 3000);
      }, 1500);
    });
  }

  // --- 3D Hover Tilt Effect ---
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) {
    const tiltCards = document.querySelectorAll('.glass-card, .project-card, .avatar-wrapper');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const cardRect = card.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        
        // Get mouse position relative to card center
        const mouseX = e.clientX - cardRect.left - cardWidth / 2;
        const mouseY = e.clientY - cardRect.top - cardHeight / 2;
        
        // Calculate rotation angles (max 6 degrees for subtle classiness)
        const rotateX = -(mouseY / (cardHeight / 2)) * 6;
        const rotateY = (mouseX / (cardWidth / 2)) * 6;
        
        // Apply transform style
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        card.style.boxShadow = `${-rotateY * 1.2}px ${rotateX * 1.2}px 35px rgba(0, 0, 0, 0.4), 0 0 25px rgba(6, 182, 212, 0.12)`;
      });
      
      card.addEventListener('mouseleave', () => {
        // Reset transform styles smoothly
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }
});
