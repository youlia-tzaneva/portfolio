document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  const icon = toggle.querySelector("i");

  const setMenuOpen = (isOpen) => {
    menu.hidden = !isOpen;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", isOpen);

    if (icon) {
      icon.classList.toggle("ph-list", !isOpen);
      icon.classList.toggle("ph-x", isOpen);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
});
