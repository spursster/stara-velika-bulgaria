// data/i18n/i18n.js
// Надежден I18N shim: винаги дефинира window.I18N и връща безопасни стойности.
(function (global) {
  if (global.I18N) return;

  const translations = {
    bg: {
      "ui.year": "Година",
      "ui.newGame": "Нова игра",
      "ui.save": "Запази",
      "ui.nextTurn": "Следващ ход",
      "ui.dynasties": "Династии",
      "ui.rulers": "Владетели",
      "ui.map": "Карта",
      "ui.unclaimed": "Непретендирани",
      "ui.notifications": "Известия",
      // примерни династични имена и региони, разширявай при нужда
      "dynasty.dulo": "Дуло",
      "dynasty.krum": "Крумова династия",
      "region.mizia": "Мизия",
      "region.thrace": "Тракия",
      "region.scythia": "Скития"
    },
    en: {
      "ui.year": "Year",
      "ui.newGame": "New Game",
      "ui.save": "Save",
      "ui.nextTurn": "Next Turn",
      "ui.dynasties": "Dynasties",
      "ui.rulers": "Rulers",
      "ui.map": "Map",
      "ui.unclaimed": "Unclaimed",
      "ui.notifications": "Notifications"
    }
  };

  let current = 'bg';

  function safeString(v) {
    if (v === null || v === undefined) return '';
    return String(v);
  }

  const I18N = {
    loadLanguage(lang) {
      return new Promise((resolve) => {
        if (!lang) lang = current;
        if (!translations[lang]) lang = 'bg';
        current = lang;
        // синхронно задаваме и връщаме promise за съвместимост
        resolve({ lang: current });
      });
    },
    t(key, fallback) {
      if (!key) return fallback || '';
      const dict = translations[current] || {};
      const val = dict.hasOwnProperty(key) ? dict[key] : (fallback !== undefined ? fallback : key);
      return safeString(val);
    },
    getCurrent() {
      return current;
    },
    addTranslations(lang, obj) {
      translations[lang] = Object.assign({}, translations[lang] || {}, obj);
    },
    // помощна функция за бърз fallback при липсващи ключове
    ensure(key, defaultText) {
      if (!translations[current]) translations[current] = {};
      if (!translations[current].hasOwnProperty(key)) translations[current][key] = defaultText;
      return translations[current][key];
    }
  };

  global.I18N = I18N;
})(window);
