const site = require("./_data/site.json");
const nav = require("./_data/nav.json");
const home = require("./_data/home.json");

const professionalId = `${site.url}/#katia-alumine-romero`;
const businessId = `${site.url}/#medicalbusiness`;

module.exports = {
  schema: [
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "@id": businessId,
      name: `${site.name} - Centro de Kinesiología y Fisiatría`,
      url: `${site.url}/`,
      image: `${site.url}/assets/img/logo-icon.png`,
      description: "Centro de kinesiología y rehabilitación en Bella Vista. Atención traumatológica, postoperatoria, respiratoria y de piso pélvico.",
      priceRange: "$$",
      telephone: `+${site.whatsapp}`,
      medicalSpecialty: "https://schema.org/Physiotherapy",
      founder: { "@id": professionalId },
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.streetAddress,
        addressLocality: site.address.locality,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
      openingHoursSpecification: site.hours.map((schedule) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: schedule.dayOfWeek,
        opens: schedule.dayOfWeek[0] === "Tuesday" ? "17:30" : schedule.dayOfWeek[0] === "Saturday" ? "08:00" : "14:00",
        closes: schedule.dayOfWeek[0] === "Saturday" ? "12:00" : "19:00",
      })),
      areaServed: [
        site.address.locality,
        ...nav.footer.localities.map((locality) => locality.label),
      ].map((name) => ({ "@type": "City", name })),
      serviceType: nav.primary[0].children.map((service) => service.label),
      sameAs: Object.values(site.social),
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": professionalId,
      name: site.professional.name,
      jobTitle: "Licenciada en Kinesiología y Fisiatría",
      hasCredential: site.professional.credentials,
      worksFor: { "@id": businessId },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: `${site.url}/`,
      inLanguage: "es-AR",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: home.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};
