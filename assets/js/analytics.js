const sendGaEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    page_path: window.location.pathname,
    page_title: document.title,
    ...params,
  });
};

const getLinkLabel = (link) =>
  link.textContent?.replace(/\s+/g, " ").trim() || link.getAttribute("aria-label") || "";

const getConversionParams = (element) => ({
  service_area: element.dataset.service || "",
  patient_segment: element.dataset.segment || "",
  coverage: element.dataset.coverage || "",
  conversion_context: element.dataset.conversionContext || "",
});

const addWhatsAppContext = () => {
  const path = window.location.pathname.replace(/\/$/, "");
  const isServicePage = path.startsWith("/servicios/") && path !== "/servicios";
  const isLocalityPage = path.startsWith("/localidades/");

  if (!isServicePage && !isLocalityPage) return;

  const heading = document.querySelector("main h1")?.textContent?.replace(/\s+/g, " ").trim();
  if (!heading) return;

  const context = isServicePage ? "service_detail" : "locality";

  // Los mensajes precargados se definen en las plantillas (filtro waLink); acá solo se agrega contexto para Analytics.
  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
    if (!link.dataset.service) link.dataset.service = heading;
    if (!link.dataset.conversionContext) link.dataset.conversionContext = context;
  });
};

addWhatsAppContext();

const getCtaType = (link) => {
  if (link.dataset.coverage) return "cobertura";
  if (link.dataset.conversion === "turno" || /turno|coordinar|consultar/i.test(getLinkLabel(link))) return "turno";
  return "general";
};

document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href") || "";

  if (href.includes("wa.me")) {
    // Un solo evento por clic; el tipo de consulta va como parámetro (cta_type) en lugar de eventos duplicados.
    link.addEventListener("click", () => {
      sendGaEvent("click_whatsapp", {
        link_url: link.href,
        link_text: getLinkLabel(link),
        cta_type: getCtaType(link),
        ...getConversionParams(link),
      });
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

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", () => {
    sendGaEvent("formulario_enviado", {
      form_id: form.id || "",
      form_name: form.getAttribute("name") || "",
      ...getConversionParams(form),
    });
  });
});
