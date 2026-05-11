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
        <span class="button" id="open-council" style="margin-left:12px">Императорски съвет</span>
      </div>
      <div id="dynasty-list" style="margin-top:10px"></div>
      <div id="region-info"></div>
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
    `;

    document.getElementById('new-game').addEventListener('click', () => this.newGame());
    document.getElementById('save-game').addEventListener('click', () => this.saveGame());
    document.getElementById('load-game').addEventListener('click', () => this.loadGame());
    document.getElementById('open-council').addEventListener('click', () => this.toggleCouncilPanel());

    document.getElementById('council-propose').addEventListener('click', () => this.onPropose());
    document.getElementById('council-hold').addEventListener('click', () => this.onHold());
    document.getElementById('council-reelect').addEventListener('click', () => this.onReelect());

    this.renderDynasties();

    // initialize council: try registry, then data file
    this.initCouncil();
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
      const save = { dynasties: dyn };
      // include council state if present
      if (window.Council && window.Council.data) save.council = window.Council.data;
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
      if (save.dynasties) this.registry.set('dynasties', save.dynasties);
      if (save.council && window.Council) {
        window.Council.initFromData(save.council, this.registry);
        window.Council.saveToRegistry();
      }
      this.renderDynasties();
      this.renderCouncilPanel();
      alert('Играта е заредена');
    } catch (e) {
      console.error('Load failed', e);
      alert('Грешка при зареждане');
    }
  }

  // Council integration
  initCouncil() {
    // try registry first
    const regCouncil = this.registry.get('council');
    if (regCouncil && window.Council) {
      window.Council.initFromData(regCouncil, this.registry);
      this.renderCouncilPanel();
      return;
    }

    // try to load data/council.json via cache (BootScene loaded it into registry? if not, fetch)
    const cached = this.registry.get('dynasties'); // ensure dynasties exist
    // attempt to fetch data/council.json if not in registry
    fetch('data/council.json').then(r => {
      if (!r.ok) throw new Error('no council file');
      return r.json();
    }).then(json => {
      if (json && json.council && window.Council) {
        window.Council.initFromData(json.council, this.registry);
        window.Council.saveToRegistry();
        this.renderCouncilPanel();
      }
    }).catch(() => {
      // fallback: if no external council file, try to create from dynasties
      if (Array.isArray(cached) && cached.length > 0 && window.Council) {
        window.Council.electRepresentativesFromDynasties(cached, 'first');
        window.Council.saveToRegistry();
        this.renderCouncilPanel();
      }
    });
  }

  toggleCouncilPanel() {
    const panel = document.getElementById('council-panel');
    panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
  }

  renderCouncilPanel() {
    const members = (window.Council && window.Council.getMembers()) || [];
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

    const logs = (window.Council && window.Council.getLog(30)) || [];
    logEl.innerHTML = logs.map(l => {
      const t = new Date(l.time).toLocaleString();
      if (l.type === 'proposal') return `${t} — Предложение: ${l.proposal.title || l.proposal.id}`;
      if (l.type === 'vote_result') return `${t} — Гласуване: ${l.result.passed ? 'Прието' : 'Отхвърлено'} (за:${l.result.votes.for} против:${l.result.votes.against} възд:${l.result.votes.abstain})`;
      if (l.type === 'no_quorum') return `${t} — ${l.message}`;
      return `${t} — ${l.type}`;
    }).join('<br>');
  }

  onPropose() {
    const title = prompt('Име на предложението (кратко):', 'Нова реформа');
    if (!title) return;
    const desc = prompt('Кратко описание:', 'Описание на предложението');
    const unpop = parseFloat(prompt('Непопулярност (0-10, 0 = много популярно):', '3'));
    const proposal = window.Council ? window.Council.proposeMotion({ title, description: desc, unpopularity: isNaN(unpop) ? 3 : unpop }) : null;
    if (proposal) {
      alert('Предложението е регистрирано в Съвета.');
      this.renderCouncilPanel();
    } else {
      alert('Неуспешно регистриране на предложението.');
    }
  }

  onHold() {
    // take last proposal from council log or ask user to define
    const logs = (window.Council && window.Council.getLog(50)) || [];
    const lastProposalLog = logs.find(l => l.type === 'proposal');
    let proposal = lastProposalLog ? lastProposalLog.proposal : null;
    if (!proposal) {
      const title = prompt('Няма предложение в лог. Въведи име на предложението:', 'Нова реформа');
      if (!title) return;
      const desc = prompt('Кратко описание:', 'Описание');
      const unpop = parseFloat(prompt('Непопулярност (0-10):', '3'));
      proposal = window.Council ? window.Council.proposeMotion({ title, description: desc, unpopularity: isNaN(unpop) ? 3 : unpop }) : null;
    }
    if (!window.Council) { alert('Съветът не е инициализиран'); return; }
    const result = window.Council.holdCouncil(proposal);
    if (result && result.error === 'no_quorum') {
      alert('Събранието не може да се проведе: ' + result.message);
    } else if (result && result.passed !== undefined) {
      alert(`Гласуването приключи. Резултат: ${result.passed ? 'ПРИЕТО' : 'ОТХВЪРЛЕНО'} (за:${result.votes.for} против:${result.votes.against} възд:${result.votes.abstain})`);
      window.Council.saveToRegistry();
      this.renderCouncilPanel();
    } else {
      alert('Грешка при провеждане на събранието.');
    }
  }

  onReelect() {
    // re-elect representatives from current dynasties (first by default)
    const dyn = this.registry.get('dynasties') || [];
    if (!Array.isArray(dyn) || dyn.length === 0) { alert('Няма заредени династии'); return; }
    if (!window.Council) { alert('Съветът не е инициализиран'); return; }
    window.Council.electRepresentativesFromDynasties(dyn, 'first');
    window.Council.saveToRegistry();
    this.renderCouncilPanel();
    alert('Представителите са преназначени (първи владетел от всяка династия).');
  }
}
