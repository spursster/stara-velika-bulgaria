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

  // 3. Зареждаме регионите за картата
  try {
    const regions = await fetch('data/map_regions.json').then(r => r.json());
    Registry.set('mapRegions', regions);
  } catch (err) {
    console.error("Грешка при зареждане на map_regions.json:", err);
  }

  // 4. Рендер на UI панелите
  if (window.DynastiesPanel) DynastiesPanel.render();
  if (window.MapScene) MapScene.render();
  if (window.Notifications) Notifications.render();

  // 5. Обновяване на годината в топбара
  if (window.UIUpdateTopbarYear) UIUpdateTopbarYear();

  console.log("Game bootstrapped successfully.");
})();
