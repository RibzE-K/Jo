// Simple form handling
document.getElementById("quoteForm").addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Thank you! Your message has been sent.");
    this.reset();
});
let lastScrollY = window.scrollY;
const navbar = document.getElementById("mainNav");

window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // User is scrolling DOWN
        navbar.classList.add("nav-hide");
        navbar.classList.remove("nav-show");
    } else {
        // User scrolling UP
        navbar.classList.add("nav-show");
        navbar.classList.remove("nav-hide");
    }

    lastScrollY = currentScrollY;
});
// Scroll-triggered animations
function animateOnScroll() {
    const leftItems = document.querySelectorAll(".animate-left");
    const rightItems = document.querySelectorAll(".animate-right");
    const triggerBottom = window.innerHeight * 0.85;

    leftItems.forEach(left => {
        const leftTop = left.getBoundingClientRect().top;
        if (leftTop < triggerBottom) {
            left.classList.add("visible");
        } else {
            left.classList.remove("visible");
        }
    });

    rightItems.forEach(right => {
        const rightTop = right.getBoundingClientRect().top;
        if (rightTop < triggerBottom) {
            right.classList.add("visible");
        } else {
            right.classList.remove("visible");
        }
    });
}

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);

// Apply background images from data-bg; lazy-load when tile enters viewport
document.addEventListener('DOMContentLoaded', () => {
  const tiles = document.querySelectorAll('.tile[data-bg]');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const t = entry.target;
        t.style.backgroundImage = `url("${t.dataset.bg}")`;
        t.classList.add('bg-loaded');
        obs.unobserve(t);
      });
    }, { rootMargin: '200px' });

    tiles.forEach(t => io.observe(t));
  } else {
    // fallback: load all immediately
    tiles.forEach(t => t.style.backgroundImage = `url("${t.dataset.bg}")`);
  }
});

// Reviews ticker: render stars from data-stars, duplicate track for seamless loop, compute duration
(function setupReviewsTicker() {
  const init = () => {
    const viewport = document.querySelector('.ticker-viewport');
    const track = document.querySelector('.ticker-track');
    const clone = document.querySelector('.ticker-track--clone');

    if (!viewport || !track || !clone) return;

    // 1) Render stars for each item based on data-stars (0..5)
    track.querySelectorAll('.ticker-item').forEach(item => {
      const starsCount = Math.max(0, Math.min(5, parseInt(item.dataset.stars || 0, 10)));
      const starsContainer = item.querySelector('.review-stars');
      if (!starsContainer) return;
      starsContainer.innerHTML = '';
      for (let i = 0; i < starsCount; i++) {
        const iEl = document.createElement('i');
        iEl.className = 'bi bi-star-fill';
        starsContainer.appendChild(iEl);
      }
      for (let i = starsCount; i < 5; i++) {
        const iEl = document.createElement('i');
        iEl.className = 'bi bi-star';
        iEl.style.opacity = '0.25';
        starsContainer.appendChild(iEl);
      }
    });

    // 2) Duplicate content to create seamless loop
    clone.innerHTML = track.innerHTML;

    // 3) Compute animation duration based on track width (longer content => longer duration)
    const computeDuration = () => {
      // We translate the combined track by 50% (i.e. by the original track width),
      // so the distance to travel equals track.scrollWidth.
      const pixelsPerSecond = 120; // tweak to taste; higher => faster
      const distance = track.scrollWidth; // pixels to scroll before repeating
      const duration = Math.max(10, Math.round(distance / pixelsPerSecond));
      // set CSS variable used by the animation
      document.documentElement.style.setProperty('--ticker-duration', `${duration}s`);
    };

    // initial compute and on resize
    computeDuration();
    window.addEventListener('resize', () => {
      // small debounce
      clearTimeout(window.__tickerResizeTimer);
      window.__tickerResizeTimer = setTimeout(computeDuration, 120);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
