// js/explore.js
// Прост експедиционен модул: стартира експедиции, tick-ва при всеки ход, генерира per-turn събития и лог.

class Expedition {
  constructor(opts = {}) {
    this.id = opts.id || 'exp_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    this.leader_ruler_id = opts.leader_ruler_id || null;
    this.start_turn = Number(opts.start_turn || 0);
    this.duration_turns = Number(opts.duration_turns || 10); // default 10 turns
    this.progress = 0; // turns passed
    this.status = 'active'; // active, completed, failed, aborted
    this.log = []; // {turn, date, text, result}
    this.region_hint = opts.region_hint || null;
    this.found_items = []; // item ids
  }

  addLog(entry) {
    this.log.unshift(Object.assign({ time: Date.now() }, entry));
  }
}

class ExploreManager {
  constructor() {
    this.registry = null;
    this.expeditions = []; // array of Expedition
    this.eventPool = this._defaultEventPool();
    this.isInitialized = false;
  }

  init(options = {}) {
    this.registry = options.registry || (window.game && window.game.registry) || null;
    // try to restore expeditions from registry
    if (this.registry) {
      const saved = this.registry.get('expeditions');
      if (Array.isArray(saved)) {
        this.expeditions = saved.map(s => Object.assign(new Expedition(), s));
      }
    }
    this.isInitialized = true;

    // register tick hook with TurnManager if available
    if (window.TurnManager && typeof window.TurnManager.registerHook === 'function') {
      // ensure we don't register twice
      window.TurnManager.unregisterHook && window.TurnManager.unregisterHook(this._turnHookBound);
      this._turnHookBound = (ctx) => this.onTurn(ctx);
      window.TurnManager.registerHook(this._turnHookBound);
    }

    console.log('ExploreManager initialized. Expeditions:', this.expeditions.length);
  }

  _defaultEventPool() {
    // small sample pool; expand later or load from data/events.json
    return [
      { id: 'find_ruins', title: 'Открити руини', text: 'Екипът открива древни руини. Намерено е малко злато.', weight: 8, effect: (exp, mgr) => ({ gold: 50, item: null }) },
      { id: 'wild_animals', title: 'Диви животни', text: 'Експедицията е нападната от диви животни. Някои ранени.', weight: 6, effect: (exp, mgr) => ({ casualties: 1 }) },
      { id: 'ancient_artifact', title: 'Древен артефакт', text: 'Намерена е странна реликва с магически свойства.', weight: 3, effect: (exp, mgr) => ({ item: 'artifact_mysterious' }) },
      { id: 'lost_supplies', title: 'Загубени припаси', text: 'Част от припасите са изгубени при буря.', weight: 5, effect: (exp, mgr) => ({ supplies: -10 }) },
      { id: 'friendly_tribe', title: 'Приятелско племе', text: 'Местно племе предлага помощ и информация.', weight: 4, effect: (exp, mgr) => ({ info: 'map_fragment' }) },
      { id: 'nothing', title: 'Нищо интересно', text: 'Денят минава без особености.', weight: 20, effect: (exp, mgr) => ({}) }
    ];
  }

  startExpedition(opts = {}) {
    if (!this.isInitialized) this.init();
    const leader = opts.leader_ruler_id || null;
    const startTurn = (window.TurnManager && window.TurnManager.turn) || 0;
    const duration = Number(opts.duration_turns || 10);
    const exp = new Expedition({ leader_ruler_id: leader, start_turn: startTurn, duration_turns: duration, region_hint: opts.region_hint || null });
    exp.addLog({ turn: startTurn, date: (window.TurnManager && window.TurnManager.date) ? window.TurnManager.date.toISOString() : new Date().toISOString(), text: 'Експедицията започва.' });
    this.expeditions.push(exp);
    this._persist();
    return exp;
  }

  abortExpedition(expId, reason = 'aborted') {
    const e = this.expeditions.find(x => x.id === expId);
    if (!e) return false;
    e.status = 'aborted';
    e.addLog({ turn: (window.TurnManager && window.TurnManager.turn) || 0, date: new Date().toISOString(), text: `Експедицията прекратена: ${reason}` });
    this._persist();
    return true;
  }

  onTurn(ctx) {
    // called by TurnManager each turn
    const currentTurn = ctx.turn;
    const date = ctx.date ? ctx.date.toISOString() : new Date().toISOString();
    let changed = false;

    for (const exp of this.expeditions) {
      if (exp.status !== 'active') continue;
      exp.progress += 1;
      // generate event for this turn of expedition
      const ev = this._pickEvent();
      const result = ev.effect ? ev.effect(exp, this) : {};
      const text = `${ev.title}: ${ev.text}`;
      exp.addLog({ turn: currentTurn, date, text, result });
      // apply simple effects: if item found, add to leader inventory if possible
      if (result.item && this.registry) {
        this._giveItemToLeader(exp.leader_ruler_id, result.item);
        exp.found_items.push(result.item);
      }
      // small chance to fail on dangerous events
      if (ev.id === 'wild_animals' && Math.random() < 0.15) {
        exp.status = 'failed';
        exp.addLog({ turn: currentTurn, date, text: 'Експедицията претърпя сериозни загуби и се провали.' });
      } else if (exp.progress >= exp.duration_turns) {
        exp.status = 'completed';
        exp.addLog({ turn: currentTurn, date, text: 'Експедицията завърши успешно.' });
      }
      changed = true;
    }

    if (changed) this._persist();
  }

  _pickEvent() {
    // weighted random from eventPool
    const pool = this.eventPool;
    const total = pool.reduce((s, e) => s + (e.weight || 1), 0);
    let r = Math.random() * total;
    for (const e of pool) {
      r -= (e.weight || 1);
      if (r <= 0) return e;
    }
    return pool[pool.length - 1];
  }

  _giveItemToLeader(rulerId, itemId) {
    if (!this.registry || !rulerId || !itemId) return false;
    // find ruler in dynasties
    const dyn = this.registry.get('dynasties') || [];
    for (const d of dyn) {
      if (!Array.isArray(d.rulers)) continue;
      const r = d.rulers.find(rr => rr.id === rulerId);
      if (r) {
        r.inventory = r.inventory || Array(12).fill(null);
        // find first empty slot
        const idx = r.inventory.findIndex(x => x === null || x === undefined);
        if (idx >= 0) {
          r.inventory[idx] = itemId;
          this.registry.set('dynasties', dyn); // persist change
          console.log(`Item ${itemId} given to ${rulerId} in slot ${idx}`);
          return true;
        } else {
          // no space: push to expedition found_items and log
          console.warn('No inventory space for', rulerId);
          return false;
        }
      }
    }
    return false;
  }

  getExpeditions() {
    return this.expeditions;
  }

  getExpeditionById(id) {
    return this.expeditions.find(e => e.id === id) || null;
  }

  _persist() {
    if (this.registry) this.registry.set('expeditions', this.expeditions);
    // also save to localStorage for resilience
    try {
      localStorage.setItem('svb_expeditions', JSON.stringify(this.expeditions));
    } catch (e) { /* ignore */ }
  }
}

// expose single instance
window.Explore = window.Explore || new ExploreManager();
