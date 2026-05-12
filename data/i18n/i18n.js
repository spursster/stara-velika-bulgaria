// data/i18n/i18n.js
window.I18N = (function () {
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
      // примерни имена (можеш да ги разшириш)
      "dynasty.dulo": "Дуло",
      "dynasty.krum": "Крумова династия"
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

  return {
    loadLanguage(lang) {
      return new Promise((resolve) => {
        if (!lang) lang = current;
        if (!translations[lang]) lang = 'bg';
        current = lang;
        // симулираме async зареждане за съвместимост с await
        setTimeout(() => resolve({ lang: current }), 0);
      });
    },
    t(key, fallback) {
      const dict = translations[current] || {};
      return dict[key] || fallback || key;
    },
    getCurrent() {
      return current;
    },
    addTranslations(lang, obj) {
      translations[lang] = Object.assign({}, translations[lang] || {}, obj);
    }
  };
})();
