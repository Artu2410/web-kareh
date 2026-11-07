const isHomepage = document.body.classList.contains("page-home");
const revealItems = [...document.querySelectorAll(".reveal")];
const tiltItems = [...document.querySelectorAll("[data-tilt]")];
const accordionTriggers = [...document.querySelectorAll("[data-accordion-trigger]")];
const reviewCarousel = document.querySelector("[data-review-carousel]");
const stickyTurnCta = document.querySelector(".whatsapp-float");
const siteFooter = document.querySelector(".site-footer");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealItemsInViewport = () => {
  if (isHomepage) return;

  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const isVisibleOnLoad = rect.top < window.innerHeight + 120 && rect.bottom > -120;

    if (isVisibleOnLoad) item.classList.add("is-visible");
  });
};

const initRevealItems = () => {
  if (isHomepage) return;

  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min((index % 4) * 0.08, 0.24)}s`);
  });

  revealItemsInViewport();
};

if (typeof window.requestAnimationFrame === "function") {
  window.requestAnimationFrame(initRevealItems);
} else {
  setTimeout(initRevealItems, 0);
}

if (accordionTriggers.length) {
  accordionTriggers.forEach((trigger) => {
    const panelId = trigger.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;

    if (!panel) return;

    panel.hidden = trigger.getAttribute("aria-expanded") !== "true";
    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isExpanded));
      panel.hidden = isExpanded;
    });
  });
}

if (reviewCarousel) {
  const track = reviewCarousel.querySelector("[data-review-track]");
  const slides = [...reviewCarousel.querySelectorAll("[data-review-slide]")];
  const previousButton = reviewCarousel.querySelector("[data-review-prev]");
  const nextButton = reviewCarousel.querySelector("[data-review-next]");

  if (track && slides.length && previousButton && nextButton) {
    const updateReviewControls = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const startOffset = Number.parseFloat(window.getComputedStyle(track).paddingLeft) || 0;
      previousButton.disabled = track.scrollLeft <= startOffset + 1;
      nextButton.disabled = track.scrollLeft >= maxScroll - 1;
    };

    const scrollReview = (direction) => {
      const slide = slides[0];
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap) || 0;
      const distance = slide.getBoundingClientRect().width + gap;

      track.scrollBy({
        left: direction * distance,
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
      });
    };

    previousButton.addEventListener("click", () => scrollReview(-1));
    nextButton.addEventListener("click", () => scrollReview(1));
    track.addEventListener("scroll", updateReviewControls, { passive: true });
    window.addEventListener("resize", updateReviewControls);
    updateReviewControls();
  }
}

revealItemsInViewport();

if (stickyTurnCta && siteFooter && "IntersectionObserver" in window) {
  const footerObserver = new IntersectionObserver(
    ([entry]) => stickyTurnCta.classList.toggle("is-hidden", entry.isIntersecting),
    { threshold: 0.01 },
  );
  footerObserver.observe(siteFooter);
}

if (!isHomepage && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -48px 0px",
    },
  );

  revealItems.forEach((item) => {
    if (!item.classList.contains("is-visible")) revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (!isHomepage && "IntersectionObserver" in window) {
  document.body.classList.add("reveal-ready");
}

if (!prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  tiltItems.forEach((item) => {
    let frameId = null;
    let nextX = 0;
    let nextY = 0;

    const render = () => {
      item.style.setProperty("--tilt-x", `${nextX}deg`);
      item.style.setProperty("--tilt-y", `${nextY}deg`);
      frameId = null;
    };

    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

      nextX = Number((offsetX * 8).toFixed(2));
      nextY = Number((offsetY * -8).toFixed(2));

      if (!frameId) frameId = window.requestAnimationFrame(render);
    });

    item.addEventListener("pointerleave", () => {
      nextX = 0;
      nextY = 0;
      if (!frameId) frameId = window.requestAnimationFrame(render);
    });
  });
}
