// ui_panels/map_scene.js — пълен, готов файл

(function MapScene() {
  const root = document.getElementById('map-scene');
  if (!root) return;

  function render() {
    const year = Registry.get('year') || 619;

    root.innerHTML = `
      <div class="map-container">
        <div class="map-header">
          <h2>${I18N.t('ui.map')} — ${year}</h2>
        </div>

        <div class="map-grid">
          ${renderRegions()}
        </div>
      </div>
    `;
  }

  function renderRegions() {
    const regions = Registry.get('mapRegions') || [];

    if (!regions.length) {
      return `
        <div class="map-placeholder">
          ${I18N.t('ui.mapLoading')}
        </div>
      `;
    }

    return regions
      .map(
        r => `
      <div class="map-region" data-id="${r.id}">
        <div class="region-name">${r.name}</div>
        <div class="region-owner">${r.owner || I18N.t('ui.unclaimed')}</div>
      </div>
    `
      )
      .join('');
  }

  // публичен API
  window.MapScene = { render };
})();
