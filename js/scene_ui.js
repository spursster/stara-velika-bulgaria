// js/scene_ui.js - Enhanced rulers panel
class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene', active: true }); }

  create() {
    const root = document.getElementById('ui-root');
    root.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <div>
          <span class="button" id="new-game">Нова игра</span>
          <span class="button" id="save-game">Запази</span>
          <span class="button" id="load-game">Зареди</span>
        </div>
        <div class="panel small" id="status">Статус: готов</div>
        <div style="margin-left:auto">
          <input id="ruler-search" placeholder="Търси владетел..." style="padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);width:220px" />
          <select id="dynasty-filter" style="padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);margin-left:8px">
            <option value="">Всички династии</option>
          </select>
        </div>
      </div>

      <div style="display:flex;gap:12px;margin-top:10px">
        <div style="width:360px;max-height:220px;overflow:auto" id="rulers-list"></div>
        <div id="ruler-detail" style="flex:1;min-height:220px"></div>
      </div>
    `;

    document.getElementById('new-game').addEventListener('click', () => this.newGame());
    document.getElementById('save-game').addEventListener('click', () => this.saveGame());
    document.getElementById('load-game').addEventListener('click', () => this.loadGame());
    document.getElementById('ruler-search').addEventListener('input', () => this.renderRulers());
    document.getElementById('dynasty-filter').addEventListener('change', () => this.renderRulers());

    this.populateDynastyFilter();
    this.renderRulers();
  }

  getAllRulers() {
    const dyn = this.registry.get('dynasties') || [];
    const rulers = [];
    dyn.forEach(d => {
      const list = Array.isArray(d.rulers) ? d.rulers : [];
      list.forEach(r => {
        const copy = Object.assign({}, r);
        copy.dynastyId = d.id;
        copy.dynastyName = d.name;
        rulers.push(copy);
      });
    });
    return rulers;
  }

  populateDynastyFilter() {
    const dyn = this.registry.get('dynasties') || [];
    const sel = document.getElementById('dynasty-filter');
    sel.innerHTML = '<option value="">Всички династии</option>';
    dyn.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.text = d.name;
      sel.appendChild(opt);
    });
  }

  renderRulers() {
    const listEl = document.getElementById('rulers-list');
    listEl.innerHTML = '';
    const query = (document.getElementById('ruler-search').value || '').toLowerCase();
    const filterDyn = document.getElementById('dynasty-filter').value || '';
    const rulers = this.getAllRulers().filter(r => {
      if (filterDyn && r.dynastyId !== filterDyn) return false;
      if (!query) return true;
      return (r.name || '').toLowerCase().includes(query);
    });

    if (rulers.length === 0) {
      listEl.innerHTML = '<div class="panel">Няма владетели</div>';
      return;
    }

    rulers.forEach(r => {
      const el = document.createElement('div');
      el.className = 'dynasty-item';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'space-between';
      el.style.marginBottom = '6px';
      el.innerHTML = `
        <div style="flex:1">
          <div style="font-weight:600">${r.name}</div>
          <div class="small">${r.dynastyName} • ${r.years || '-'}</div>
        </div>
        <div style="margin-left:8px">
          <button data-id="${r.id}" class="view-ruler" style="padding:6px;border-radius:6px;border:none;background:#10b981;color:#fff;cursor:pointer">Виж</button>
        </div>
      `;
      listEl.appendChild(el);
    });

    // attach handlers
    Array.from(listEl.querySelectorAll('.view-ruler')).forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.getAttribute('data-id');
        this.showRulerDetail(id);
      });
    });
  }

  findRulerById(id) {
    const rulers = this.getAllRulers();
    return rulers.find(r => r.id === id) || null;
  }

  showRulerDetail(id) {
    const r = this.findRulerById(id);
    const detail = document.getElementById('ruler-detail');
    if (!r) {
      detail.innerHTML = '<div class="panel">Владетелят не е намерен</div>';
      return;
    }

    const portrait = r.portrait || 'assets/portraits/placeholder.png';
    const relations = r.relations || {};
    const father = relations.father || '-';
    const children = Array.isArray(relations.children) ? relations.children.join(', ') : '-';

    detail.innerHTML = `
      <div class="panel" style="display:flex;gap:12px;align-items:flex-start">
        <div style="width:140px">
          <img src="${portrait}" alt="${r.name}" style="width:140px;height:140px;object-fit:cover;border-radius:6px;border:1px solid rgba(255,255,255,0.04)" onerror="this.src='assets/portraits/placeholder.png'"/>
        </div>
        <div style="flex:1">
          <div style="font-size:18px;font-weight:700">${r.name}</div>
          <div class="small" style="margin-top:6px">Династия: ${r.dynastyName}</div>
          <div class="small" style="margin-top:6px">Години: ${r.years || '-'}</div>
          <div class="small" style="margin-top:6px">Баща: ${father}</div>
          <div class="small" style="margin-top:6px">Деца: ${children}</div>
          <div style="margin-top:10px">
            <button id="export-ruler" class="button">Експорт JSON</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('export-ruler').addEventListener('click', () => {
      const payload = JSON.stringify(r, null, 2);
      this.copyToClipboard(payload);
      alert('JSON на владетеля е копиран в клипборда');
    });
  }

  copyToClipboard(text) {
    try {
      navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
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
      this.populateDynastyFilter();
      this.renderRulers();
      alert('Играта е заредена');
    } catch (e) {
      console.error('Load failed', e);
      alert('Грешка при зареждане');
    }
  }
        }
