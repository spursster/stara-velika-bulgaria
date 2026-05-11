// js/scene_ui.js
class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene', active: true }); }

  create() {
    const root = document.getElementById('ui-root');
    root.innerHTML = `
      <div>
        <span class="button" id="new-game">Нова игра</span>
        <span class="button" id="save-game">Запази</span>
        <span class="button" id="load-game">Зареди</span>
        <span class="panel small" id="status">Статус: готов</span>
      </div>
      <div id="dynasty-list" style="margin-top:10px"></div>
      <div id="region-info"></div>
    `;

    document.getElementById('new-game').addEventListener('click', () => this.newGame());
    document.getElementById('save-game').addEventListener('click', () => this.saveGame());
    document.getElementById('load-game').addEventListener('click', () => this.loadGame());

    this.renderDynasties();
  }

  renderDynasties() {
    const dyn = this.registry.get('dynasties') || [];
    const container = document.getElementById('dynasty-list');
    container.innerHTML = '';
    if (!Array.isArray(dyn) || dyn.length === 0) {
      container.innerHTML = '<div class="panel">Няма заредени династии</div>';
      return;
    }
    dyn.forEach(d => {
      const el = document.createElement('div');
      el.className = 'dynasty-item';
      el.innerText = d.name + ' (' + (d.founder || '-') + ')';
      container.appendChild(el);
    });
  }

  showRegionInfo(regionId, dynasty) {
    const info = document.getElementById('region-info');
    if (!dynasty) {
      info.innerHTML = `<div class="panel">Регион ${regionId} - няма данни</div>`;
      return;
    }
    const rulers = Array.isArray(dynasty.rulers) ? dynasty.rulers : [];
    const first = rulers[0] ? `${rulers[0].name} ${rulers[0].years || ''}` : 'Няма данни';
    info.innerHTML = `
      <div class="panel">
        <strong>${dynasty.name}</strong><br>
        Основател: ${dynasty.founder || '-'}<br>
        Първи владетел: ${first}<br>
        Брой владетели: ${rulers.length}
      </div>
    `;
  }

  newGame() {
    this.scene.stop('MapScene');
    this.scene.stop('BootScene');
    this.scene.start('BootScene');
    document.getElementById('status').innerText = 'Статус: Нова игра';
  }

  saveGame() {
    const dyn = this.registry.get('dynasties') || [];
    try {
      localStorage.setItem('svb_save', JSON.stringify(dyn));
      alert('Играта е запазена в localStorage');
    } catch (e) {
      console.error('Save failed', e);
      alert('Грешка при запазване');
    }
  }

  loadGame() {
    try {
      const raw = localStorage.getItem('svb_save');
      if (!raw) { alert('Няма запазена игра'); return; }
      const dyn = JSON.parse(raw);
      this.registry.set('dynasties', dyn);
      this.renderDynasties();
      alert('Играта е заредена');
    } catch (e) {
      console.error('Load failed', e);
      alert('Грешка при зареждане');
    }
  }
}
