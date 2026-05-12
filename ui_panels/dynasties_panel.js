// ui_panels/dynasties_panel.js
// Модулен, безопасен панел за показване на династиите.
// Използва Registry от ../data/registry.js, с fallback към window.Registry.

import { Registry as ImportedRegistry } from "../data/registry.js";

const RegistryRef = ImportedRegistry || (window && window.Registry) || { dynasties: [] };

function createElement(tag, attrs = {}, text = "") {
  const el = document.createElement(tag);
  for (const k in attrs) {
    if (k === "class") el.className = attrs[k];
    else el.setAttribute(k, attrs[k]);
  }
  if (text) el.textContent = text;
  return el;
}

function clearElement(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function renderDynastiesList(container, dynasties) {
  clearElement(container);

  if (!Array.isArray(dynasties) || dynasties.length === 0) {
    container.appendChild(createElement("div", { class: "empty" }, "Няма заредени династии."));
    return;
  }

  const list = createElement("div", { class: "dynasties-list" });
  dynasties.forEach(d => {
    const item = createElement("div", { class: "dynasty-item" });
    const title = createElement("div", { class: "dynasty-title" }, d.name || "Без име");
    const meta = createElement("div", { class: "dynasty-meta" }, `Произход: ${d.origin || "неизвестен"} • Начало: ${d.start_year ?? "?"}`);
    if (d.color) title.style.backgroundColor = d.color;
    item.appendChild(title);
    item.appendChild(meta);
    list.appendChild(item);
  });

  container.appendChild(list);
}

export function initDynastiesPanel(selector = "#dynasties-panel") {
  const container = document.querySelector(selector);
  if (!container) return;

  // Показваме кратък статус докато има/няма данни
  const status = createElement("div", { class: "dynasties-status" }, "Зареждане на династии...");
  container.appendChild(status);

  // Вземаме династиите от RegistryRef (вече зареден от main.js)
  const dynasties = (RegistryRef && RegistryRef.dynasties) ? RegistryRef.dynasties : [];

  // Ако няма данни, показваме съобщение
  if (!dynasties || dynasties.length === 0) {
    status.textContent = "Няма данни за династии. Увери се, че dynasties.json е зареден в Registry.";
    // все пак опитваме да рендерираме празен списък
    renderDynastiesList(container, []);
    return;
  }

  // Премахваме статуса и рендерираме списъка
  status.remove();
  renderDynastiesList(container, dynasties);
}

// Автоматично инициализиране, ако DOM е готов и има елемент с id="dynasties-panel"
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initDynastiesPanel());
} else {
  initDynastiesPanel();
}
