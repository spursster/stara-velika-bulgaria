// main.js — пълен, коригиран, готов за работа

(async function bootstrap() {
  console.log("Bootstrapping game...");

  // 1. Зареждаме езика
  await I18N.loadLanguage(GameConfig.defaultLanguage);

  // 2. Зареждаме династиите
  try {
    const dynasties = await fetch('data/dynasties.json').then(r => r.json());
    Registry.set('dynasties', dynasties);
  } catch (err) {
    console.error("Грешка при зареждане на dynasties.json:", err);
  }

  // 3. Рендер на UI панелите
  if (window.DynastiesPanel) {
    DynastiesPanel.render();
  }

  // 4. Обновяване на годината в топбара
  if (window.UIUpdateTopbarYear) {
    UIUpdateTopbarYear();
  }

  console.log("Game bootstrapped successfully.");
})();
