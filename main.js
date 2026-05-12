// main.js
// Minimal, safe bootstrap to restore UI and allow diagnostics.
// Replace your current main.js with this, then hard-reload (Ctrl+F5).

(function () {
  // Safety shims
  if (!window.I18N) {
    window.I18N = { t: function (k, f) { return f || k || ''; }, loadLanguage: function (l) { return Promise.resolve({lang:l||'bg'}); } };
  }
  if (!window.Registry) {
    window.Registry = {
      _store: Object.create(null),
      set(k,v){ this._store[k]=v; },
      get(k){ return Object.prototype.hasOwnProperty.call(this._store, k) ? this._store[k] : undefined; },
      on(){ return function(){}; },
      keys(){ return Object.keys(this._store); }
    };
  }
  if (!window.GameConfig) {
    window.GameConfig = { startYear: 680 };
  }

  // Helper to create elements
  function el(tag, props, text) {
    var e = document.createElement(tag);
    if (props) Object.keys(props).forEach(function(k){ e[k]=props[k]; });
    if (text !== undefined) e.textContent = text;
    return e;
  }

  // Restore Registry from localStorage savegame if present (non-destructive)
  try {
    var raw = localStorage.getItem('sv_stara_vb_v1');
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.data) {
          Object.keys(parsed.data).forEach(function(k){
            try { window.Registry.set(k, parsed.data[k]); } catch(e){}
          });
          console.log('Registry restored from savegame.');
        }
      } catch(e) { console.warn('Failed to parse savegame', e); }
    }
  } catch (e) { console.warn('localStorage unavailable', e); }

  // Ensure required containers exist
  function ensureContainers() {
    if (!document.getElementById('topbar')) {
      var header = el('header', { id: 'topbar', role: 'banner' });
      document.body.insertBefore(header, document.body.firstChild);
    }
    if (!document.getElementById('layout')) {
      var layout = el('div', { id: 'layout', role: 'main', style: 'display:flex;height:calc(100% - 48px)' });
      var left = el('aside', { id: 'panel-left', 'aria-label': 'Left panel', style: 'width:260px;background:#ecf0f1;padding:10px;box-sizing:border-box' });
      var scene = el('section', { id: 'map-scene', 'aria-label': 'Map and scene', style: 'flex:1;background:#fff;overflow:hidden;position:relative' });
      var right = el('aside', { id: 'panel-right', 'aria-label': 'Right panel', style: 'width:260px;background:#ecf0f1;padding:10px;box-sizing:border-box' });
      layout.appendChild(left);
      layout.appendChild(scene);
      layout.appendChild(right);
      document.body.appendChild(layout);
    }
  }

  ensureContainers();

  // Safe topbar render (works if ui_panels/topbar.js failed)
  function safeTopbarRender() {
    try {
      var top = document.getElementById('topbar');
      top.innerHTML = '';
      top.style.height = '48px';
      top.style.background = '#2c3e50';
      top.style.color = '#fff';
      top.style.display = 'flex';
      top.style.alignItems = 'center';
      top.style.padding = '0 12px';
      top.style.boxSizing = 'border-box';

      var left = el('div', { style: 'display:flex;align-items:center;gap:12px' });
      var yearVal = window.Registry.get('year');
      if (typeof yearVal !== 'number') {
        var parsed = parseInt(yearVal,10);
        yearVal = (!isNaN(parsed) ? parsed : (window.GameConfig && window.GameConfig.startYear ? window.GameConfig.startYear : 680));
        window.Registry.set('year', yearVal);
      }
      var yearLabel = el('div', { style: 'font-weight:700;font-size:15px' }, I18N.t('ui.year','Година') + ': ');
      var yearSpan = el('span', { id: 'topbar-year' }, String(yearVal));
      yearLabel.appendChild(yearSpan);
      left.appendChild(yearLabel);

      function createBtn(text, cls) {
        var b = el('button', { className: cls || 'topbar-btn', style: 'margin-left:8px;padding:6px 10px;border:none;background:#34495e;color:#fff;cursor:pointer;border-radius:3px' }, text);
        return b;
      }

      var newGameBtn = createBtn(I18N.t('ui.newGame','Нова игра'), 'btn-newgame');
      var saveBtn = createBtn(I18N.t('ui.save','Запази'), 'btn-save');
      var nextBtn = createBtn(I18N.t('ui.nextTurn','Следващ ход'), 'btn-nextturn');

      left.appendChild(newGameBtn);
      left.appendChild(saveBtn);
      left.appendChild(nextBtn);

      var right = el('div', { style: 'margin-left:auto;display:flex;align-items:center;gap:10px' });
      var lang = el('div', { style: 'opacity:0.9;font-size:13px' }, I18N.t('lang.code','BG'));
      var bell = el('div', {}, '🔔');
      bell.title = I18N.t('ui.notifications','Известия');
      right.appendChild(lang);
      right.appendChild(bell);

      top.appendChild(left);
      top.appendChild(right);

      newGameBtn.addEventListener('click', function () {
        var start = (window.GameConfig && window.GameConfig.startYear) ? window.GameConfig.startYear : 680;
        window.Registry.set('year', start);
        console.log('New game: year reset to', start);
      });
      saveBtn.addEventListener('click', function () {
        if (typeof window.saveGame === 'function') {
          window.saveGame();
        } else {
          console.log('Save requested but saveGame() not found.');
        }
      });
      nextBtn.addEventListener('click', function () {
        var cur = window.Registry.get('year');
        var next = (typeof cur === 'number') ? cur + 1 : (parseInt(cur,10) || (window.GameConfig && window.GameConfig.startYear ? window.GameConfig.startYear : 680)) + 1;
        window.Registry.set('year', next);
      });

      if (typeof window.Registry.on === 'function') {
        try {
          window.Registry.on('year', function (v) {
            var elY = document.getElementById('topbar-year');
            if (elY) elY.textContent = String(v);
          });
        } catch (e) { /* ignore */ }
      }
    } catch (e) {
      console.error('safeTopbarRender failed', e);
    }
  }

  // Populate simple panel content so page is not empty
  function populatePanels() {
    try {
      var left = document.getElementById('panel-left');
      var right = document.getElementById('panel-right');
      var scene = document.getElementById('map-scene');
      if (left) left.innerHTML = '<h3>Dynasties</h3><div id="dyn-list">Loading...</div>';
      if (right) right.innerHTML = '<h3>Info</h3><div id="info">No data</div>';
      if (scene) scene.innerHTML = '<div style="padding:12px;color:#333">Map and scene will load here.</div>';
    } catch (e) { console.error('populatePanels failed', e); }
  }

  // Non-blocking JSON loader
  function tryLoadJSON(url, cb) {
    try {
      fetch(url, {cache: 'no-store'}).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function (json) {
        cb(null, json);
      }).catch(function (err) {
        console.warn('Failed to load', url, err);
        cb(err);
      });
    } catch (e) {
      cb(e);
    }
  }

  // Initialize
  try {
    safeTopbarRender();
    populatePanels();

    tryLoadJSON('data/dynasties.json', function (err, data) {
      var el = document.getElementById('dyn-list');
      if (err) {
        if (el) el.textContent = 'Failed to load dynasties.json';
        return;
      }
      if (el) {
        el.innerHTML = '';
        (data || []).forEach(function (d) {
          var item = document.createElement('div');
          item.textContent = (d.name || d.key || '—') + ' (' + (d.startYear || '-') + ')';
          el.appendChild(item);
        });
      }
    });

    tryLoadJSON('data/map_regions.json', function (err, data) {
      var scene = document.getElementById('map-scene');
      if (err) {
        if (scene) scene.innerHTML = '<div style="padding:12px;color:#900">Failed to load map_regions.json</div>';
        return;
      }
      if (scene) {
        var wrap = document.createElement('div');
        wrap.style.padding = '12px';
        (data || []).forEach(function (r) {
          var d = document.createElement('div');
          d.textContent = (r.name || r.key || '—');
          d.style.marginBottom = '6px';
          wrap.appendChild(d);
        });
        scene.appendChild(wrap);
      }
    });

    console.log('Minimal main.js bootstrap completed.');
  } catch (e) {
    console.error('main bootstrap failed', e);
  }

})();
