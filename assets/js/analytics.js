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
  const message = isServicePage
    ? `Hola, quisiera consultar por ${heading}.`
    : `Hola, quisiera consultar por atención desde ${heading.replace(/^Kinesiología para pacientes de\s+/i, "")}.`;

  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
    if (!link.dataset.service) link.dataset.service = heading;
    if (!link.dataset.conversionContext) link.dataset.conversionContext = context;

    const url = new URL(link.href);
    if (!url.searchParams.has("text")) {
      url.searchParams.set("text", message);
      link.href = url.toString();
    }
  });
};

addWhatsAppContext();

document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href") || "";

  if (href.includes("wa.me")) {
    link.addEventListener("click", () => {
      const isAppointmentRequest =
        link.dataset.conversion === "turno" ||
        /turno|coordinar|consultar|whatsapp/i.test(getLinkLabel(link));

      sendGaEvent("click_whatsapp", {
        link_url: link.href,
        link_text: getLinkLabel(link),
        ...getConversionParams(link),
      });

      if (isAppointmentRequest) {
        sendGaEvent("click_turno", {
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

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", () => {
    sendGaEvent("formulario_enviado", {
      form_id: form.id || "",
      form_name: form.getAttribute("name") || "",
      ...getConversionParams(form),
    });
  });
});
