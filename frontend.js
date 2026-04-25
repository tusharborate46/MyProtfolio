// TAB SWITCHING
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById("panel-" + tab.dataset.panel).classList.add("active");
  });
});

// THEME TOGGLE
const btn = document.getElementById("themeBtn");

btn.addEventListener("click", () => {
  const html = document.documentElement;

  if (html.getAttribute("data-theme") === "dark") {
    html.setAttribute("data-theme", "light");
  } else {
    html.setAttribute("data-theme", "dark");
  }
});