// ui_panels/map_scene.js
// Safe, minimal map panel compatible with new main.js

(function () {
  const scene = document.getElementById('map-scene');
  if (!scene) return;

  function renderLoading() {
    scene.innerHTML = `
      <div style="padding:12px;color:#333">Loading map...</div>
    `;
  }

  function renderError() {
    scene.innerHTML = `
      <div style="padding:12px;color:#900">Failed to load map_regions.json</div>
    `;
  }

  function renderRegions(list) {
    scene.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.style.padding = "12px";

    if (!list || !Array.isArray(list) || list.length === 0) {
      wrap.textContent = "No regions found";
      scene.appendChild(wrap);
      return;
    }

    list.forEach(r => {
      const d = document.createElement("div");
      d.textContent = r.name || r.key || "—";
      d.style.marginBottom = "6px";
      wrap.appendChild(d);
    });

    scene.appendChild(wrap);
  }

  // Initial
  renderLoading();

  // Load JSON
  fetch("data/map_regions.json", { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(json => renderRegions(json))
    .catch(err => {
      console.error("Error loading map_regions.json:", err);
      renderError();
    });

})();
