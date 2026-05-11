window.gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 600,
  backgroundColor: '#1b1b2f',
  scene: []
};

// Register scenes dynamically after files load
window.addEventListener('load', () => {
  // Scenes are defined in separate files and will register themselves on the global Phaser namespace
  const config = Object.assign({}, window.gameConfig, { scene: [BootScene, MapScene, UIScene] });
  window.game = new Phaser.Game(config);
});
