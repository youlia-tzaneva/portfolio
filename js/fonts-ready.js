(function () {
  var root = document.documentElement;

  function reveal() {
    root.classList.remove("fonts-loading");
    root.classList.add("fonts-ready");
  }

  if (!document.fonts || !document.fonts.load) {
    reveal();
    return;
  }

  var criticalFonts = [
    '400 16px "Domaine Display Narrow"',
    '700 16px "Domaine Display Narrow"',
    '400 16px CasualScript',
    '400 16px Raleway',
    '700 16px Raleway',
  ];

  Promise.all(
    criticalFonts.map(function (spec) {
      return document.fonts.load(spec).catch(function () {
        return undefined;
      });
    })
  ).then(reveal);

  setTimeout(reveal, 2500);
})();
