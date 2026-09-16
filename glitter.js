// Custom features case study page: scroll-triggered fade + slide-up
// entrance for the hero, feature dividers, and each section — same
// pattern used across the rest of the portfolio.

const caseBlocks = document.querySelectorAll(
  '.case-hero, .case-section, .case-cta, .feature-divider'
);

if (caseBlocks.length) {
  const caseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        caseObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  caseBlocks.forEach(block => caseObserver.observe(block));
}

// The hero is above the fold on load, so reveal it immediately
// instead of waiting for it to scroll into view.
window.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.case-hero');
  if (hero) {
    setTimeout(() => hero.classList.add('in-view'), 150);
  }
});