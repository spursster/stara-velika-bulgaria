(function renderTopbar() {
  const el = document.getElementById('topbar');
  if (!el) return;

  el.innerHTML = `
    <div class="topbar-left">
      <span class="topbar-year" id="topbar-year"></span>
    </div>
    <div class="topbar-center">
      <button id="btn-new-game">${I18N.t('ui.newGame')}</button>
      <button id="btn-save">${I18N.t('ui.save')}</button>
      <button id="btn-next-turn">${I18N.t('ui.nextTurn')}</button>
    </div>
    <div class="topbar-right">
      <select id="lang-switch">
        <option value="bg">BG</option>
        <option value="en">EN</option>
        <option value="ru">RU</option>
      </select>
      <button id="btn-notifications">🔔</button>
    </div>
  `;

  document
    .getElementById('btn-next-turn')
    .addEventListener('click', () => TurnManager.nextTurn());

  document
    .getElementById('btn-save')
    .addEventListener('click', () => SaveSystem.save());

  document
    .getElementById('btn-new-game')
    .addEventListener('click', () => SaveSystem.newGame());

  document
    .getElementById('lang-switch')
    .addEventListener('change', async (e) => {
      await I18N.loadLanguage(e.target.value);
      // TODO: re-render UI
    });

  updateYear();

  function updateYear() {
    const year = Registry.get('year');
    const elYear = document.getElementById('topbar-year');
    if (!elYear) return;
    elYear.textContent = `${I18N.t('ui.year')}: ${year}`;
  }

  window.UIUpdateTopbarYear = updateYear;
})();
