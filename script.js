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
const accordionTriggers = [...document.querySelectorAll("[data-accordion-trigger]")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const initialHash = window.location.hash;
const initialHashSection = initialHash ? document.querySelector(initialHash) : null;

const sendGaEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    page_path: window.location.pathname,
    page_title: document.title,
    ...params,
  });
};

const getLinkLabel = (link) => link.textContent?.replace(/\s+/g, " ").trim() || link.getAttribute("aria-label") || "";

const getConversionParams = (element) => ({
  service_area: element.dataset.service || "",
  patient_segment: element.dataset.segment || "",
  coverage: element.dataset.coverage || "",
  conversion_context: element.dataset.conversionContext || "",
});

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

  if (
    window.scrollY > 24 &&
    window.innerWidth < 980 &&
    navToggle?.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
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

const revealItemsInViewport = () => {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const isVisibleOnLoad = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisibleOnLoad) {
      item.classList.add("is-visible");
    }
  });
};

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

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

[...document.querySelectorAll("a[href]")].forEach((link) => {
  const href = link.getAttribute("href") || "";

  if (href.includes("wa.me")) {
    link.addEventListener("click", () => {
      const isAppointmentRequest = link.dataset.conversion === "turno" || /turno|coordinar|consultar|whatsapp/i.test(getLinkLabel(link));

      sendGaEvent("click_whatsapp", {
        link_url: link.href,
        link_text: getLinkLabel(link),
        ...getConversionParams(link),
      });

      if (isAppointmentRequest) {
        sendGaEvent("solicitud_turno", {
          link_url: link.href,
          link_text: getLinkLabel(link),
          ...getConversionParams(link),
        });
      }
    });
  }

  if (href.startsWith("tel:")) {
    link.addEventListener("click", () => {
      sendGaEvent("click_llamar", {
        link_url: link.href,
        link_text: getLinkLabel(link),
        ...getConversionParams(link),
      });
    });
  }
});

[...document.querySelectorAll("form")].forEach((form) => {
  form.addEventListener("submit", () => {
    sendGaEvent("formulario_enviado", {
      form_id: form.id || "",
      form_name: form.getAttribute("name") || "",
      ...getConversionParams(form),
    });
  });
});

revealItemsInViewport();

if (initialHashSection?.id) {
  setActiveLink(initialHashSection.id);
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

  revealItems.forEach((item) => {
    if (item.classList.contains("is-visible")) return;
    revealObserver.observe(item);
  });

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
