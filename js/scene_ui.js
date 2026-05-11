class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: true });
  }

  create() {
    // create simple HTML UI under #ui-root
    const root = document.getElementById('ui-root');
    root.innerHTML = `
      <div class="panel">
        <span class="button" id="new-game">New Game</span>
        <span class="button" id="save-game">Save</span>
        <span class="button" id="load-game">Load</span>
      </div>
      <div id="dynasty-list" style="margin-top:8px"></div>
      <div id="region-info" style="margin-top:8px"></div>
    `;

    document.getElementById('new-game').addEventListener('click', () => this.newGame());
    document.getElementById('save-game').addEventListener('click', () => this.saveGame());
    document.getElementById('load-game').addEventListener('click', () => this.loadGame());

    this.renderDynasties();
  }

  renderDynasties() {
    const dyn = this.scene.get('BootScene') ? this.registry.get('dynasties') : [];
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
      info.innerHTML = `<div class="panel">Регион ${regionId} - няма собственик</div>`;
      return;
    }
    // safe access to rulers
    const rulers = Array.isArray(dynasty.rulers) ? dynasty.rulers : [];
    const firstRuler = rulers[0] ? `${rulers[0].name} ${rulers[0].years || ''}` : 'Няма данни';
    info.innerHTML = `
      <div class="panel">
        <strong>${dynasty.name}</strong><br>
        Основател: ${dynasty.founder || '-'}<br>
        Първи владетел: ${firstRuler}<br>
        Брой владетели: ${rulers.length}
      </div>
    `;
  }

  newGame() {
    // simple new game: reset registry and re-run boot
    this.scene.stop('MapScene');
    this.scene.stop('BootScene');
    this.scene.start('BootScene');
    console.log('New game started');
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
