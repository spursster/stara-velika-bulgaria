// js/scene_map.js
class MapScene extends Phaser.Scene {
  constructor() { super({ key: 'MapScene' }); }

  create() {
    const map = this.add.image(0, 0, 'map').setOrigin(0);
    // scale map to fit
    const scaleX = this.cameras.main.width / map.width;
    const scaleY = this.cameras.main.height / map.height;
    const scale = Math.min(scaleX, scaleY);
    map.setScale(scale);

    const dynasties = this.registry.get('dynasties') || [];
    if (!Array.isArray(dynasties)) {
      console.warn('No dynasties found in registry');
      return;
    }

    // create markers from coords
    dynasties.forEach(d => {
      const x = d.coords && typeof d.coords.x === 'number' ? d.coords.x : 100;
      const y = d.coords && typeof d.coords.y === 'number' ? d.coords.y : 100;
      const marker = this.add.image(x, y, 'pin').setInteractive({ useHandCursor: true });
      marker.setData('dynId', d.id);
      marker.setScale(1.2);
      marker.on('pointerdown', () => this.onRegionClick(d.id));
      // label
      const label = this.add.text(x + 18, y - 8, d.name || d.id, { fontSize: '12px', color: '#fff' });
      label.setDepth(10);
    });

    console.log('MapScene ready. Dynasties:', dynasties.length);
  }

  onRegionClick(dynId) {
    const dynasties = this.registry.get('dynasties') || [];
    const dynasty = dynasties.find(dd => dd.id === dynId);
    const ui = this.scene.get('UIScene');
    if (ui && typeof ui.showRegionInfo === 'function') ui.showRegionInfo(dynId, dynasty);
  }
}
