const yearNode = document.querySelector("#year");
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

// Años de experiencia: el año de inicio viene de site.json (experienceStartYear) y se recalcula cada año.
document.querySelectorAll("[data-years-since]").forEach((node) => {
  const startYear = Number(node.dataset.yearsSince);
  if (startYear) node.textContent = String(Math.max(1, new Date().getFullYear() - startYear));
});

const coverageSearch = document.querySelector("#home-coverage-search");
const coverageList = document.querySelector("#home-coverage-list");
const coverageEmpty = document.querySelector("#home-coverage-empty");

if (coverageSearch && coverageList && coverageEmpty) {
  const cards = [...coverageList.querySelectorAll("[data-coverage-name]")];
  const normalize = value => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();

  coverageSearch.addEventListener("input", () => {
    const term = normalize(coverageSearch.value.trim());
    const visibleCount = cards.reduce((count, card) => {
      const matches = normalize(card.dataset.coverageName).includes(term);
      card.hidden = !matches;
      return count + Number(matches);
    }, 0);

    coverageEmpty.hidden = visibleCount > 0;
  });
}
