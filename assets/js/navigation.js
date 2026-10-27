const root = document.documentElement;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const serviceDropdownToggles = [...document.querySelectorAll(".nav-dropdown-toggle")];
const sectionLinks = navLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

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

const closeMenu = () => {
  if (!navToggle || !siteNav) return;

  navToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
};

const closeServiceDropdowns = () => {
  serviceDropdownToggles.forEach((toggle) => {
    const menuId = toggle.getAttribute("aria-controls");
    const menu = menuId ? document.getElementById(menuId) : null;

    toggle.setAttribute("aria-expanded", "false");
    if (menu) menu.hidden = true;
  });
};

const syncHeaderState = () => {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  if (
    window.scrollY > 24 &&
    window.innerWidth < 980 &&
    navToggle?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
  }

  syncScrollProgress();
};

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeServiceDropdowns();
      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 980) closeMenu();
  });
}

serviceDropdownToggles.forEach((toggle) => {
  const menuId = toggle.getAttribute("aria-controls");
  const menu = menuId ? document.getElementById(menuId) : null;

  if (!menu) return;

  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isExpanded));
    menu.hidden = isExpanded;
  });
});

document.addEventListener("click", (event) => {
  if (event.target instanceof Element && !event.target.closest(".nav-dropdown")) {
    closeServiceDropdowns();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const expandedToggle = serviceDropdownToggles.find(
    (toggle) => toggle.getAttribute("aria-expanded") === "true",
  );
  closeServiceDropdowns();
  expandedToggle?.focus();
});

const initialHashSection = window.location.hash
  ? document.querySelector(window.location.hash)
  : null;
if (initialHashSection?.id) setActiveLink(initialHashSection.id);

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });
window.addEventListener("resize", syncScrollProgress);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry?.target?.id) setActiveLink(visibleEntry.target.id);
    },
    {
      threshold: [0.2, 0.45, 0.7],
      rootMargin: "-22% 0px -52% 0px",
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}
