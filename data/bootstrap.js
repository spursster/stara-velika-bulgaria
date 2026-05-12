// data/bootstrap.js
// Гарантира, че Registry.year има валидна стойност преди main.js да стартира.
(function () {
  if (!window.Registry) {
    window.Registry = {
      _store: Object.create(null),
      set(k,v){ this._store[k]=v; },
      get(k){ return this._store[k]; },
      on(){ return function(){}; }
    };
  }

  var GameConfig = window.GameConfig || { startYear: 680 };

  var current = (function () {
    var r = window.Registry.get('year');
    if (typeof r === 'number') return r;
    if (r !== undefined && r !== null && r !== '') {
      var p = parseInt(r, 10);
      if (!isNaN(p)) return p;
    }
    return (GameConfig && GameConfig.startYear) ? GameConfig.startYear : 680;
  })();

  window.Registry.set('year', current);
})();
