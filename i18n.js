window.I18N = (function () {
  let strings = {};
  let currentLang = GameConfig.defaultLanguage;

  async function loadLanguage(lang) {
    currentLang = lang;
    const res = await fetch(`data/i18n/ui_${lang}.json`);
    strings = await res.json();
  }

  function t(key) {
    return strings[key] || key;
  }

  function getCurrentLang() {
    return currentLang;
  }

  return { loadLanguage, t, getCurrentLang };
})();
