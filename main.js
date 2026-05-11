(async function bootstrap() {
  await I18N.loadLanguage(GameConfig.defaultLanguage);

  // TODO: load data JSON (civilizations, dynasties, rulers, items, etc.)
  // await DataLoader.loadAll();

  // TODO: init systems (Dynasties, Rulers, Inventory, Abilities, Units, Combat, Rituals, Council, AI, etc.)

  // първоначален рендер на панелите
  // DynastiesPanel.render();
  // MapScene.render();
  // ExpeditionsPanel.render();
  // NotificationsPanel.render();
  // CouncilPanel.render();

  console.log('Game bootstrapped at year', Registry.get('year'));
})();
