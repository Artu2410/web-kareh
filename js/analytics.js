/**
 * analytics.js — Kareh tracking helper
 * Centraliza todos los eventos GA4 + almacenamiento local para el dashboard.
 * Versión: 1.1.0 — 2026-06
 */

(function () {
  "use strict";

  // ──────────────────────────────────────────────
  // Utilidades internas
  // ──────────────────────────────────────────────

  /** Envía evento a GA4 si gtag está disponible */
  function sendGa(eventName, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, Object.assign(
      {
        page_path: window.location.pathname,
        page_title: document.title,
        send_to: "G-FDLH4H45N5",
      },
      params || {}
    ));
  }

  /**
   * Almacena el evento en localStorage para el dashboard local.
   * Guarda los últimos 500 eventos.
   */
  function storeLocal(eventName, params) {
    try {
      var key = "kareh_events";
      var raw = localStorage.getItem(key);
      var events = raw ? JSON.parse(raw) : [];
      events.push({
        event: eventName,
        params: params || {},
        ts: Date.now(),
        path: window.location.pathname,
      });
      // Limitar a 500 entradas
      if (events.length > 500) {
        events = events.slice(events.length - 500);
      }
      localStorage.setItem(key, JSON.stringify(events));
    } catch (_) {
      // localStorage puede estar bloqueado en modo privado
    }
  }

  /**
   * Función central: envía a GA4 y guarda localmente.
   * Exportada en window.kareh.track()
   */
  function track(eventName, params) {
    sendGa(eventName, params);
    storeLocal(eventName, params);
  }

  // ──────────────────────────────────────────────
  // API pública de eventos
  // ──────────────────────────────────────────────

  /** Click en botón de WhatsApp */
  function trackWhatsapp(obraSocial, contexto) {
    track("click_whatsapp", {
      obra_social: obraSocial || "",
      contexto: contexto || "",
    });
    track("conversion_whatsapp", {
      obra_social: obraSocial || "",
      contexto: contexto || "",
    });
  }

  /** Click en botón de turno (WhatsApp con intención de turno) */
  function trackTurno(obraSocial, paginaOrigen) {
    track("click_turno", {
      obra_social: obraSocial || "",
      pagina_origen: paginaOrigen || window.location.pathname,
    });
    track("conversion_turno", {
      obra_social: obraSocial || "",
      pagina_origen: paginaOrigen || window.location.pathname,
    });
  }

  /** Click en enlace de llamada telefónica */
  function trackCall() {
    track("click_call", {
      page_path: window.location.pathname,
    });
  }

  /** Vista de página de obra social */
  function trackObraSocialView(nombre) {
    track("obra_social_view", {
      obra_social: nombre || "",
    });
  }

  /** Búsqueda en el buscador de obras sociales */
  function trackObraSocialSearch(query, resultados) {
    track("obra_social_search", {
      search_term: query || "",
      resultados: resultados !== undefined ? resultados : -1,
    });
    track("obra_social_filter", {
      search_term: query || "",
      resultados: resultados !== undefined ? resultados : -1,
    });
  }

  /** Click en un CTA de obra social específico */
  function trackObraSocialCta(obraSocial, contexto) {
    track("obra_social_cta", {
      obra_social: obraSocial || "",
      contexto: contexto || "",
    });
  }

  /** Expansión de FAQ */
  function trackFaqExpand(pregunta) {
    track("faq_expand", {
      pregunta: pregunta || "",
    });
  }

  /**
   * Tracking de scroll al 75% de la página.
   */
  function initScroll75() {
    var fired = false;
    function onScroll() {
      if (fired) return;
      var scrolled = window.scrollY + window.innerHeight;
      var total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= 0.75) {
        fired = true;
        track("scroll_75", { page_path: window.location.pathname });
        window.removeEventListener("scroll", onScroll, { passive: true });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ──────────────────────────────────────────────
  // Auto-inicialización
  // ──────────────────────────────────────────────

  function autoDetectObraSocial() {
    var OBRAS = {
      "/obras-sociales/ioma/": "IOMA",
      "/obras-sociales/pami/": "PAMI",
      "/obras-sociales/swiss-medical/": "Swiss Medical",
      "/obras-sociales/sancor/": "Sancor Salud",
      "/obras-sociales/medife/": "Medifé",
      "/obras-sociales/avalian/": "Avalian",
      "/obras-sociales/jerarquicos/": "Jerárquicos Salud",
      "/obras-sociales/prevencion/": "Prevención Salud",
    };
    var path = window.location.pathname;
    var nombre = OBRAS[path];
    if (nombre) {
      trackObraSocialView(nombre);
    }
  }

  function autoDecorateWhatsappLinks() {
    var links = document.querySelectorAll('a[href*="wa.me"]');
    links.forEach(function (link) {
      if (link.dataset.analyticsTracked) return;
      link.dataset.analyticsTracked = "1";
      link.addEventListener("click", function () {
        var obraSocial = link.dataset.obraSocial || "";
        var conversion = link.dataset.conversion || "";
        
        if (obraSocial && conversion === "turno") {
           trackObraSocialCta(obraSocial, "whatsapp_link");
        }

        if (conversion === "turno" || /turno|coordinar/i.test(link.textContent)) {
          trackTurno(obraSocial, window.location.pathname);
        } else {
          trackWhatsapp(obraSocial, link.dataset.contexto || "");
        }
      });
    });
  }

  function autoDecorateCallLinks() {
    var links = document.querySelectorAll('a[href^="tel:"]');
    links.forEach(function (link) {
      if (link.dataset.analyticsTracked) return;
      link.dataset.analyticsTracked = "1";
      link.addEventListener("click", trackCall);
    });
  }

  function autoDecorateFaqTriggers() {
    var triggers = document.querySelectorAll("[data-accordion-trigger], .faq-card h3, .faq-trigger");
    triggers.forEach(function (trigger) {
      if (trigger.dataset.analyticsTracked) return;
      trigger.dataset.analyticsTracked = "1";
      trigger.addEventListener("click", function () {
        trackFaqExpand(trigger.textContent.trim().slice(0, 80));
      });
    });
  }

  // ──────────────────────────────────────────────
  // Lectura de eventos para dashboard
  // ──────────────────────────────────────────────

  function getStoredEvents() {
    try {
      var raw = localStorage.getItem("kareh_events");
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function getSummary() {
    var events = getStoredEvents();
    var summary = {};
    events.forEach(function (e) {
      var key = e.event;
      summary[key] = (summary[key] || 0) + 1;
    });

    var obraCount = {};
    events
      .filter(function (e) { return e.event === "obra_social_view" || e.event === "click_turno" || e.event === "conversion_turno"; })
      .forEach(function (e) {
        var obra = (e.params && e.params.obra_social) || "sin_datos";
        obraCount[obra] = (obraCount[obra] || 0) + 1;
      });

    return { eventTotals: summary, obrasTotals: obraCount };
  }

  // ──────────────────────────────────────────────
  // Inicialización
  // ──────────────────────────────────────────────

  function init() {
    autoDecorateWhatsappLinks();
    autoDecorateCallLinks();
    autoDecorateFaqTriggers();
    autoDetectObraSocial();
    initScroll75();
  }

  window.kareh = window.kareh || {};
  window.kareh.track = track;
  window.kareh.trackWhatsapp = trackWhatsapp;
  window.kareh.trackTurno = trackTurno;
  window.kareh.trackCall = trackCall;
  window.kareh.trackObraSocialView = trackObraSocialView;
  window.kareh.trackObraSocialSearch = trackObraSocialSearch;
  window.kareh.trackObraSocialCta = trackObraSocialCta;
  window.kareh.trackFaqExpand = trackFaqExpand;
  window.kareh.getStoredEvents = getStoredEvents;
  window.kareh.getSummary = getSummary;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
