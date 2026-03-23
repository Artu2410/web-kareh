const root = document.documentElement;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sectionLinks = navLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const yearNode = document.querySelector("#year");
const revealItems = [...document.querySelectorAll(".reveal")];
const tiltItems = [...document.querySelectorAll("[data-tilt]")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setActiveLink = (id) => {
  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const syncScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  root.style.setProperty("--scroll-progress", progress.toFixed(4));
};

const syncHeaderState = () => {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  syncScrollProgress();
};

const closeMenu = () => {
  if (!navToggle || !siteNav) return;

  navToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
};

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min((index % 4) * 0.08, 0.24)}s`);
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 980) {
      closeMenu();
    }
  });
}

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });
window.addEventListener("resize", syncScrollProgress);

if ("IntersectionObserver" in window) {
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
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry?.target?.id) {
        setActiveLink(visibleEntry.target.id);
      }
    },
    {
      threshold: [0.2, 0.45, 0.7],
      rootMargin: "-22% 0px -52% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
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

      if (!frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    });

    item.addEventListener("pointerleave", () => {
      nextX = 0;
      nextY = 0;

      if (!frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    });
  });
}
