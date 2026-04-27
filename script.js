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
const initialHash = window.location.hash;
const initialHashSection = initialHash ? document.querySelector(initialHash) : null;
const adminModal = document.querySelector("#admin-modal");
const adminOpenButtons = [...document.querySelectorAll("[data-admin-open]")];
const adminCloseButtons = [...document.querySelectorAll("[data-admin-close]")];
const adminLoginForm = document.querySelector("#admin-login-form");
const adminPasswordForm = document.querySelector("#admin-password-form");
const adminLoginFeedback = document.querySelector("#admin-login-feedback");
const adminPasswordFeedback = document.querySelector("#admin-password-feedback");
const adminAuthView = document.querySelector("#admin-auth-view");
const adminPanelView = document.querySelector("#admin-panel-view");
const adminStatsGrid = document.querySelector("#admin-stats-grid");
const adminBars = document.querySelector("#admin-bars");
const adminLastVisit = document.querySelector("#admin-last-visit");
const adminLogoutButton = document.querySelector("#admin-logout-button");
const adminUsernameInput = document.querySelector("[data-admin-username]");

const ADMIN_STORAGE_KEYS = {
  auth: "kareh_admin_auth",
  credentials: "kareh_admin_credentials",
  visits: "kareh_site_visits",
  attempts: "kareh_admin_attempts",
};

const DEFAULT_ADMIN = {
  username: "kareh",
  password: "1234!",
};

const formatDateTime = (value) => {
  if (!value) return "Sin registros";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};

const setFeedback = (node, message, type = "") => {
  if (!node) return;
  node.textContent = message || "";
  node.classList.remove("is-error", "is-success");
  if (type) node.classList.add(type === "error" ? "is-error" : "is-success");
};

const readJsonStorage = (key, fallbackValue) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch {
    return fallbackValue;
  }
};

const writeJsonStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getTodayKey = (date = new Date()) => date.toISOString().slice(0, 10);

const buildRecentDayKeys = (days = 7) => {
  const keys = [];
  const base = new Date();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const nextDate = new Date(base);
    nextDate.setDate(base.getDate() - offset);
    keys.push(getTodayKey(nextDate));
  }
  return keys;
};

const getMonthKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const createSalt = () => {
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const derivePasswordHash = async (password, salt) => {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 120000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const ensureAdminCredentials = async () => {
  const stored = readJsonStorage(ADMIN_STORAGE_KEYS.credentials, null);
  if (stored?.username && stored?.passwordHash && stored?.salt) {
    return stored;
  }

  const salt = createSalt();
  const passwordHash = await derivePasswordHash(DEFAULT_ADMIN.password, salt);
  const bootstrap = {
    username: DEFAULT_ADMIN.username,
    passwordHash,
    salt,
    mustChangePassword: true,
    updatedAt: new Date().toISOString(),
  };
  writeJsonStorage(ADMIN_STORAGE_KEYS.credentials, bootstrap);
  return bootstrap;
};

const recordSiteVisit = () => {
  const now = new Date().toISOString();
  const todayKey = getTodayKey();
  const existing = readJsonStorage(ADMIN_STORAGE_KEYS.visits, {
    total: 0,
    uniqueSessions: 0,
    days: {},
    lastVisitAt: null,
  });

  let countedSession = window.sessionStorage.getItem("kareh_site_visit_counted");
  if (!countedSession) {
    countedSession = "1";
    window.sessionStorage.setItem("kareh_site_visit_counted", countedSession);
    existing.total += 1;
    existing.uniqueSessions += 1;
    existing.days[todayKey] = (existing.days[todayKey] || 0) + 1;
    existing.lastVisitAt = now;
    writeJsonStorage(ADMIN_STORAGE_KEYS.visits, existing);
  }
};

const getVisitSummary = () => {
  const visitStore = readJsonStorage(ADMIN_STORAGE_KEYS.visits, {
    total: 0,
    uniqueSessions: 0,
    days: {},
    lastVisitAt: null,
  });
  const recentKeys = buildRecentDayKeys(7);
  const last7Days = recentKeys.map((key) => ({
    key,
    count: Number(visitStore.days[key] || 0),
  }));
  const today = last7Days[last7Days.length - 1]?.count || 0;
  const week = last7Days.reduce((sum, item) => sum + item.count, 0);
  const currentMonthKey = getMonthKey();
  const month = Object.entries(visitStore.days).reduce((sum, [key, count]) => {
    return key.startsWith(currentMonthKey) ? sum + Number(count || 0) : sum;
  }, 0);

  return {
    total: Number(visitStore.total || 0),
    uniqueSessions: Number(visitStore.uniqueSessions || 0),
    today,
    week,
    month,
    lastVisitAt: visitStore.lastVisitAt,
    last7Days,
  };
};

const getAttemptsState = () => readJsonStorage(ADMIN_STORAGE_KEYS.attempts, {
  failures: 0,
  lockedUntil: null,
});

const saveAttemptsState = (state) => writeJsonStorage(ADMIN_STORAGE_KEYS.attempts, state);

const getLockMessage = (lockedUntil) => {
  const remainingMs = new Date(lockedUntil).getTime() - Date.now();
  const remainingSeconds = Math.max(1, Math.ceil(remainingMs / 1000));
  return `Acceso bloqueado temporalmente. Intenta otra vez en ${remainingSeconds}s.`;
};

const startAdminSession = () => {
  writeJsonStorage(ADMIN_STORAGE_KEYS.auth, {
    loggedInAt: new Date().toISOString(),
  });
};

const endAdminSession = () => {
  window.localStorage.removeItem(ADMIN_STORAGE_KEYS.auth);
};

const isAdminSessionActive = () => {
  const session = readJsonStorage(ADMIN_STORAGE_KEYS.auth, null);
  if (!session?.loggedInAt) return false;

  const loggedInAt = new Date(session.loggedInAt).getTime();
  const ageMs = Date.now() - loggedInAt;
  const maxAgeMs = 6 * 60 * 60 * 1000;
  if (ageMs > maxAgeMs) {
    endAdminSession();
    return false;
  }
  return true;
};

const openAdminModal = async () => {
  if (!adminModal) return;
  await ensureAdminCredentials();
  if (!isAdminSessionActive() && adminLoginForm) {
    adminLoginForm.reset();
  }
  if (!isAdminSessionActive() && adminUsernameInput) {
    adminUsernameInput.value = "";
  }
  adminModal.classList.add("is-open");
  adminModal.setAttribute("aria-hidden", "false");
  renderAdminState();
  if (!isAdminSessionActive() && adminUsernameInput) {
    window.requestAnimationFrame(() => adminUsernameInput.focus());
  }
};

const closeAdminModal = () => {
  if (!adminModal) return;
  adminModal.classList.remove("is-open");
  adminModal.setAttribute("aria-hidden", "true");
};

const renderAdminStats = () => {
  if (!adminStatsGrid || !adminBars || !adminLastVisit) return;

  const stats = getVisitSummary();
  const cards = [
    { label: "Visitas hoy", value: stats.today },
    { label: "Últimos 7 días", value: stats.week },
    { label: "Este mes", value: stats.month },
    { label: "Total acumulado", value: stats.total },
    { label: "Sesiones únicas", value: stats.uniqueSessions },
  ];

  adminStatsGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="admin-stat">
          <span class="admin-stat__label">${card.label}</span>
          <span class="admin-stat__value">${card.value}</span>
        </article>
      `
    )
    .join("");

  const maxValue = Math.max(...stats.last7Days.map((item) => item.count), 1);
  adminBars.innerHTML = stats.last7Days
    .map((item) => {
      const label = item.key.slice(5).split("-").reverse().join("/");
      const height = Math.max((item.count / maxValue) * 100, item.count > 0 ? 8 : 4);
      return `
        <div class="admin-bar">
          <span class="admin-bar__value">${item.count}</span>
          <div class="admin-bar__track">
            <div class="admin-bar__fill" style="height:${height}%"></div>
          </div>
          <span class="admin-bar__label">${label}</span>
        </div>
      `;
    })
    .join("");

  adminLastVisit.textContent = `Última visita registrada: ${formatDateTime(stats.lastVisitAt)}`;
};

const renderAdminState = () => {
  const isLoggedIn = isAdminSessionActive();
  if (adminAuthView) adminAuthView.hidden = isLoggedIn;
  if (adminPanelView) adminPanelView.hidden = !isLoggedIn;

  setFeedback(adminLoginFeedback, "");
  if (isLoggedIn) {
    renderAdminStats();
  }
};

const validateStrongPassword = (password) => {
  const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  return strongPattern.test(password);
};

const handleAdminLogin = async (event) => {
  event.preventDefault();
  const attemptsState = getAttemptsState();
  if (attemptsState.lockedUntil && new Date(attemptsState.lockedUntil).getTime() > Date.now()) {
    setFeedback(adminLoginFeedback, getLockMessage(attemptsState.lockedUntil), "error");
    return;
  }

  const formData = new FormData(adminLoginForm);
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const credentials = await ensureAdminCredentials();
  const passwordHash = await derivePasswordHash(password, credentials.salt);

  if (username !== credentials.username || passwordHash !== credentials.passwordHash) {
    const failures = Number(attemptsState.failures || 0) + 1;
    const nextState = {
      failures,
      lockedUntil: failures >= 5 ? new Date(Date.now() + 60 * 1000).toISOString() : null,
    };
    saveAttemptsState(nextState);
    setFeedback(
      adminLoginFeedback,
      nextState.lockedUntil
        ? getLockMessage(nextState.lockedUntil)
        : "Usuario o clave incorrectos.",
      "error"
    );
    return;
  }

  saveAttemptsState({ failures: 0, lockedUntil: null });
  startAdminSession();
  adminLoginForm.reset();
  setFeedback(
    adminLoginFeedback,
    credentials.mustChangePassword
      ? "Acceso concedido. Conviene cambiar la clave inicial ahora."
      : "Acceso concedido.",
    "success"
  );
  renderAdminState();
};

const handlePasswordChange = async (event) => {
  event.preventDefault();
  const formData = new FormData(adminPasswordForm);
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const credentials = await ensureAdminCredentials();
  const currentHash = await derivePasswordHash(currentPassword, credentials.salt);

  if (currentHash !== credentials.passwordHash) {
    setFeedback(adminPasswordFeedback, "La clave actual no coincide.", "error");
    return;
  }

  if (newPassword !== confirmPassword) {
    setFeedback(adminPasswordFeedback, "La confirmación no coincide con la nueva clave.", "error");
    return;
  }

  if (!validateStrongPassword(newPassword)) {
    setFeedback(
      adminPasswordFeedback,
      "Usa 8 o más caracteres con mayúscula, minúscula, número y símbolo.",
      "error"
    );
    return;
  }

  const nextSalt = createSalt();
  const nextHash = await derivePasswordHash(newPassword, nextSalt);
  writeJsonStorage(ADMIN_STORAGE_KEYS.credentials, {
    ...credentials,
    salt: nextSalt,
    passwordHash: nextHash,
    mustChangePassword: false,
    updatedAt: new Date().toISOString(),
  });

  adminPasswordForm.reset();
  setFeedback(adminPasswordFeedback, "Clave actualizada correctamente.", "success");
};

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

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

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

recordSiteVisit();

adminOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    void openAdminModal();
  });
});

adminCloseButtons.forEach((button) => {
  button.addEventListener("click", closeAdminModal);
});

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", (event) => {
    void handleAdminLogin(event);
  });
}

if (adminPasswordForm) {
  adminPasswordForm.addEventListener("submit", (event) => {
    void handlePasswordChange(event);
  });
}

if (adminLogoutButton) {
  adminLogoutButton.addEventListener("click", () => {
    endAdminSession();
    setFeedback(adminPasswordFeedback, "");
    renderAdminState();
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && adminModal?.classList.contains("is-open")) {
    closeAdminModal();
  }
});
