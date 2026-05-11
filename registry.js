// registry.js — глобален регистър за данни

window.Registry = (function () {
  const store = {};

  return {
    set(key, value) {
      store[key] = value;
    },
    get(key) {
      return store[key];
    },
    has(key) {
      return Object.prototype.hasOwnProperty.call(store, key);
    },
    remove(key) {
      delete store[key];
    },
    clear() {
      for (const k in store) delete store[k];
    }
  };
})();
