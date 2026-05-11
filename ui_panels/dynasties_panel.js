(function DynastiesPanel() {
  const root = document.getElementById('panel-left');
  if (!root) return;

  function render() {
    const dynasties = Registry.get('dynasties') || [];

    root.innerHTML = `
      <div class="panel dynasties-panel">
        <h2>${I18N.t('ui.dynasties')}</h2>
        <div class="dynasty-list">
          ${dynasties.map(renderDynasty).join('')}
        </div>
      </div>
    `;
  }

  function renderDynasty(d) {
    return `
      <div class="dynasty-item" data-id="${d.id}">
        <div class="dynasty-crest">
          <img src="${d.crest}" alt="${d.name}" />
        </div>
        <div class="dynasty-info">
          <div class="dynasty-name">${d.name}</div>
          <div class="dynasty-rulers">${d.rulers.length} ${I18N.t('ui.rulers')}</div>
        </div>
      </div>
    `;
  }

  // публичен API
  window.DynastiesPanel = { render };
})();
