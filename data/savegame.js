// data/savegame.js
// Прост save/load за Registry чрез localStorage.
// Използва ключ "sv_stara_vb_v1" — можеш да го смениш при нужда.
(function (global) {
  const STORAGE_KEY = 'sv_stara_vb_v1';

  function safeGetRegistry() {
    return global.Registry || {
      _store: Object.create(null),
      get(k){ return this._store[k]; },
      set(k,v){ this._store[k]=v; },
      keys(){ return Object.keys(this._store || {}); }
    };
  }

  function serializeRegistry(reg) {
    const out = Object.create(null);
    if (typeof reg.keys === 'function') {
      try {
        reg.keys().forEach(k => {
          try { out[k] = reg.get(k); } catch (e) { out[k] = null; }
        });
      } catch (e) {
        // fallback: try common keys
        ['year','player','dynasties','map'].forEach(k => { out[k] = reg.get(k); });
      }
    } else {
      // best-effort: copy known props
      ['year','player','dynasties','map'].forEach(k => { out[k] = reg.get(k); });
    }
    return out;
  }

  function saveGame() {
    try {
      const reg = safeGetRegistry();
      const data = serializeRegistry(reg);
      const json = JSON.stringify({ savedAt: Date.now(), data: data });
      localStorage.setItem(STORAGE_KEY, json);
      console.log('Game saved to localStorage.');
      return true;
    } catch (e) {
      console.error('Save failed', e);
      return false;
    }
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { console.log('No saved game found'); return null; }
      const parsed = JSON.parse(raw);
      const reg = safeGetRegistry();
      const data = parsed.data || {};
      Object.keys(data).forEach(k => {
        try { reg.set(k, data[k]); } catch (e) { console.error('Failed to restore key', k, e); }
      });
      console.log('Game loaded from localStorage.');
      return parsed;
    } catch (e) {
      console.error('Load failed', e);
      return null;
    }
  }

  // Експонираме глобално удобни функции
  global.saveGame = saveGame;
  global.loadGame = loadGame;

  // Автоматично зареждане при скрипт изпълнение (ако има запис)
  try {
    // малък delay за да сме сигурни, че Registry е дефиниран
    setTimeout(function () {
      if (localStorage.getItem(STORAGE_KEY)) {
        loadGame();
      }
    }, 50);
  } catch (e) { /* ignore */ }
})(window);
