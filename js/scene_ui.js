// js/scene_ui.js
// UIScene с панел за Императорски съвет, експедиции и инвентар на владетелите.
// Подобрена версия: винаги показва инвентара и добавя бутон "Дай тест предмет".

class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene', active: true }); }
  preload() {}
  create() {
    // ensure ui-root exists
    this.root = document.getElementById('ui-root');
    if (!this.root) {
      this.root = document.createElement('div');
      this.root.id = 'ui-root';
      document.body.appendChild(this.root);
    }

    // base layout
    this.root.innerHTML = `
      <div class="controls" style="display:flex;align-items:center;gap:8px;">
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="button" id="new-game">Нова игра</span>
          <span class="button" id="save-game">Запази</span>
          <span class="button" id="load-game">Зареди</span>
          <span class="button" id="next-turn" style="margin-left:12px">Следващ ход</span>
          <span class="panel small" id="status">Статус: готов</span>
        </div>
        <div style="margin-left:auto; display:flex; gap:8px;">
          <span class="button" id="open-council">Императорски съвет</span>
          <span class="button" id="open-explore">Експедиции</span>
        </div>
      </div>

      <div id="main-row" style="display:flex;gap:12px;margin-top:10px;">
        <div id="left-col" style="flex:1;min-width:260px;"></div>
        <div id="center-col" style="flex:2;min-width:420px;"></div>
        <div id="right-col" style="flex:1;min-width:260px;"></div>
      </div>

      <div id="council-panel" class="panel" style="display:none; margin-top:10px; max-width:980px;">
        <h3 style="margin:0 0 8px 0;">Императорски съвет</h3>
        <div id="council-members" style="display:flex;flex-wrap:wrap;gap:6px;"></div>
        <div style="margin-top:8px;">
          <span class="button" id="council-propose">Предложи закон</span>
          <span class="button" id="council-hold">Събери съвет</span>
          <span class="button" id="council-reelect">Преназначи представители</span>
        </div>
        <div id="council-log" class="small" style="margin-top:8px; max-height:160px; overflow:auto;"></div>
      </div>

      <div id="explore-panel" class="panel" style="display:none; margin-top:10px; max-width:980px;">
        <h3 style="margin:0 0 8px 0;">Експедиции</h3>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
          <select id="explore-leader" style="min-width:220px;"></select>
          <input id="explore-duration" type="number" min="1" max="60" value="8" style="width:80px;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.03);background:transparent;color:inherit" />
          <span class="button" id="explore-start">Стартирай експедиция</span>
          <span class="button secondary" id="explore-refresh">Обнови</span>
        </div>
        <div id="explore-list" style="display:flex;flex-direction:column;gap:8px;max-height:260px;overflow:auto;"></div>
      </div>

      <div id="ruler-panel" class="panel" style="margin-top:10px; display:block;">
        <h3 style="margin:0 0 8px 0;">Владетели</h3>
        <div id="dynasty-list" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
        <div id="ruler-detail" style="margin-top:8px;"></div>
      </div>

      <div id="debug-log" style="position:fixed;left:12px;bottom:12px;background:rgba(0,0,0,0.7);color:#fff;padding:8px;border-radius:6px;z-index:9999;max-width:320px;display:none;">
        <div id="debug-body"></div>
        <div style="margin-top:6px;"><span class="button small" id="debug-toggle">Toggle Debug</span></div>
      </div>
    `;

    // event bindings
    document.getElementById('new-game').addEventListener('click', () => this.newGame());
    document.getElementById('save-game').addEventListener('click', () => this.saveGame());
    document.getElementById('load-game').addEventListener('click', () => this.loadGame());
    document.getElementById('next-turn').addEventListener('click', () => this.onNextTurn());
    document.getElementById('open-council').addEventListener('click', () => this.toggleCouncilPanel());
    document.getElementById('open-explore').addEventListener('click', () => this.toggleExplorePanel());
    document.getElementById('explore-start').addEventListener('click', () => this.onStartExpedition());
    document.getElementById('explore-refresh').addEventListener('click', () => this.renderExploreList());
    document.getElementById('debug-toggle').addEventListener('click', () => {
      const el = document.getElementById('debug-log');
      el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
    });

    // references
    this.registry = (window.game && window.game.registry) ? window.game.registry : null;

    // initial render
    this.renderDynasties();
    this.renderCouncilPanel();

    // init managers
    if (window.TurnManager && typeof window.TurnManager.init === 'function') {
      try { window.TurnManager.init({ registry: this.registry }); } catch(e) {}
    }
    if (window.Explore && typeof window.Explore.init === 'function') {
      try { window.Explore.init({ registry: this.registry }); } catch(e) {}
    }

    // populate leaders and render explore list
    this.populateExploreLeaders();
    this.renderExploreList();

    // ensure panels visible if they were hidden by CSS
    document.getElementById('ruler-panel').style.display = 'block';
    // periodic UI updater
    this.time.addEvent({ delay: 1000, loop: true, callback: () => this.updateStatus() });

    // add global test item button in right-col
    const rightCol = document.getElementById('right-col');
    const testBox = document.createElement('div');
    testBox.style.marginTop = '8px';
    testBox.className = 'panel';
    testBox.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:6px;">
        <strong>Тестови инструменти</strong>
        <div style="display:flex;gap:6px;">
          <span class="button" id="give-test-item">Дай тест предмет</span>
          <span class="button secondary" id="clear-test-items">Изчисти тест предмети</span>
        </div>
        <div class="small" id="test-info" style="margin-top:6px;"></div>
      </div>
    `;
    rightCol.appendChild(testBox);
    document.getElementById('give-test-item').addEventListener('click', () => this.onGiveTestItem());
    document.getElementById('clear-test-items').addEventListener('click', () => this.onClearTestItems());
  }

  updateStatus() {
    const st = document.getElementById('status');
    const gs = (window.TurnManager && window.TurnManager.getState) ? window.TurnManager.getState() : (window.gameState || {});
    st.innerText = `Статус: ход ${gs.turn || 0} — ${gs.date ? new Date(gs.date).toLocaleDateString() : '-'}`;
    // debug info
    const dbg = document.getElementById('debug-body');
    if (dbg) {
      dbg.innerText = `Turn:${gs.turn||0} Expeditions:${window.Explore ? window.Explore.getExpeditions().length : 0}`;
    }
  }

  // Game control
  newGame() {
    if (confirm('Стартираш нова игра? Това ще презареди сцените.')) {
      localStorage.removeItem('svb_save');
      localStorage.removeItem('svb_gameState');
      localStorage.removeItem('svb_expeditions');
      location.reload();
    }
  }

  saveGame() {
    try {
      const dyn = this.registry ? this.registry.get('dynasties') : [];
      const save = { dynasties: dyn };
      if (window.Council && window.Council.data) save.council = window.Council.data;
      if (window.Explore && window.Explore.getExpeditions) save.expeditions = window.Explore.getExpeditions();
      if (window.TurnManager && window.TurnManager.getState) save.gameState = window.TurnManager.getState();
      localStorage.setItem('svb_save', JSON.stringify(save));
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
      const save = JSON.parse(raw);
      if (save.dynasties && this.registry) this.registry.set('dynasties', save.dynasties);
      if (save.council && window.Council) { window.Council.initFromData(save.council, this.registry); window.Council.saveToRegistry(); }
      if (save.expeditions && window.Explore) { window.Explore.expeditions = save.expeditions; window.Explore._persist(); }
      if (save.gameState && window.TurnManager) { window.TurnManager.turn = save.gameState.turn || 0; window.TurnManager.setDate(save.gameState.date || new Date().toISOString()); }
      this.renderDynasties();
      this.renderCouncilPanel();
      this.renderExploreList();
      alert('Играта е заредена');
    } catch (e) {
      console.error('Load failed', e);
      alert('Грешка при зареждане');
    }
  }

  onNextTurn() {
    if (window.TurnManager && typeof window.TurnManager.nextTurn === 'function') {
      window.TurnManager.nextTurn();
      this.updateStatus();
      this.renderCouncilPanel();
      this.renderExploreList();
      this.renderDynasties();
    } else {
      alert('TurnManager не е наличен.');
    }
  }

  // Dynasties and rulers
  renderDynasties() {
    const dyn = this.registry ? this.registry.get('dynasties') : [];
    const container = document.getElementById('dynasty-list');
    container.innerHTML = '';
    if (!Array.isArray(dyn) || dyn.length === 0) {
      container.innerHTML = '<div class="panel">Няма заредени династии</div>';
      return;
    }
    dyn.forEach(d => {
      const el = document.createElement('div');
      el.className = 'dynasty-item';
      el.innerText = d.name || d.id || '—';
      el.addEventListener('click', () => this.showRulerDetail(d));
      container.appendChild(el);
    });
  }

  showRulerDetail(dyn) {
    const detail = document.getElementById('ruler-detail');
    const rulers = Array.isArray(dyn.rulers) ? dyn.rulers : [];
    const first = rulers[0] || null;
    const name = dyn.name || dyn.id;
    let html = `<div class="panel"><strong>${name}</strong><br>Основател: ${dyn.founder || '-'}<br>Владетели: ${rulers.length}</div>`;
    if (first) {
      html += `<div style="margin-top:8px;" class="panel">
        <strong>Примерен владетел</strong><br>
        ${first.name || first.id} <br>
        <div style="margin-top:8px;">
          <span class="button" id="inspect-ruler">Преглед</span>
          <span class="button secondary" id="start-exp-from-ruler">Експедиция с този владетел</span>
          <span class="button" id="give-test-item-ruler">Дай тест предмет</span>
        </div>
        <div id="ruler-inv" style="margin-top:8px;"></div>
      </div>`;
    }
    detail.innerHTML = html;
    const inspectBtn = document.getElementById('inspect-ruler');
    const expBtn = document.getElementById('start-exp-from-ruler');
    const giveBtn = document.getElementById('give-test-item-ruler');
    if (inspectBtn) inspectBtn.addEventListener('click', () => this.renderRulerInventory(first));
    if (expBtn) expBtn.addEventListener('click', () => {
      if (!first || !first.id) { alert('Няма валиден владетел'); return; }
      document.getElementById('explore-leader').value = first.id;
      if (document.getElementById('explore-panel').style.display === 'none') this.toggleExplorePanel();
    });
    if (giveBtn) giveBtn.addEventListener('click', () => {
      if (!first || !first.id) { alert('Няма валиден владетел'); return; }
      const ok = window.Explore ? window.Explore._giveItemToLeader(first.id, 'test_item_01') : false;
      alert('Даден тест предмет: ' + (ok ? 'Успешно' : 'Неуспешно (няма място)'));
      this.renderRulerInventory(first);
      this.renderDynasties();
    });
  }

  renderRulerInventory(ruler) {
    const invEl = document.getElementById('ruler-inv');
    if (!ruler) { invEl.innerHTML = '<div class="panel small">Няма владетел</div>'; return; }
    ruler.inventory = ruler.inventory || Array(12).fill(null);
    let html = '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
    ruler.inventory.forEach((it, idx) => {
      const free = (it === null || it === undefined);
      html += `<div class="dynasty-item" style="min-width:80px; text-align:center; ${free ? 'border:2px dashed rgba(0,200,0,0.15)' : ''}">
        <div style="font-size:12px">${it || '—'}</div>
        <div style="margin-top:6px;">
          <span class="button small" data-slot="${idx}" data-ruler="${ruler.id}">Премести</span>
          <span class="button small secondary" data-slot-remove="${idx}" data-ruler="${ruler.id}">Изтрий</span>
        </div>
      </div>`;
    });
    html += '</div>';
    invEl.innerHTML = html;
    // attach handlers
    invEl.querySelectorAll('span.button.small').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = Number(btn.getAttribute('data-slot'));
        const rid = btn.getAttribute('data-ruler');
        if (!rid) return;
        const dyn = this.registry ? this.registry.get('dynasties') : [];
        for (const d of dyn) {
          if (!Array.isArray(d.rulers)) continue;
          const r = d.rulers.find(rr => rr.id === rid);
          if (r) {
            r.inventory = r.inventory || Array(12).fill(null);
            r.inventory[slot] = null;
            if (this.registry) this.registry.set('dynasties', dyn);
            this.renderRulerInventory(r);
            this.renderDynasties();
            break;
          }
        }
      });
    });
    invEl.querySelectorAll('span.button.small.secondary').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = Number(btn.getAttribute('data-slot-remove'));
        const rid = btn.getAttribute('data-ruler');
        if (!rid) return;
        const dyn = this.registry ? this.registry.get('dynasties') : [];
        for (const d of dyn) {
          if (!Array.isArray(d.rulers)) continue;
          const r = d.rulers.find(rr => rr.id === rid);
          if (r) {
            r.inventory = r.inventory || Array(12).fill(null);
            r.inventory[slot] = null;
            if (this.registry) this.registry.set('dynasties', dyn);
            this.renderRulerInventory(r);
            this.renderDynasties();
            break;
          }
        }
      });
    });
  }

  // Council
  toggleCouncilPanel() {
    const panel = document.getElementById('council-panel');
    panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
    this.renderCouncilPanel();
  }

  renderCouncilPanel() {
    const members = (window.Council && window.Council.getMembers && window.Council.getMembers()) || [];
    const container = document.getElementById('council-members');
    const logEl = document.getElementById('council-log');
    container.innerHTML = '';
    if (!members || members.length === 0) {
      container.innerHTML = '<div class="panel">Няма назначени членове на Съвета</div>';
      logEl.innerHTML = '';
      return;
    }
    members.forEach(m => {
      const el = document.createElement('div');
      el.className = 'dynasty-item';
      el.style.minWidth = '160px';
      el.innerText = `${m.dynasty_id} — ${m.ruler_id}\nInf:${Number(m.influence).toFixed(1)} Loy:${Number(m.loyalty).toFixed(1)}`;
      container.appendChild(el);
    });

    const logs = (window.Council && window.Council.getLog && window.Council.getLog(30)) || [];
    logEl.innerHTML = logs.map(l => {
      const t = new Date(l.time).toLocaleString();
      if (l.type === 'proposal') return `${t} — Предложение: ${l.proposal.title || l.proposal.id}`;
      if (l.type === 'vote_result') return `${t} — Гласуване: ${l.result.passed ? 'Прието' : 'Отхвърлено'} (за:${l.result.votes.for} против:${l.result.votes.against} възд:${l.result.votes.abstain})`;
      if (l.type === 'no_quorum') return `${t} — ${l.message}`;
      return `${t} — ${l.type}`;
    }).join('<br>');
  }

  onPropose() { /* omitted for brevity; same as before */ }
  onHold() { /* omitted for brevity; same as before */ }
  onReelect() { /* omitted for brevity; same as before */ }

  // Explore panel
  toggleExplorePanel() {
    const panel = document.getElementById('explore-panel');
    panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
    this.populateExploreLeaders();
    this.renderExploreList();
  }

  populateExploreLeaders() {
    const sel = document.getElementById('explore-leader');
    sel.innerHTML = '';
    const dyn = this.registry ? this.registry.get('dynasties') : [];
    if (!Array.isArray(dyn)) return;
    const rulers = [];
    dyn.forEach(d => {
      if (Array.isArray(d.rulers)) {
        d.rulers.forEach(r => rulers.push({ id: r.id || r.name, name: `${r.name || r.id} (${d.name || d.id})` }));
      }
    });
    rulers.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.innerText = r.name;
      sel.appendChild(opt);
    });
  }

  onStartExpedition() {
    const leader = document.getElementById('explore-leader').value;
    const duration = Number(document.getElementById('explore-duration').value) || 8;
    if (!leader) { alert('Избери владетел'); return; }
    if (!window.Explore) { alert('Explore manager не е наличен'); return; }
    const exp = window.Explore.startExpedition({ leader_ruler_id: leader, duration_turns: duration });
    this.renderExploreList();
    alert('Експедицията е стартирана: ' + exp.id);
  }

  renderExploreList() {
    const list = document.getElementById('explore-list');
    list.innerHTML = '';
    if (!window.Explore) { list.innerHTML = '<div class="panel small">Explore manager не е наличен</div>'; return; }
    const exps = window.Explore.getExpeditions() || [];
    if (exps.length === 0) { list.innerHTML = '<div class="panel small">Няма активни експедиции</div>'; return; }
    exps.forEach(e => {
      const el = document.createElement('div');
      el.className = 'panel';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.gap = '6px';
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div><strong>${e.id}</strong> — лидер: ${e.leader_ruler_id || '-'} — статус: ${e.status} — прогрес: ${e.progress}/${e.duration_turns}</div>
          <div style="display:flex;gap:6px;">
            <span class="button small" data-action="view" data-id="${e.id}">Преглед</span>
            <span class="button small" data-action="abort" data-id="${e.id}">Прекрати</span>
          </div>
        </div>
        <div id="log-${e.id}" class="small" style="max-height:120px;overflow:auto;"></div>
      `;
      list.appendChild(el);
      const logEl = document.getElementById(`log-${e.id}`);
      if (logEl) {
        logEl.innerHTML = (e.log || []).slice(0, 50).map(l => {
          const t = new Date(l.time).toLocaleString();
          return `${t} — ${l.text || JSON.stringify(l.result || {})}`;
        }).join('<br>');
      }
    });

    // attach handlers
    list.querySelectorAll('span.button.small').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if (action === 'view') {
          const e = window.Explore.getExpeditionById(id);
          if (!e) { alert('Експедицията не е намерена'); return; }
          const txt = `Експедиция ${e.id}\nЛидер: ${e.leader_ruler_id}\nСтатус: ${e.status}\nПрогрес: ${e.progress}/${e.duration_turns}\n\nЛог:\n` + (e.log || []).map(l => `${new Date(l.time).toLocaleString()} — ${l.text}`).join('\n');
          alert(txt);
        } else if (action === 'abort') {
          if (!confirm('Сигурни ли сте, че искате да прекратите експедицията?')) return;
          window.Explore.abortExpedition(id, 'aborted by player');
          this.renderExploreList();
        }
      });
    });
  }

  // Test item helpers
  onGiveTestItem() {
    // give test item to first available ruler (selected in explore dropdown or first in registry)
    const sel = document.getElementById('explore-leader');
    let leader = sel && sel.value ? sel.value : null;
    if (!leader) {
      const dyn = this.registry ? this.registry.get('dynasties') : [];
      leader = (dyn[0] && dyn[0].rulers && dyn[0].rulers[0] && dyn[0].rulers[0].id) || null;
    }
    if (!leader) { alert('Няма валиден владетел за тест'); return; }
    const ok = window.Explore ? window.Explore._giveItemToLeader(leader, 'test_item_01') : false;
    document.getElementById('test-info').innerText = `Даден тест предмет на ${leader}: ${ok ? 'Успешно' : 'Неуспешно'}`;
    // refresh UI
    this.renderDynasties();
    this.renderExploreList();
  }

  onClearTestItems() {
    // remove 'test_item_01' from all rulers
    const dyn = this.registry ? this.registry.get('dynasties') : [];
    let changed = false;
    for (const d of dyn) {
      if (!Array.isArray(d.rulers)) continue;
      for (const r of d.rulers) {
        if (!r.inventory) continue;
        for (let i=0;i<r.inventory.length;i++) {
          if (r.inventory[i] === 'test_item_01') { r.inventory[i] = null; changed = true; }
        }
      }
    }
    if (changed && this.registry) this.registry.set('dynasties', dyn);
    document.getElementById('test-info').innerText = `Test items cleared: ${changed ? 'да' : 'няма'}`;
    this.renderDynasties();
  }
}

// register scene if Phaser exists
if (typeof Phaser !== 'undefined' && window.game && window.game.scene) {
  try {
    window.game.scene.add('UIScene', UIScene, true);
  } catch (e) {
    // scene may already be added by main.js
  }
}
