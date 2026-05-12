// stara-velika-bulgaria/lib/main.js
// Plain script (non-module) that initializes the app using window.* helpers

(function () {
  'use strict';

  function $(sel) { return document.querySelector(sel); }

  const statusEl = $('#status') || createStatus();
  const contentEl = $('#content') || createContent();

  function createStatus() {
    const el = document.createElement('div');
    el.id = 'status';
    document.getElementById('app')?.appendChild(el);
    return el;
  }

  function createContent() {
    const el = document.createElement('div');
    el.id = 'content';
    document.getElementById('app')?.appendChild(el);
    return el;
  }

  function showError(msg) {
    statusEl.textContent = 'Error: ' + (msg && msg.message ? msg.message : msg);
    if (window.logError) window.logError('App error:', msg);
  }

  async function init() {
    try {
      statusEl.textContent = 'Loading dynasties…';
      const dynUrl = './data/dynasties.json?v=33';
      const regionsUrl = './data/map_regions.json?v=33';

      if (!window.fetchJsonNoCache) {
        throw new Error('Required helper fetchJsonNoCache not found. Ensure lib/utils.js is loaded first.');
      }

      const [dynasties, regions] = await Promise.all([
        window.fetchJsonNoCache(dynUrl),
        window.fetchJsonNoCache(regionsUrl)
      ]);

      statusEl.textContent = 'Loaded';
      render(dynasties, regions);
    } catch (e) {
      showError(e);
    }
  }

  function render(dynasties, regions) {
    const wrapper = document.createElement('div');

    const dSection = document.createElement('section');
    const dTitle = document.createElement('h2');
    dTitle.textContent = 'Dynasties';
    dSection.appendChild(dTitle);

    const dList = document.createElement('ul');
    (Array.isArray(dynasties) ? dynasties : []).forEach(d => {
      const li = document.createElement('li');
      const name = d && (d.name || d.id) ? (d.name || d.id) : 'Unknown';
      const start = d && d.startYear ? d.startYear : '?';
      const end = d && d.endYear ? d.endYear : '?';
      li.textContent = `${name} (${start}–${end})`;
      dList.appendChild(li);
    });
    dSection.appendChild(dList);
    wrapper.appendChild(dSection);

    const rSection = document.createElement('section');
    const rTitle = document.createElement('h2');
    rTitle.textContent = 'Map Regions';
    rSection.appendChild(rTitle);

    const rList = document.createElement('ul');
    const regionArray = (regions && regions.regions) ? regions.regions : [];
    regionArray.forEach(r => {
      const li = document.createElement('li');
      const rname = r && (r.name || r.id) ? (r.name || r.id) : 'Unknown region';
      const rtype = (r && r.properties && r.properties.type) ? r.properties.type : 'unknown';
      li.textContent = `${rname} — ${rtype}`;
      rList.appendChild(li);
    });
    rSection.appendChild(rList);
    wrapper.appendChild(rSection);

    contentEl.innerHTML = '';
    contentEl.appendChild(wrapper);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
