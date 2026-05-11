// js/turn_manager.js
// Управление на ходовете: всеки ход = 3 дни. Регистрира per-turn hooks и пази gameState в registry/localStorage.

class TurnManager {
  constructor() {
    this.registry = null;
    this.turn = 0;
    this.date = null; // ISO string
    this.hooks = []; // functions to call each turn: fn({turn, date, registry})
    this.isInitialized = false;
  }

  init(options = {}) {
    // options.registry (Phaser registry), options.startDate (ISO) or default
    this.registry = options.registry || (window.game && window.game.registry) || null;
    const startDate = options.startDate || (this.registry && this.registry.get('gameDate')) || null;
    this.turn = (this.registry && Number(this.registry.get('gameTurn')) ) || 0;
    if (startDate) this.date = new Date(startDate);
    else if (this.turn > 0 && this.registry && this.registry.get('gameDate')) this.date = new Date(this.registry.get('gameDate'));
    else this.date = new Date(); // default now
    this.isInitialized = true;

    // restore expeditions if present in registry
    if (this.registry) {
      const gs = this.registry.get('gameState') || {};
      if (gs.turn) this.turn = gs.turn;
      if (gs.date) this.date = new Date(gs.date);
    }

    // expose global state
    window.gameState = window.gameState || {};
    window.gameState.turn = this.turn;
    window.gameState.date = this.date.toISOString();

    console.log('TurnManager initialized', { turn: this.turn, date: this.date.toISOString() });
  }

  registerHook(fn) {
    if (typeof fn === 'function') this.hooks.push(fn);
  }

  unregisterHook(fn) {
    this.hooks = this.hooks.filter(h => h !== fn);
  }

  nextTurn() {
    if (!this.isInitialized) this.init();
    // increment turn and advance 3 days
    this.turn += 1;
    this.advanceDays(3);

    // call hooks sequentially, catch errors
    const context = { turn: this.turn, date: new Date(this.date), registry: this.registry };
    for (const fn of this.hooks) {
      try {
        fn(context);
      } catch (e) {
        console.error('Turn hook error', e);
      }
    }

    // persist to registry and window.gameState
    if (this.registry) {
      this.registry.set('gameTurn', this.turn);
      this.registry.set('gameDate', this.date.toISOString());
      // also save a compact gameState object
      const gs = this.registry.get('gameState') || {};
      gs.turn = this.turn;
      gs.date = this.date.toISOString();
      this.registry.set('gameState', gs);
    }
    window.gameState = window.gameState || {};
    window.gameState.turn = this.turn;
    window.gameState.date = this.date.toISOString();

    console.log(`Turn ${this.turn} — ${this.date.toISOString()}`);
    return { turn: this.turn, date: this.date.toISOString() };
  }

  advanceDays(days) {
    if (!this.date) this.date = new Date();
    this.date.setDate(this.date.getDate() + Number(days || 0));
  }

  setDate(isoString) {
    this.date = new Date(isoString);
    if (this.registry) this.registry.set('gameDate', this.date.toISOString());
    window.gameState.date = this.date.toISOString();
  }

  setTurn(n) {
    this.turn = Number(n) || 0;
    if (this.registry) this.registry.set('gameTurn', this.turn);
    window.gameState.turn = this.turn;
  }

  // convenience: advance N turns
  advanceTurns(n = 1) {
    const results = [];
    for (let i = 0; i < n; i++) results.push(this.nextTurn());
    return results;
  }

  getState() {
    return { turn: this.turn, date: this.date ? this.date.toISOString() : null };
  }

  saveToLocal() {
    try {
      const gs = { turn: this.turn, date: this.date.toISOString() };
      localStorage.setItem('svb_gameState', JSON.stringify(gs));
      return true;
    } catch (e) {
      console.error('TurnManager save failed', e);
      return false;
    }
  }

  loadFromLocal() {
    try {
      const raw = localStorage.getItem('svb_gameState');
      if (!raw) return false;
      const gs = JSON.parse(raw);
      if (gs.turn) this.turn = gs.turn;
      if (gs.date) this.date = new Date(gs.date);
      if (this.registry) {
        this.registry.set('gameTurn', this.turn);
        this.registry.set('gameDate', this.date.toISOString());
      }
      window.gameState = window.gameState || {};
      window.gameState.turn = this.turn;
      window.gameState.date = this.date.toISOString();
      return true;
    } catch (e) {
      console.error('TurnManager load failed', e);
      return false;
    }
  }
}

// expose single instance
window.TurnManager = window.TurnManager || new TurnManager();
