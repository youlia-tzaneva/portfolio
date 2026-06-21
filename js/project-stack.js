document.addEventListener("DOMContentLoaded", () => {
  const stack = document.querySelector(".projects-stack");
  if (!stack) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const items = Array.from(stack.querySelectorAll(".project-stack-item"));
  if (items.length < 2) return;

  const MIN_RUNWAY = 120;

  function getRunway(project) {
    const cardHeight = project.getBoundingClientRect().height;
    const viewport = window.innerHeight;
    return Math.max(MIN_RUNWAY, viewport - cardHeight, viewport * 0.35);
  }

  function updateStackGaps() {
    items.forEach((item, index) => {
      if (index === items.length - 1) {
        item.style.removeProperty("padding-bottom");
        return;
      }

      const project = item.querySelector(".project");
      if (!project) return;

      item.style.paddingBottom = `${getRunway(project)}px`;
    });
  }

  let resizeTimer;
  function scheduleUpdate() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateStackGaps, 100);
  }

  updateStackGaps();
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("load", updateStackGaps);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateStackGaps);
  }

  items.forEach((item) => {
    item.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", scheduleUpdate, { once: true });
      }
    });
  });

  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(scheduleUpdate);
    items.forEach((item) => {
      const project = item.querySelector(".project");
      if (project) observer.observe(project);
    });
  }

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      items.forEach((item) => item.style.removeProperty("padding-bottom"));
      return;
    }
    updateStackGaps();
  });
});
