// ui_panels/topbar.js
(function () {
  // безопасни зависимости
  const I18N = window.I18N || { t: (k, f) => (f || k) };
  const Registry = window.Registry || { get: () => undefined, on: () => () => {} , set: () => {} };
  const GameConfig = window.GameConfig || { startYear: 680 };

  function createButton(text, cls) {
    const btn = document.createElement('button');
    btn.className = cls || 'topbar-btn';
    btn.textContent = text;
    btn.style.marginLeft = '8px';
    btn.style.padding = '6px 10px';
    btn.style.border = 'none';
    btn.style.background = '#34495e';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.borderRadius = '3px';
    return btn;
  }

  function renderTopbar(year) {
    const container = document.getElementById('topbar');
    if (!container) return;

    // чистим и създаваме съдържание
    container.innerHTML = '';

    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '12px';

    const yearLabel = document.createElement('div');
    yearLabel.style.fontWeight = '700';
    yearLabel.style.fontSize = '15px';
    yearLabel.innerHTML = `${I18N.t('ui.year', 'Година')}: <span id="topbar-year">${year}</span>`;

    left.appendChild(yearLabel);

    const newGameBtn = createButton(I18N.t('ui.newGame', 'Нова игра'), 'btn-newgame');
    const saveBtn = createButton(I18N.t('ui.save', 'Запази'), 'btn-save');
    const nextTurnBtn = createButton(I18N.t('ui.nextTurn', 'Следващ ход'), 'btn-nextturn');

    left.appendChild(newGameBtn);
    left.appendChild(saveBtn);
    left.appendChild(nextTurnBtn);

    // десен контейнер (език и нотификации)
    const right = document.createElement('div');
    right.style.marginLeft = 'auto';
    right.style.display = 'flex';
    right.style.alignItems = 'center';
    right.style.gap = '10px';

    const lang = document.createElement('div');
    lang.textContent = (I18N.t('lang.code') || 'BG');
    lang.style.opacity = '0.9';
    lang.style.fontSize = '13px';

    const bell = document.createElement('div');
    bell.textContent = '🔔';
    bell.title = I18N.t('ui.notifications', 'Известия');

    right.appendChild(lang);
    right.appendChild(bell);

    container.appendChild(left);
    container.appendChild(right);

    // handlers
    newGameBtn.addEventListener('click', function () {
      // прост fallback: нулираме година към стартовата
      const start = GameConfig && GameConfig.startYear ? GameConfig.startYear : 680;
      Registry.set('year', start);
      // ако имаш функция за нова игра, можеш да я извикаш тук
      console.log('New game triggered, year reset to', start);
    });

    saveBtn.addEventListener('click', function () {
      // placeholder за save
      console.log('Save requested');
      // ако имаш Registry.save или друга функция, извикай я
      if (typeof window.saveGame === 'function') window.saveGame();
    });

    nextTurnBtn.addEventListener('click', function () {
      const current = Registry.get('year');
      const next = (typeof current === 'number') ? current + 1 : (GameConfig && GameConfig.startYear ? GameConfig.startYear + 1 : 681);
      Registry.set('year', next);
      console.log('Next turn ->', next);
    });
  }

  // Инициализация: вземаме година от Registry, ако няма — fallback към GameConfig.startYear
  const initialYear = (function () {
    const r = Registry.get('year');
    if (typeof r === 'number') return r;
    if (r !== undefined && r !== null && r !== '') {
      const parsed = parseInt(r, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return (GameConfig && GameConfig.startYear) ? GameConfig.startYear : 680;
  })();

  // първоначален рендер
  renderTopbar(initialYear);

  // слушаме промени в Registry за ключ 'year'
  Registry.on('year', function (val) {
    const el = document.getElementById('topbar-year');
    const year = (typeof val === 'number') ? val : (parseInt(val, 10) || (GameConfig && GameConfig.startYear ? GameConfig.startYear : 680));
    if (el) el.textContent = year;
    else renderTopbar(year);
  });

  // ако някой модул зададе година след зареждането, ще бъде уловено от listener-а
})();
