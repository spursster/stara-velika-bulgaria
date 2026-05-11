class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // placeholder map image, you can replace with your own asset path
    this.load.image('map', 'assets/map.png');
    // small placeholder for region markers
    this.load.image('pin', 'assets/pin.png');

    // load dynasties JSON from data folder
    this.load.json('dynasties', 'data/dynasties.json');

    // show simple loading text
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    this.loadingText = this.add.text(w/2, h/2, 'Зареждане...', { color: '#fff' }).setOrigin(0.5);
  }

  create() {
    // get JSON safely
    const raw = this.cache.json.get('dynasties');
    if (!raw || typeof raw !== 'object') {
      console.error('Неуспешно зареждане на data/dynasties.json', raw);
      this.loadingText.setText('Грешка при зареждане на данни. Виж Console.');
      return;
    }

    // normalize into array for easier iteration
    const dynasties = [];
    for (const id in raw) {
      if (!raw.hasOwnProperty(id)) continue;
      const d = raw[id];
      d.id = id;
      // ensure rulers array exists
      if (!Array.isArray(d.rulers)) d.rulers = [];
      dynasties.push(d);
    }

    // store in registry for other scenes
    this.registry.set('dynasties', dynasties);

    // start map scene
    this.scene.start('MapScene');
    this.scene.launch('UIScene');
  }
}
