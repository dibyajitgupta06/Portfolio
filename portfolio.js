/* Lightweight interactions for the portfolio. No WebGL or animation engine. */
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

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

  const chibi = document.getElementById('chibi-interactive');
  const avatar = document.getElementById('chibi-avatar');
  if (chibi && avatar) {
    let gazeFrame = 0;
    let angryTimer;
    const moveEyes = event => {
      if (chibi.classList.contains('is-angry') || gazeFrame) return;
      gazeFrame = requestAnimationFrame(() => {
        gazeFrame = 0;
        const rect = chibi.getBoundingClientRect();
        const x = ((event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2)) * 4.5;
        const y = ((event.clientY - (rect.top + rect.height * .43)) / (window.innerHeight / 2)) * 3.5;
        chibi.style.setProperty('--gaze-x', `${Math.max(-4.5, Math.min(4.5, x)).toFixed(1)}px`);
        chibi.style.setProperty('--gaze-y', `${Math.max(-3.5, Math.min(3.5, y)).toFixed(1)}px`);
      });
    };
    window.addEventListener('pointermove', moveEyes, { passive:true });
    window.addEventListener('pointerleave', () => {
      chibi.style.setProperty('--gaze-x', '0px');
      chibi.style.setProperty('--gaze-y', '0px');
    });

    chibi.addEventListener('click', () => {
      window.clearTimeout(angryTimer);
      chibi.classList.add('is-angry');
      chibi.setAttribute('aria-pressed', 'true');
      chibi.setAttribute('aria-label', "Dibyajit's chibi is angry");
      avatar.src = avatar.dataset.angrySrc;
      angryTimer = window.setTimeout(() => {
        chibi.classList.remove('is-angry');
        chibi.setAttribute('aria-pressed', 'false');
        chibi.setAttribute('aria-label', "Make Dibyajit's chibi angry");
        avatar.src = avatar.dataset.normalSrc;
      }, 1100);
    });
  }
});
