// data/registry.js
// Прост, надежден глобален Registry за споделяне на данни между модули.
// Поддържа set/get/has/remove/clear и възможност за слушатели (optional).
(function (global) {
  if (global.Registry) return; // ако вече е дефиниран, не презаписваме

  const store = Object.create(null);
  const listeners = Object.create(null);

  function notify(key, value) {
    const list = listeners[key];
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      try { list[i](value); } catch (e) { console.error('Registry listener error', e); }
    }
  }

  const Registry = {
    set(key, value) {
      store[key] = value;
      notify(key, value);
      return value;
    },
    get(key, defaultValue) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : defaultValue;
    },
    has(key) {
      return Object.prototype.hasOwnProperty.call(store, key);
    },
    remove(key) {
      if (Object.prototype.hasOwnProperty.call(store, key)) {
        delete store[key];
        notify(key, undefined);
        return true;
      }
      return false;
    },
    clear() {
      for (const k in store) if (Object.prototype.hasOwnProperty.call(store, k)) delete store[k];
    },
    keys() {
      return Object.keys(store);
    },
    // Слушатели: useful за асинхронно зареждане на данни
    on(key, fn) {
      if (typeof fn !== 'function') return;
      listeners[key] = listeners[key] || [];
      listeners[key].push(fn);
      // ако вече има стойност, извикваме веднага
      if (Object.prototype.hasOwnProperty.call(store, key)) {
        try { fn(store[key]); } catch (e) { console.error('Registry listener error', e); }
      }
      return function off() {
        const arr = listeners[key];
        if (!arr) return;
        const idx = arr.indexOf(fn);
        if (idx >= 0) arr.splice(idx, 1);
      };
    },
    off(key, fn) {
      const arr = listeners[key];
      if (!arr) return false;
      const idx = arr.indexOf(fn);
      if (idx >= 0) { arr.splice(idx, 1); return true; }
      return false;
    }
  };

  // Експонираме глобално
  global.Registry = Registry;
})(window);
