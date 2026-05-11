class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MapScene' });
  }

  create() {
    // background map
    const map = this.add.image(0, 0, 'map').setOrigin(0);
    // scale to fit
    const scaleX = this.cameras.main.width / map.width;
    const scaleY = this.cameras.main.height / map.height;
    const scale = Math.min(scaleX, scaleY);
    map.setScale(scale);

    // get dynasties from registry
    const dynasties = this.registry.get('dynasties') || [];
    // create simple clickable markers for demo
    // positions are placeholders; later you can provide region coordinates in JSON
    const positions = [
      {x:100,y:120, id: 'dulo'},
      {x:220,y:200, id: 'komitopuli'},
      {x:420,y:160, id: 'asenevtsi'},
      {x:600,y:240, id: 'shishman'},
      {x:760,y:120, id: 'ptolomei'}
    ];

    positions.forEach((pos, idx) => {
      const marker = this.add.image(pos.x, pos.y, 'pin').setInteractive({ useHandCursor: true });
      marker.setData('regionId', pos.id);
      marker.on('pointerdown', () => this.onRegionClick(pos.id));
      // label
      const dynasty = dynasties.find(d => d.id === pos.id);
      const label = dynasty ? dynasty.name : pos.id;
      this.add.text(pos.x + 12, pos.y - 6, label, { fontSize: '12px', color: '#fff' });
    });

    // debug log
    console.log('MapScene created. Dynasties loaded:', dynasties.length);
  }

  onRegionClick(regionId) {
    const dynasties = this.registry.get('dynasties') || [];
    const dynasty = dynasties.find(d => d.id === regionId);
    // send event to UI scene
    this.scene.get('UIScene').showRegionInfo(regionId, dynasty);
  }
}
