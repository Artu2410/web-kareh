const yearNode = document.querySelector("#year");
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

const experienceNode = document.getElementById("years-experience");
if (experienceNode) {
  const startYear = 2022;
  experienceNode.textContent = String(Math.max(1, new Date().getFullYear() - startYear));
}
