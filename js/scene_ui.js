// js/scene_ui.js
// UIScene с топбар, странични панели, нотификации и Ledger.
// Заменете съществуващия файл с този код.

(function(){
  // --- minimal CSS injection for layout and CK-like look ---
  const css = `
  #ui-root { font-family: Arial, Helvetica, sans-serif; color:#e6eef6; }
  .topbar { display:flex; align-items:center; gap:12px; padding:8px 12px; background:linear-gradient(180deg,#071226,#0b1b2b); border-bottom:1px solid rgba(255,255,255,0.03); }
  .res { display:flex; align-items:center; gap:6px; padding:4px 8px; background:rgba(255,255,255,0.02); border-radius:6px; font-size:13px; }
  .button { background:#1b3a57; padding:6px 10px; border-radius:6px; cursor:pointer; color:#e6eef6; border:1px solid rgba(255,255,255,0.03); }
  .button.small { padding:4px 6px; font-size:12px; }
  .button.secondary { background:transparent; border:1px dashed rgba(255,255,255,0.03); }
  .panel { background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); padding:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.02); }
  #layout { display:grid; grid-template-columns: 260px 1fr 320px; gap:12px; padding:12px; }
  #left-panel { min-height:360px; }
  #center-panel { min-height:360px; }
  #right-panel { min-height:360px; }
  .dynasty-item { background:rgba(255,255,255,0.01); padding:8px; border-radius:6px; cursor:pointer; }
  #ledger-modal { display:none; position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); width:820px; height:520px; background:#071226; color:#e6eef6; padding:12px; border-radius:10px; z-index:99999; border:1px solid rgba(255,255,255,0.03); box-shadow:0 8px 30px rgba(0,0,0,0.6); }
  #notif-panel { position:fixed; right:12px; top:56px; width:320px; max-height:60vh; overflow:auto; background:rgba(7,18,38,0.95); padding:8px; border-radius:8px; display:none; z-index:99998; border:1px solid rgba(255,255,255,0.03); }
  .notif-item { padding:8px; border-bottom:1px solid rgba(255,255,255,0.02); }
  .slot-free { border:2px dashed rgba(0,200,0,0.12); }
  `;
  const style = document.createElement('style');
  style.innerText = css;
  document.head.appendChild(style);

  // --- NotificationManager (global) ---
  window.NotificationManager = window.NotificationManager || (function(){
    const queue = [];
    function push(n) { queue.unshift(Object.assign({ id: 'n_' + Date.now(), time: new Date().toISOString() }, n)); renderBadge(); renderPanel(); }
    function all() { return queue.slice(); }
    function clear() { queue.length = 0; renderBadge(); renderPanel(); }
    function dismiss(id) { const idx = queue.findIndex(x=>x.id===id); if (idx>=0) queue.splice(idx,1); renderBadge(); renderPanel(); }
    function renderBadge() {
      const el = document.getElementById('notif-count');
      if (el) el.innerText = queue.length ? String(queue.length) : '';
    }
    function renderPanel() {
      const panel = document.getElementById('notif-panel');
      if (!panel) return;
      panel.innerHTML = '<strong>Нотификации</strong><div style="height:8px"></div>' + (queue.length === 0 ? '<div class="panel small">Няма нотификации</div>' : queue.map(n=>`<div class="notif-item panel"><div style="display:flex;justify-content:space-between;"><div><strong>${n.title||'Събитие'}</strong><div style="font-size:12px;color:#bcd2ea">${new Date(n.time).toLocaleString()}</div></div><div><button class="button small" data-id="${n.id}" data-action="dismiss">X</button></div></div><div style="margin-top:6px">${n.text||''}</div></div>`).join(''));
      // attach dismiss handlers
      panel.querySelectorAll('button[data-action="dismiss"]').forEach(b=>b.addEventListener('click', ()=>dismiss(b.getAttribute('data-id'))));
    }
    // expose
    return { push, all, clear, dismiss, renderBadge, renderPanel };
  })();

  // --- UIScene definition ---
  class UIScene extends Phaser.Scene {
    constructor() { super({ key: 'UIScene', active: true }); }
    preload() {}
    create() {
      // ensure ui-root
      this.root = document.getElementById('ui-root');
      if (!this.root) {
        this.root = document.createElement('div');
        this.root.id = 'ui-root';
        document.body.appendChild(this.root);
      }

      // build topbar + layout + panels + ledger + notif panel
      this.root.innerHTML = `
        <div class="topbar">
          <div style="display:flex;gap:12px;align-items:center;">
            <div class="res"><strong id="game-title">SVB</strong></div>
            <div class="res">🏛 <span id="res-gold">0</span></div>
            <div class="res">⚜ <span id="res-influence">0</span></div>
            <div class="res">⚔ <span id="res-troops">0</span></div>
          </div>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center;">
            <button id="btn-notifications" class="button">🔔 <span id="notif-count"></span></button>
            <button id="btn-ledger" class="button">Ledger</button>
            <button id="btn-save" class="button">Запази</button>
            <button id="btn-next" class="button">Следващ ход</button>
          </div>
        </div>

        <div id="layout">
          <div id="left-panel">
            <div class="panel">
              <strong>Династии</strong>
              <div id="dynasty-list" style="margin-top:8px;display:flex;flex-direction:column;gap:6px;max-height:60vh;overflow:auto;"></div>
            </div>
          </div>

          <div id="center-panel">
            <div class="panel" id="map-placeholder" style="height:320px;display:flex;align-items:center;justify-content:center;">
              <div style="opacity:0.5">Карта / Phaser canvas</div>
            </div>
            <div style="height:12px"></div>
            <div class="panel" id="explore-panel" style="display:block;">
              <strong>Експедиции</strong>
              <div style="display:flex;gap:8px;margin-top:8px;align-items:center;">
                <select id="explore-leader" style="min-width:220px"></select>
                <input id="explore-duration" type="number" min="1" max="60" value="8" style="width:80px;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.03);background:transparent;color:inherit" />
                <button id="explore-start" class="button">Стартирай експедиция</button>
                <button id="explore-refresh" class="button secondary">Обнови</button>
              </div>
              <div id="explore-list" style="margin-top:8px;max-height:220px;overflow:auto;"></div>
            </div>
          </div>

          <div id="right-panel">
            <div class="panel">
              <strong>Владетел</strong>
              <div id="ruler-detail" style="margin-top:8px;"></div>
            </div>
            <div style="height:8px"></div>
            <div class="panel">
              <strong>Тестови инструменти</strong>
              <div style="display:flex;gap:6px;margin-top:8px;">
                <button id="give-test-item" class="button">Дай тест предмет</button>
                <button id="clear-test-items" class="button secondary">Изчисти тест предмети</button>
              </div>
              <div id="test-info" style="margin-top:8px;font-size:13px;color:#bcd2ea"></div>
            </div>
          </div>
        </div>

        <div id="notif-panel"></div>

        <div id="ledger-modal">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>Ledger</strong>
            <div><button id="ledger-close" class="button small">Затвори</button></div>
          </div>
          <div id="ledger-tabs" style="margin-top:8px;display:flex;gap:6px;">
            <button class="button small" data-tab="events">Събития</button>
            <button class="button small" data-tab="economy">Икономика</button>
            <button class="button small" data-tab="armies">Армии</button>
          </div>
          <div id="ledger-body" style="margin-top:8px;max-height:420px;overflow:auto;"></div>
        </div>
      `;

      // bind topbar buttons
      document.getElementById('btn-notifications').addEventListener('click', ()=> {
        const p = document.getElementById('notif-panel');
        p.style.display = (p.style.display === 'none' || p.style.display === '') ? 'block' : 'none';
        window.NotificationManager.renderPanel();
      });
      document.getElementById('btn-ledger').addEventListener('click', ()=> openLedger('events'));
      document.getElementById('btn-save').addEventListener('click', ()=> this.saveGame());
      document.getElementById('btn-next').addEventListener('click', ()=> this.onNextTurn());

      // bind explore controls
      document.getElementById('explore-start').addEventListener('click', ()=> this.onStartExpedition());
      document.getElementById('explore-refresh').addEventListener('click', ()=> this.renderExploreList());

      // test item buttons
      document.getElementById('give-test-item').addEventListener('click', ()=> this.onGiveTestItem());
      document.getElementById('clear-test-items').addEventListener('click', ()=> this.onClearTestItems());

      // ledger close and tabs
      document.getElementById('ledger-close').addEventListener('click', ()=> closeLedger());
      document.querySelectorAll('#ledger-tabs button').forEach(b=>b.addEventListener('click', ()=> renderLedgerTab(b.getAttribute('data-tab'))));

      // references
      this.registry = (window.game && window.game.registry) ? window.game.registry : null;

      // initial render
      this.populateExploreLeaders();
      this.renderExploreList();
      this.renderDynasties();
      this.renderRulerPlaceholder();

      // init managers if available
      if (window.TurnManager && typeof window.TurnManager.init === 'function') {
        try { window.TurnManager.init({ registry: this.registry }); } catch(e) {}
      }
      if (window.Explore && typeof window.Explore.init === 'function') {
        try { window.Explore.init({ registry: this.registry }); } catch(e) {}
      }

      // hook: when Explore finds items or events, push notification
      // We add a simple hook by wrapping Explore.onTurn if exists
      if (window.Explore && typeof window.Explore.onTurn === 'function') {
        // no-op: Explore already handles logs; we will not override onTurn
      }

      // periodic UI updater
      this.time.addEvent({ delay: 1000, loop: true, callback: () => this.updateStatus() });

      // render initial notification badge/panel
      window.NotificationManager.renderBadge();
      window.NotificationManager.renderPanel();
    }

    updateStatus() {
      const gs = (window.TurnManager && window.TurnManager.getState) ? window.TurnManager.getState() : {};
      document.getElementById('res-gold').innerText = (this.registry && this.registry.get('gold')) ? this.registry.get('gold') : '0';
      document.getElementById('res-influence').innerText = (this.registry && this.registry.get('influence')) ? this.registry.get('influence') : '0';
      document.getElementById('res-troops').innerText = (this.registry && this.registry.get('troops')) ? this.registry.get('troops') : '0';
    }

    // Game control
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

    onNextTurn() {
      if (window.TurnManager && typeof window.TurnManager.nextTurn === 'function') {
        window.TurnManager.nextTurn();
        this.renderExploreList();
        this.renderDynasties();
        this.renderRulerPlaceholder();
        // push notifications for expedition events found this turn
        if (window.Explore) {
          const exps = window.Explore.getExpeditions() || [];
          exps.forEach(e => {
            const last = (e.log && e.log[0]) ? e.log[0] : null;
            if (last && last.text && last._notified !== true) {
              window.NotificationManager.push({ title: `Експедиция ${e.id}`, text: last.text });
              last._notified = true;
            }
          });
        }
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
        el.className = 'dynasty-item panel';
        el.innerText = d.name || d.id || '—';
        el.addEventListener('click', () => this.showRulerDetail(d));
        container.appendChild(el);
      });
    }

    renderRulerPlaceholder() {
      // if no specific ruler selected, show first dynasty's first ruler
      const dyn = this.registry ? this.registry.get('dynasties') : [];
      const first = (dyn && dyn[0]) ? dyn[0] : null;
      if (first) this.showRulerDetail(first);
    }

    showRulerDetail(dyn) {
      const detail = document.getElementById('ruler-detail');
      const rulers = Array.isArray(dyn.rulers) ? dyn.rulers : [];
      const first = rulers[0] || null;
      const name = dyn.name || dyn.id;
      let html = `<div><strong>${name}</strong><div style="font-size:13px;color:#bcd2ea">Основател: ${dyn.founder || '-'}</div><div style="font-size:13px;color:#bcd2ea">Владетели: ${rulers.length}</div></div>`;
      if (first) {
        html += `<div style="margin-top:8px;" class="panel">
          <strong>${first.name || first.id}</strong><div style="margin-top:6px">ID: ${first.id}</div>
          <div style="margin-top:8px;display:flex;gap:6px;">
            <button id="inspect-ruler" class="button small">Преглед</button>
            <button id="start-exp-from-ruler" class="button small secondary">Експедиция с този владетел</button>
            <button id="give-test-item-ruler" class="button small">Дай тест предмет</button>
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
        if (document.getElementById('explore-panel').style.display === 'none') {
          document.getElementById('explore-panel').style.display = 'block';
        }
        this.onStartExpedition();
      });
      if (giveBtn) giveBtn.addEventListener('click', () => {
        if (!first || !first.id) { alert('Няма валиден владетел'); return; }
        const ok = window.Explore ? window.Explore._giveItemToLeader(first.id, 'test_item_01') : false;
        alert('Даден тест предмет: ' + (ok ? 'Успешно' : 'Неуспешно (няма място)'));
        this.renderRulerInventory(first);
        this.renderDynasties();
      });
      // render inventory immediately
      if (first) this.renderRulerInventory(first);
    }

    renderRulerInventory(ruler) {
      const invEl = document.getElementById('ruler-inv');
      if (!invEl) return;
      if (!ruler) { invEl.innerHTML = '<div class="panel small">Няма владетел</div>'; return; }
      ruler.inventory = ruler.inventory || Array(12).fill(null);
      let html = '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
      ruler.inventory.forEach((it, idx) => {
        const free = (it === null || it === undefined);
        html += `<div class="panel dynasty-item" style="min-width:80px;text-align:center;${free ? 'border:2px dashed rgba(0,200,0,0.12)' : ''}">
          <div style="font-size:12px">${it || '—'}</div>
          <div style="margin-top:6px;">
            <button class="button small" data-slot="${idx}" data-ruler="${ruler.id}">Премести</button>
            <button class="button small secondary" data-slot-remove="${idx}" data-ruler="${ruler.id}">Изтрий</button>
          </div>
        </div>`;
      });
      html += '</div>';
      invEl.innerHTML = html;
      // attach handlers
      invEl.querySelectorAll('button[data-slot]').forEach(btn => {
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
      invEl.querySelectorAll('button[data-slot-remove]').forEach(btn => {
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

    // Explore panel
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
              <button class="button small" data-action="view" data-id="${e.id}">Преглед</button>
              <button class="button small" data-action="abort" data-id="${e.id}">Прекрати</button>
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
      list.querySelectorAll('button[data-action]').forEach(btn => {
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
      const sel = document.getElementById('explore-leader');
      let leader = sel && sel.value ? sel.value : null;
      if (!leader) {
        const dyn = this.registry ? this.registry.get('dynasties') : [];
        leader = (dyn[0] && dyn[0].rulers && dyn[0].rulers[0] && dyn[0].rulers[0].id) || null;
      }
      if (!leader) { alert('Няма валиден владетел за тест'); return; }
      const ok = window.Explore ? window.Explore._giveItemToLeader(leader, 'test_item_01') : false;
      document.getElementById('test-info').innerText = `Даден тест предмет на ${leader}: ${ok ? 'Успешно' : 'Неуспешно'}`;
      this.renderDynasties();
      this.renderExploreList();
    }

    onClearTestItems() {
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

  // --- Ledger helpers (global functions used by UI) ---
  function openLedger(tab='events') {
    const modal = document.getElementById('ledger-modal');
    if (!modal) return;
    modal.style.display = 'block';
    renderLedgerTab(tab);
  }
  function closeLedger() {
    const modal = document.getElementById('ledger-modal');
    if (!modal) return;
    modal.style.display = 'none';
  }
  function renderLedgerTab(tab) {
    const body = document.getElementById('ledger-body');
    if (!body) return;
    if (tab === 'events') {
      const ex = window.Explore ? window.Explore.getExpeditions() : [];
      const logs = [];
      ex.forEach(e => (e.log||[]).forEach(l => logs.push({ time: l.time, text: l.text })));
      const councilLogs = (window.Council && window.Council.getLog) ? window.Council.getLog(100) : [];
      councilLogs.forEach(l => logs.push({ time: l.time, text: l.type ? (l.type + (l.message ? ': ' + l.message : '')) : JSON.stringify(l) }));
      logs.sort((a,b)=> new Date(b.time) - new Date(a.time));
      body.innerHTML = logs.length === 0 ? '<div class="panel small">Няма събития</div>' : logs.map(l=>`<div style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.03)">${new Date(l.time).toLocaleString()} — ${l.text}</div>`).join('');
    } else if (tab === 'economy') {
      const reg = window.game && window.game.registry ? window.game.registry : null;
      const gold = reg && reg.get('gold') ? reg.get('gold') : '—';
      const inf = reg && reg.get('influence') ? reg.get('influence') : '—';
      body.innerHTML = `<div style="padding:8px">Gold: ${gold}<br>Influence: ${inf}</div>`;
    } else if (tab === 'armies') {
      body.innerHTML = '<div style="padding:8px">Армии: (данни от бъдеща интеграция)</div>';
    }
  }

  // register scene if Phaser exists
  if (typeof Phaser !== 'undefined' && window.game && window.game.scene) {
    try {
      window.game.scene.add('UIScene', UIScene, true);
    } catch (e) {
      // scene may already be added by main.js
    }
  } else {
    // If Phaser not present yet, expose UIScene for later registration
    window.UISceneClass = UIScene;
  }

  // expose ledger helpers globally for buttons
  window.openLedger = openLedger;
  window.closeLedger = closeLedger;
  window.renderLedgerTab = renderLedgerTab;

})();
