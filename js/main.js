// js/main.js
window.gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1200,
  height: 780,
  backgroundColor: '#071021',
  scene: []
};

window.addEventListener('load', () => {
  // Scenes will be defined in separate files and register global classes BootScene, MapScene, UIScene
  const scenes = [];
  if (typeof BootScene !== 'undefined') scenes.push(BootScene);
  if (typeof MapScene !== 'undefined') scenes.push(MapScene);
  if (typeof UIScene !== 'undefined') scenes.push(UIScene);
  // fallback: if scenes not yet defined, Phaser will error; ensure files loaded in index.html order
  const config = Object.assign({}, window.gameConfig, { scene: scenes });
  window.game = new Phaser.Game(config);
});
