module.exports = function (eleventyConfig) {

  const monthsEs = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  eleventyConfig.addFilter("esDate", (value) => {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${Number(match[3])} de ${monthsEs[Number(match[2]) - 1]} de ${match[1]}` : value;
  });

  const { execFileSync } = require("node:child_process");
  const gitDates = new Map();
  eleventyConfig.addFilter("lastModified", (inputPath) => {
    if (!inputPath) return new Date().toISOString().slice(0, 10);
    if (!gitDates.has(inputPath)) {
      let date = "";
      try {
        date = execFileSync("git", ["log", "-1", "--format=%cs", "--", inputPath], { encoding: "utf8" }).trim();
      } catch (error) {
        date = "";
      }
      gitDates.set(inputPath, date || new Date().toISOString().slice(0, 10));
    }
    return gitDates.get(inputPath);
  });

  const decodeEntities = (text) =>
    text
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&#x27;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");

  eleventyConfig.addFilter("mainText", (html) => {
    if (!html) return "";
    const main = (html.match(/<main[\s\S]*?<\/main>/) || [html])[0];
    return decodeEntities(
      main
        .replace(/<(script|style|svg|noscript)[\s\S]*?<\/\1>/g, " ")
        .replace(/<(h[1-6])[^>]*>/g, "\n\n## ")
        .replace(/<li[^>]*>/g, "\n- ")
        .replace(/<\/(p|div|section|article|ul|ol|h[1-6]|li|tr)>/g, "\n")
        .replace(/<br\s*\/?>/g, "\n")
        .replace(/<[^>]+>/g, " ")
    )
      .split("\n")
      .map((line) => line.replace(/[ \t]+/g, " ").trim())
      .filter((line, index, lines) => line || (lines[index - 1] || "").trim())
      .join("\n")
      .replace(/^## \n+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  });

  eleventyConfig.addCollection("publicPages", (collectionApi) =>
    collectionApi
      .getAll()
      .filter((item) => item.url && item.url.endsWith("/"))
      .filter((item) => !item.url.startsWith("/admin"))
      .filter((item) => !String(item.data.robots || "").includes("noindex"))
      .filter((item) => !item.data.excludeFromSitemap)
      .sort((a, b) => (a.data.sitemapOrder ?? 50) - (b.data.sitemapOrder ?? 50) || a.url.localeCompare(b.url))
  );

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
