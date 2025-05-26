document.querySelector(".icon-menu").addEventListener("click", function (event) {
  event.preventDefault();
  document.body.classList.toggle("menu-open");
});

const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

spollerButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const currentItem = button.closest("[data-spoller]");
    const content = currentItem.querySelector(".spollers-faq__text");

    const parent = currentItem.parentNode;
    const isOneSpoller = parent.hasAttribute("data-one-spoller");

    if (isOneSpoller) {
      const allItems = parent.querySelectorAll("[data-spoller]");
      allItems.forEach((item) => {
        if (item !== currentItem) {
          const otherContent = item.querySelector(".spollers-faq__text");
          item.classList.remove("active");
          otherContent.style.maxHeight = null;
        }
      });
    }

    if (currentItem.classList.contains("active")) {
      currentItem.classList.remove("active");
      content.style.maxHeight = null;
    } else {
      currentItem.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

window.addEventListener('scroll', function() {
  const header = document.querySelector('.synthesia-header');
  if (!header) return;
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// --- Our Services slider navigation ---
(function() {
  const slider = document.getElementById('servicesSlider');
  const btnLeft = document.querySelector('.services-overhaul__arrow--left');
  const btnRight = document.querySelector('.services-overhaul__arrow--right');
  const dots = document.querySelectorAll('.services-overhaul__dot');
  if (!slider || !btnLeft || !btnRight || !dots.length) return;
  const cards = slider.querySelectorAll('.services-overhaul__card');
  const cardCount = cards.length;
  const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 340; // 24px gap

  // --- Arrow navigation ---
  btnLeft.addEventListener('click', function() {
    scrollToCard(getCurrentCardIndex() - 1);
  });
  btnRight.addEventListener('click', function() {
    scrollToCard(getCurrentCardIndex() + 1);
  });

  // --- Auto-slide logic ---
  let autoSlideInterval;
  let isPaused = false;
  function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      if (isPaused) return;
      let nextIdx = getCurrentCardIndex() + 1;
      if (nextIdx >= cardCount) nextIdx = 0;
      scrollToCard(nextIdx);
    }, 2500);
  }
  function pauseAutoSlide() { isPaused = true; }
  function resumeAutoSlide() { isPaused = false; }
  slider.addEventListener('mouseenter', pauseAutoSlide);
  slider.addEventListener('mouseleave', resumeAutoSlide);
  slider.addEventListener('focusin', pauseAutoSlide);
  slider.addEventListener('focusout', resumeAutoSlide);
  startAutoSlide();

  // --- Dots logic ---
  function getCurrentCardIndex() {
    // Find the card whose center is closest to the slider's center
    const sliderRect = slider.getBoundingClientRect();
    const sliderCenter = slider.scrollLeft + slider.offsetWidth / 2;
    let minDist = Infinity;
    let activeIdx = 0;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - sliderCenter);
      if (dist < minDist) {
        minDist = dist;
        activeIdx = i;
      }
    });
    return activeIdx;
  }
  function updateDots() {
    const idx = getCurrentCardIndex();
    dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
  }
  slider.addEventListener('scroll', function() {
    window.requestAnimationFrame(updateDots);
  });
  // Dot click: scroll to card
  dots.forEach((dot, i) => {
    dot.addEventListener('click', function() {
      scrollToCard(i);
    });
  });
  function scrollToCard(idx) {
    if (idx < 0) idx = 0;
    if (idx >= cardCount) idx = cardCount - 1;
    // Center the card in the slider
    const left = cards[idx].offsetLeft - (slider.offsetWidth - cards[idx].offsetWidth) / 2;
    slider.scrollTo({ left, behavior: 'smooth' });
  }
  // Initial dot state
  updateDots();
  // Snap to first card on resize to avoid scroll bugs
  window.addEventListener('resize', () => scrollToCard(getCurrentCardIndex()));
})();

// --- How it Works Progress Bar & Step Animation ---
(function() {
  const section = document.querySelector('.howitworks-section');
  const steps = document.querySelectorAll('.howitworks__step');
  const bar = document.querySelector('.howitworks__progress-bar');
  const indicator = document.querySelector('.howitworks__progress-indicator');
  if (!section || !steps.length || !bar || !indicator) return;

  // Progress bar logic (smooth fill)
  function updateProgress() {
    if (window.innerWidth < 900) {
      indicator.style.height = '0';
      return;
    }
    const barRect = bar.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const firstStep = steps[0];
    const lastStep = steps[steps.length - 1];
    const firstRect = firstStep.getBoundingClientRect();
    const lastRect = lastStep.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    // Calculate progress: 0 when first step top is at viewport bottom, 1 when last step bottom is at viewport top
    const start = firstRect.top - viewportHeight * 0.5;
    const end = lastRect.bottom - viewportHeight * 0.5;
    let progress = 1 - (end / (end - start));
    progress = Math.max(0, Math.min(1, progress));
    indicator.style.height = (bar.offsetHeight * progress) + 'px';
  }
  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // Step fade-in/fade-out animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('howitworks__step--visible');
      } else {
        entry.target.classList.remove('howitworks__step--visible');
      }
    });
  }, { threshold: 0.3 });
  steps.forEach((step) => {
    observer.observe(step);
  });
})();

// --- Integrations slider auto-scroll ---
(function() {
  const slider = document.getElementById('integrationsSlider');
  if (!slider) return;

  // Clone icons for infinite scroll effect
  const icons = slider.querySelectorAll('.integrations__icon');
  icons.forEach(icon => {
    const clone = icon.cloneNode(true);
    slider.appendChild(clone);
  });

  // Pause animation on hover
  slider.addEventListener('mouseenter', () => {
    slider.style.animationPlayState = 'paused';
  });
  slider.addEventListener('mouseleave', () => {
    slider.style.animationPlayState = 'running';
  });
})();
