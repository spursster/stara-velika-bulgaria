// data/registry.js
// Reliable global Registry with get/set/on/keys and basic safety.
(function (global) {
  if (global.Registry && typeof global.Registry.get === 'function') return;

  function createEmitter() {
    const listeners = Object.create(null);
    return {
      on(key, fn) {
        if (typeof key === 'function') {
          fn = key; key = '__all__';
        }
        listeners[key] = listeners[key] || [];
        listeners[key].push(fn);
        return function off() {
          const arr = listeners[key];
          if (!arr) return;
          const idx = arr.indexOf(fn);
          if (idx >= 0) arr.splice(idx, 1);
        };
      },
      emit(key, value) {
        (listeners[key] || []).slice().forEach(fn => {
          try { fn(value); } catch (e) { console.error('Registry listener error', e); }
        });
        (listeners['__all__'] || []).slice().forEach(fn => {
          try { fn(key, value); } catch (e) { console.error('Registry global listener error', e); }
        });
      }
    };
  }

  const emitter = createEmitter();
  const store = Object.create(null);

  const Registry = {
    set(key, value) {
      try {
        store[key] = value;
        emitter.emit(key, value);
      } catch (e) {
        console.error('Registry.set failed', e);
      }
    },
    get(key) {
      try {
        return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : undefined;
      } catch (e) {
        console.error('Registry.get failed', e);
        return undefined;
      }
    },
    on(key, fn) {
      if (typeof key === 'string' || typeof key === 'number') {
        return emitter.on(String(key), fn);
      }
      return emitter.on(key);
    },
    keys() {
      try { return Object.keys(store); } catch (e) { return []; }
    },
    dump() {
      try { return JSON.parse(JSON.stringify(store)); } catch (e) { return Object.assign({}, store); }
    }
  };

  // Load any initial registry snapshot if provided
  try {
    if (global.__INITIAL_REGISTRY && typeof global.__INITIAL_REGISTRY === 'object') {
      Object.keys(global.__INITIAL_REGISTRY).forEach(k => {
        Registry.set(k, global.__INITIAL_REGISTRY[k]);
      });
    }
  } catch (e) { /* ignore */ }

  global.Registry = Registry;
})(window);
