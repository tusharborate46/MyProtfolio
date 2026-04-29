/* ==================== */
/* INTERACTIVE ELEMENTS */
/* ==================== */

/* ==================== */
/* SCROLL ANIMATIONS */
/* ==================== */

// Intersection Observer for fade-in effect on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

// Apply animation to all sections
document.querySelectorAll('section, .skills-inner > *').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});

/* ==================== */
/* SMOOTH SCROLL FOR NAVIGATION */
/* ==================== */

document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* ==================== */
/* ACTIVE NAV LINK ON SCROLL */
/* ==================== */

window.addEventListener('scroll', () => {
  let current = '';

  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ==================== */
/* MOBILE MENU TOGGLE (Optional) */
/* ==================== */

// Uncomment if you want to add a mobile menu toggle in the future
/*
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}
*/

/* ==================== */
/* ADDITIONAL INTERACTIONS */
/* ==================== */

// Add click animation to CTA buttons
document.querySelectorAll('.hero-cta, .hero-cta-ghost').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // Button already has smooth scroll via HTML href
    // You can add additional feedback here if needed
  });
});

// Blog post click interaction (optional - makes entire post clickable)
document.querySelectorAll('.post-item').forEach(item => {
  item.addEventListener('click', function() {
    // You can add a modal or navigate to a full blog post page
    console.log('Blog post clicked:', this.querySelector('.post-title').textContent);
  });
});

/* ==================== */
/* PAGE LOAD ANIMATION */
/* ==================== */

// Trigger fade-in for hero section on page load
window.addEventListener('load', () => {
  const heroLeft = document.querySelector('.hero-left');
  const heroRight = document.querySelector('.hero-right');

  if (heroLeft) {
    heroLeft.style.animation = 'fadeUp 0.8s ease forwards';
  }

  if (heroRight) {
    heroRight.style.animation = 'fadeUp 0.8s 0.2s ease forwards';
  }
});