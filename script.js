// Minimal entrance animation: fade + slide up, triggered right after load
window.addEventListener('DOMContentLoaded', () => {
  const heroContent = document.getElementById('heroContent');
  const heroImageWrap = document.getElementById('heroImageWrap');

  setTimeout(() => {
    heroContent.classList.add('in-view');
    if (heroImageWrap) heroImageWrap.classList.add('in-view');
  }, 150);
});

// Mobile navbar toggle (right-side drawer)
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const navbarEl = document.getElementById('navbar');

function closeDrawer(){
  navToggle.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
  navbarEl.classList.remove('drawer-open');
}

if (navToggle && navLinks && navOverlay && navbarEl) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    navOverlay.classList.toggle('open');
    navbarEl.classList.toggle('drawer-open');
  });

  navOverlay.addEventListener('click', closeDrawer);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (link.classList.contains('nav-link')) {
        navLinks.querySelectorAll('a.nav-link').forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
      }
      closeDrawer();
    });
  });
}

// Light / dark mode toggle — the inline script in <head> already
// applies the saved theme before the page paints, so this just wires
// up the button to flip it and keep localStorage in sync. Light is
// the default look; the button switches into dark mode.
const themeToggle = document.getElementById('themeToggle');

function updateToggleLabel(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (themeToggle) themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

if (themeToggle) {
  updateToggleLabel();

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    updateToggleLabel();
    closeDrawer();
  });
}

// Small click transition on the hero image (works on touch devices too)
const heroImage = document.getElementById('heroImage');
if (heroImage) {
  heroImage.addEventListener('click', () => {
    heroImage.classList.add('clicked');
    setTimeout(() => heroImage.classList.remove('clicked'), 220);
  });
}

// Measure the navbar's real rendered height and expose it as --nav-h
function setNavHeightVar(){
  if (navbarEl) {
    document.documentElement.style.setProperty('--nav-h', navbarEl.offsetHeight + 'px');
  }
}
setNavHeightVar();
window.addEventListener('resize', setNavHeightVar);
window.addEventListener('orientationchange', setNavHeightVar);

// Give the navbar a subtle shadow once the page has scrolled past it
function setNavScrolledState(){
  if (navbarEl) {
    navbarEl.classList.toggle('scrolled', window.scrollY > 8);
  }
}
setNavScrolledState();
window.addEventListener('scroll', setNavScrolledState, { passive: true });


// About section: scroll-triggered entrance + counting animation
const aboutText = document.getElementById('aboutText');
const aboutStats = document.getElementById('aboutStats');

function animateCount(el){
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

if (aboutText && aboutStats) {
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        if (entry.target === aboutStats) {
          aboutStats.querySelectorAll('.stat-number').forEach(el => {
            if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
              el.textContent = el.dataset.target + (el.dataset.suffix || '');
            } else {
              animateCount(el);
            }
          });
        }

        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  aboutObserver.observe(aboutText);
  aboutObserver.observe(aboutStats);
}


// Projects section: scroll-triggered entrance for each card
const projectCards = document.querySelectorAll('.project-card');
if (projectCards.length) {
  const projectsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        projectsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  projectCards.forEach(card => projectsObserver.observe(card));
}


// Skills section: scroll-triggered entrance + a minimal typing
// animation on the heading (types out once, then leaves a blinking cursor)
const skillsText = document.getElementById('skillsText');
const skillsPills = document.getElementById('skillsPills');
const skillsTyped = document.getElementById('skillsTyped');

function typeHeading(el, text, speed = 55){
  let i = 0;
  el.textContent = '';
  function tick(){
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(tick, speed);
    }
  }
  tick();
}

if (skillsText && skillsPills && skillsTyped) {
  const headingText = 'My Skills and Expertise';

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        if (entry.target === skillsText) {
          if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            skillsTyped.textContent = headingText;
          } else {
            typeHeading(skillsTyped, headingText);
          }
        }

        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillsObserver.observe(skillsText);
  skillsObserver.observe(skillsPills);
}


// Reviews section: scroll-triggered entrance for each card
const reviewCards = document.querySelectorAll('.review-card');
if (reviewCards.length) {
  const reviewsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        reviewsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reviewCards.forEach(card => reviewsObserver.observe(card));
}

// Reviews section: minimal typing animation on the heading
const reviewsTyped = document.getElementById('reviewsTyped');
if (reviewsTyped) {
  const reviewsHeadingText = 'What Clients Say';

  const reviewsHeadingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
          reviewsTyped.textContent = reviewsHeadingText;
        } else {
          typeHeading(reviewsTyped, reviewsHeadingText);
        }
        reviewsHeadingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  reviewsHeadingObserver.observe(reviewsTyped);
}

// Reviews section: carousel — swipe/scroll through cards, with arrow
// buttons and dots as extra controls, all driven by native scrolling
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewPrev = document.getElementById('reviewPrev');
const reviewNext = document.getElementById('reviewNext');
const reviewDotsWrap = document.getElementById('reviewDots');

if (reviewsTrack && reviewCards.length) {
  reviewCards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      reviewCards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
    reviewDotsWrap.appendChild(dot);
  });
  const dots = reviewDotsWrap.querySelectorAll('.carousel-dot');

  function scrollByOneCard(direction){
    const card = reviewCards[0];
    const gap = parseFloat(getComputedStyle(reviewsTrack).columnGap || 24);
    const amount = (card.offsetWidth + gap) * direction;
    reviewsTrack.scrollBy({ left: amount, behavior: 'smooth' });
  }

  if (reviewPrev) reviewPrev.addEventListener('click', () => scrollByOneCard(-1));
  if (reviewNext) reviewNext.addEventListener('click', () => scrollByOneCard(1));

  function updateActiveDot(){
    let closestIndex = 0;
    let closestDist = Infinity;
    reviewCards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - reviewsTrack.scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === closestIndex));
  }

  let scrollTimeout;
  reviewsTrack.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 100);
  }, { passive: true });
}

// Reviews section: lightbox — click a screenshot to see it enlarged,
// close with the X button, by clicking the dark backdrop, or Esc
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const reviewImages = document.querySelectorAll('.review-img');

function openLightbox(src, alt){
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('open');
}

function closeLightbox(){
  lightbox.classList.remove('open');
}

if (lightbox && lightboxImg && lightboxClose && reviewImages.length) {
  reviewImages.forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}


// Contact section: scroll-triggered entrance
const contactText = document.getElementById('contactText');
const contactForm = document.getElementById('contactForm');

if (contactText && contactForm) {
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  contactObserver.observe(contactText);
  contactObserver.observe(contactForm);
}

// Contact form: submits to Web3Forms — the message lands directly
// in my inbox, no email app or backend needed on the visitor's end.
if (contactForm) {
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('contactSubmitBtn');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill in all fields.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.textContent = '';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        formStatus.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again or message me on WhatsApp instead.';
      }
    } catch (err) {
      formStatus.textContent = 'Something went wrong. Please check your connection and try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}