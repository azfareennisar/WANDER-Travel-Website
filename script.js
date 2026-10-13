const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const moodSelect = document.querySelector("#moodSelect");
const cards = [...document.querySelectorAll(".destination-card")];
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const resultsCount = document.querySelector("#resultsCount");
const noResults = document.querySelector("#noResults");
const grid = document.querySelector("#destinationGrid");
let activeFilter = "all";

function applyFilters() {
  const term = searchInput.value.trim().toLowerCase();
  const mood = moodSelect.value;
  const category = mood !== "all" ? mood : activeFilter;
  let visible = 0;

  cards.forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    const categories = card.dataset.category.split(" ");
    const matchesText = !term || name.includes(term) || card.textContent.toLowerCase().includes(term);
    const matchesCategory = category === "all" || categories.includes(category);
    const show = matchesText && matchesCategory;
    card.hidden = !show;
    if (show) {
      visible++;
      card.style.animationDelay = `${Math.min(visible * 55, 250)}ms`;
    }
  });

  resultsCount.textContent = `${visible} ${visible === 1 ? "place" : "places"} to wander`;
  noResults.hidden = visible !== 0;
  grid.hidden = visible === 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    moodSelect.value = "all";
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    applyFilters();
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters();
  document.querySelector("#destinations").scrollIntoView({ behavior: "smooth" });
});
searchInput.addEventListener("input", applyFilters);
moodSelect.addEventListener("change", () => {
  if (moodSelect.value !== "all") {
    filterButtons.forEach((item) => {
      const selected = item.dataset.filter === moodSelect.value;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
  } else {
    filterButtons.forEach((item) => {
      const selected = item.dataset.filter === activeFilter;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
  }
  applyFilters();
});

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("open", !expanded);
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});

const newsletterForm = document.querySelector("#newsletterForm");
const formMessage = document.querySelector("#formMessage");
newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!newsletterForm.reportValidity()) return;
  const email = document.querySelector("#emailInput").value.trim();
  formMessage.textContent = `You're on the list! Travel inspiration is coming your way at ${email}.`;
  newsletterForm.reset();
});
document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelectorAll(".heart").forEach((heart) => {
  heart.setAttribute("role", "button");
  heart.setAttribute("tabindex", "0");
  heart.setAttribute("aria-label", "Save destination");
  const toggleSaved = () => {
    const saved = heart.textContent.trim() === "♥";
    heart.textContent = saved ? "♡" : "♥";
    heart.style.color = saved ? "" : "#c65364";
    heart.setAttribute("aria-label", saved ? "Save destination" : "Remove saved destination");
  };
  heart.addEventListener("click", (event) => { event.preventDefault(); toggleSaved(); });
  heart.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleSaved(); }
  });
});
