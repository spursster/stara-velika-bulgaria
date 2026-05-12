// data/i18n/i18n.js
window.I18N = (function () {
  const translations = {
    bg: {
      "topbar.year": "Година",
      "topbar.new_game": "Нова игра",
      "topbar.save": "Запази",
      "topbar.next_turn": "Следващ ход"
      // добави още ключове, ако имаш нужда
    },
    en: {
      "topbar.year": "Year",
      "topbar.new_game": "New Game",
      "topbar.save": "Save",
      "topbar.next_turn": "Next Turn"
    }
  };

  let current = 'bg';

  return {
    loadLanguage(lang) {
      return new Promise((resolve) => {
        if (!lang) lang = current;
        // ако нямаш превод за езика, fallback на bg
        if (!translations[lang]) lang = 'bg';
        current = lang;
        // симулираме async зареждане (съвместим с await в main.js)
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
    // помощна функция за добавяне/разширяване на преводи
    addTranslations(lang, obj) {
      translations[lang] = Object.assign({}, translations[lang] || {}, obj);
    }
  };
})();
