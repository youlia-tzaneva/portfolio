document.addEventListener("DOMContentLoaded", () => {
  const statGroups = document.querySelectorAll(".oak-impact__stats");
  if (!statGroups.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const DURATION = 1200;

  function parseStatText(text) {
    const trimmed = text.trim();
    const match = trimmed.match(/^([+\-]?)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match) return null;

    const prefix = match[1];
    const numericPart = match[2];
    const suffix = match[3];
    const useCommas = numericPart.includes(",");
    const value = parseFloat(numericPart.replace(/,/g, ""));

    if (Number.isNaN(value)) return null;

    return { prefix, suffix, value, useCommas, formatted: trimmed };
  }

  function formatValue(current, { prefix, suffix, useCommas }) {
    const rounded = Math.round(current);
    const numberText = useCommas
      ? rounded.toLocaleString("en-US")
      : String(rounded);
    return `${prefix}${numberText}${suffix}`;
  }

  function animateGroup(group) {
    const stats = [...group.querySelectorAll(".oak-stat__number")]
      .map((el) => {
        const parsed = parseStatText(el.textContent);
        return parsed ? { el, ...parsed } : null;
      })
      .filter(Boolean);

    if (!stats.length) return;

    stats.forEach((stat) => {
      stat.el.textContent = formatValue(0, stat);
    });

    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1);

      stats.forEach((stat) => {
        stat.el.textContent = formatValue(stat.value * progress, stat);
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        stats.forEach((stat) => {
          stat.el.textContent = stat.formatted;
        });
      }
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateGroup(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  statGroups.forEach((group) => observer.observe(group));
});
