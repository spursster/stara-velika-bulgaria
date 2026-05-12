// data/i18n/i18n.js
// Разширен I18N shim с допълнителни ключове и безопасен fallback.
(function (global) {
  if (global.I18N) return;

  const translations = {
    bg: {
      "ui.year": "Година",
      "topbar.year": "Година",
      "year": "Година",
      "ui.newGame": "Нова игра",
      "ui.save": "Запази",
      "ui.nextTurn": "Следващ ход",
      "ui.dynasties": "Династии",
      "ui.rulers": "Владетели",
      "ui.map": "Карта",
      "ui.unclaimed": "Непретендирани",
      "ui.notifications": "Известия",
      "lang.code": "BG",
      "btn.ok": "ОК",
      "btn.cancel": "Отказ",
      "dynasty.dulo": "Дуло",
      "dynasty.krum": "Крумова династия",
      "region.mizia": "Мизия",
      "region.thrace": "Тракия",
      "region.scythia": "Скития"
    },
    en: {
      "ui.year": "Year",
      "topbar.year": "Year",
      "year": "Year",
      "ui.newGame": "New Game",
      "ui.save": "Save",
      "ui.nextTurn": "Next Turn",
      "ui.dynasties": "Dynasties",
      "ui.rulers": "Rulers",
      "ui.map": "Map",
      "ui.unclaimed": "Unclaimed",
      "ui.notifications": "Notifications",
      "lang.code": "EN",
      "btn.ok": "OK",
      "btn.cancel": "Cancel"
    }
  };

  let current = 'bg';

  function safeString(v) {
    if (v === null || v === undefined) return '';
    return String(v);
  }

  function lookup(key, fallback) {
    if (!key) return fallback || '';
    const dict = translations[current] || {};
    if (dict.hasOwnProperty(key)) return dict[key];
    // опитваме някои често срещани варианти
    const altKeys = [key.toLowerCase(), key.replace(/\s+/g, '.'), key.replace(/\./g, '_')];
    for (let i = 0; i < altKeys.length; i++) {
      if (dict.hasOwnProperty(altKeys[i])) return dict[altKeys[i]];
    }
    return fallback !== undefined ? fallback : null;
  }

  const I18N = {
    loadLanguage(lang) {
      return new Promise((resolve) => {
        if (!lang) lang = current;
        if (!translations[lang]) lang = 'bg';
        current = lang;
        resolve({ lang: current });
      });
    },
    t(key, fallback) {
      const val = lookup(key, fallback);
      if (val === null) {
        // ако няма превод, връщаме ключа като fallback, но без да е undefined
        return safeString(fallback !== undefined ? fallback : key);
      }
      return safeString(val);
    },
    getCurrent() {
      return current;
    },
    addTranslations(lang, obj) {
      translations[lang] = Object.assign({}, translations[lang] || {}, obj);
    },
    ensure(key, defaultText) {
      if (!translations[current]) translations[current] = {};
      if (!translations[current].hasOwnProperty(key)) translations[current][key] = defaultText;
      return translations[current][key];
    }
  };

  global.I18N = I18N;
})(window);
