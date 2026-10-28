module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("waLink", (text, phone) => {
    if (!phone) {
      throw new Error("El filtro waLink requiere el número de WhatsApp del sitio.");
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(text || "")}`;
  });

  [
    "admin",
    "assets",
    "CNAME",
    "google45399c88f51b91b9.html",
    "llms.txt",
    "robots.txt",
    "script.js",
    "sitemap.xml",
  ].forEach((path) => eleventyConfig.addPassthroughCopy(path));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk"],
  };
};
