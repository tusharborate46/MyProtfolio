/* ==================== */
/* CUSTOM CURSOR        */
/* ==================== */

const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left  = mouseX - 4 + 'px';
  dot.style.top   = mouseY - 4 + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX - 18 + 'px';
  ring.style.top  = ringY - 18 + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-card, .post-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot.style.transform  = 'scale(2)';
    ring.style.width     = '50px';
    ring.style.height    = '50px';
  });
  el.addEventListener('mouseleave', () => {
    dot.style.transform  = 'scale(1)';
    ring.style.width     = '36px';
    ring.style.height    = '36px';
  });
});

/* ==================== */
/* SCROLL ANIMATIONS    */
/* ==================== */

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ==================== */
/* NAV SCROLL EFFECTS   */
/* ==================== */

const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  document.querySelectorAll('section').forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

/* ==================== */
/* SMOOTH SCROLL        */
/* ==================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ==================== */
/* HERO ENTRANCE        */
/* ==================== */

window.addEventListener('load', () => {
  const heroLeft  = document.querySelector('.hero-left');
  const heroRight = document.querySelector('.hero-right');
  const badge     = document.querySelector('.hero-badge');

  if (badge)     badge.style.animation     = 'fadeUp 0.6s 0.1s ease both';
  if (heroLeft)  heroLeft.style.animation  = 'fadeUp 0.8s 0.2s ease both';
  if (heroRight) heroRight.style.animation = 'fadeUp 0.8s 0.4s ease both';
});

/* ==================== */
/* MAGNETIC BUTTONS     */
/* ==================== */

document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('mousemove', function(e) {
    const rect   = this.getBoundingClientRect();
    const x      = e.clientX - rect.left - rect.width / 2;
    const y      = e.clientY - rect.top  - rect.height / 2;
    this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

/* ==================== */
/* POST ITEM CLICK      */
/* ==================== */

document.querySelectorAll('.post-item').forEach(item => {
  item.addEventListener('click', function() {
    console.log('Project:', this.querySelector('.post-title').textContent);
  });
});