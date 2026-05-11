// js/scene_boot.js
class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    // load SVG map and pin as images (Phaser supports SVG via loader as data URL if server serves them)
    this.load.svg('map', 'assets/map.svg');
    this.load.svg('pin', 'assets/pin.svg');

    // load dynasties JSON
    this.load.json('dynasties', 'data/dynasties.json');

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    this.loadingText = this.add.text(w/2, h/2, 'Зареждане...', { color: '#fff' }).setOrigin(0.5);
  }

  create() {
    const raw = this.cache.json.get('dynasties');
    if (!raw || typeof raw !== 'object') {
      console.error('Неуспешно зареждане на data/dynasties.json', raw);
      this.loadingText.setText('Грешка при зареждане на данни. Виж Console.');
      return;
    }

    // normalize into array
    const dynasties = [];
    for (const id in raw) {
      if (!Object.prototype.hasOwnProperty.call(raw, id)) continue;
      const d = Object.assign({}, raw[id]);
      d.id = id;
      if (!Array.isArray(d.rulers)) d.rulers = [];
      if (!d.coords || typeof d.coords.x !== 'number') d.coords = { x: 100 + (dynasties.length * 80), y: 120 + (dynasties.length * 20) };
      dynasties.push(d);
    }

    this.registry.set('dynasties', dynasties);
    this.scene.start('MapScene');
    this.scene.launch('UIScene');
  }
}
