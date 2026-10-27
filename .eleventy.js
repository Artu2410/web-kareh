module.exports = function (eleventyConfig) {
  [
    "admin",
    "assets",
    "CNAME",
    "google45399c88f51b91b9.html",
    "IMG-20260111-384.jpg",
    "IMG-20260111-512.jpg",
    "llms.txt",
    "logo-icon-192.png",
    "logo-icon-240.png",
    "logo-icon-96.png",
    "logo-icon.png",
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
