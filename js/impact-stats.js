document.addEventListener("DOMContentLoaded", () => {
  const statGroups = document.querySelectorAll(".oak-impact__stats");
  if (!statGroups.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const DURATION = 2400;
  const animatedGroups = new WeakSet();

  function easeOutGentle(t) {
    // Stronger deceleration near the target for a smoother landing
    return 1 - (1 - t) ** 7.2;
  }

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

  function isVisibleEnough(el) {
    const rect = el.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, viewportHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    return visibleHeight >= Math.min(rect.height * 0.25, 32);
  }

  function animateGroup(group) {
    if (animatedGroups.has(group)) return;
    animatedGroups.add(group);

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
      const progress = easeOutGentle(Math.min((now - start) / DURATION, 1));

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

  function tryAnimate(group) {
    if (animatedGroups.has(group)) return;
    if (!isVisibleEnough(group)) return;

    animateGroup(group);
    observer.unobserve(group);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.15) return;
        tryAnimate(entry.target);
      });
    },
    { threshold: [0, 0.15, 0.35], rootMargin: "0px 0px -5% 0px" }
  );

  statGroups.forEach((group) => observer.observe(group));

  requestAnimationFrame(() => {
    statGroups.forEach((group) => tryAnimate(group));
  });
});
