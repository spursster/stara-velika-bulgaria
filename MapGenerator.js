/**
 * mapGenerator.js – ИНТЕРАКТИВНА КАРТА С LEAFLET (заменя Canvas версията)
 * Версия: 2.0 – с поддръжка на ancientOwner и адаптивен дизайн
 */

// Глобална променлива за запазване на текущата карта (ако е необходимо)
window.currentMap = null;

window.generateMapCanvas = function(containerId) {
    // Тази функция вече не е нужна за Canvas, но я оставяме за съвместимост
    // Вместо това използваме openInteractiveMap
    console.warn("generateMapCanvas е остаряла. Използвайте openInteractiveMap().");
};

window.openInteractiveMap = function() {
    // Премахваме стар модал, ако има
    const oldModal = document.getElementById('interactive-map-modal');
    if (oldModal) oldModal.remove();

    // Създаваме модал за картата
    const modal = document.createElement('div');
    modal.id = 'interactive-map-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(6px);
        z-index: 300000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 15px;
        box-sizing: border-box;
    `;

    modal.innerHTML = `
        <div style="background: #0a0a1a; border: 2px solid #d4af37; border-radius: 24px; width: 100%; max-width: 1200px; height: 80vh; display: flex; flex-direction: column; overflow: hidden;">
            <div style="padding: 10px; background: #1a1a2e; border-bottom: 2px solid #d4af37; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="color: #ffd700; margin: 0;">🗺️ Световна карта</h2>
                <button id="closeMapBtn" style="background: #2c1a0c; border: 1px solid #ff8888; border-radius: 50%; width: 32px; height: 32px; color: #ff8888; cursor: pointer; font-size: 18px;">✕</button>
            </div>
            <div id="leaflet-map-container" style="flex: 1; background: #000;"></div>
            <div style="padding: 8px; background: #1a1a2e; border-top: 1px solid #d4af37; font-size: 12px; color: #ccc; text-align: center;">
                Кликнете върху маркер за информация
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const mapContainer = document.getElementById('leaflet-map-container');
    if (!mapContainer) return;

    // Инициализация на картата (център върху България)
    const map = L.map(mapContainer).setView([42.5, 25.5], 6);
    window.currentMap = map;

    // Добавяне на фон (OpenStreetMap с по-тъмен стил, за да пасва на играта)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 8,
        minZoom: 4
    }).addTo(map);

    // Взимаме регионите
    const regions = Object.values(window.worldData.regions);
    const ownedRegions = (window.playerRegions && window.playerRegions.flat) ? window.playerRegions.flat() : [];

    // Функция за цвят според притежател
    function getRegionColor(region) {
        if (ownedRegions.includes(region.name)) return '#2c5a2a';      // зелен – ваш
        if (region.ancientOwner) return '#8a2be2';                    // лилав – древна цивилизация
        if (region.nativeClans && region.nativeClans.length > 0) return '#8b3a3a'; // червен – вражески клан
        return '#4a4a4a';                                            // сив – независим
    }

    // Тъй като нямаме географски координати, разпределяме регионите в кръг около центъра
    // В бъдеще можете да замените с реални lat/lon, като ги добавите в worldData.regions
    const angleStep = (2 * Math.PI) / regions.length;
    const centerLat = 42.5, centerLng = 25.5;
    const radius = 2.5; // градуси

    regions.forEach((region, idx) => {
        const angle = idx * angleStep;
        const lat = centerLat + radius * Math.cos(angle);
        const lng = centerLng + radius * Math.sin(angle);
        const color = getRegionColor(region);

        // Добавяме кръгъл маркер (circleMarker) – по-издържлив и лесен за стилизиране
        const marker = L.circleMarker([lat, lng], {
            radius: 12,
            fillColor: color,
            color: '#d4af37',
            weight: 1.5,
            opacity: 0.8,
            fillOpacity: 0.75
        }).addTo(map);

        // Показване на името при задържане на мишката
        marker.bindTooltip(region.name, { sticky: true, className: 'region-tooltip' });

        // Клик върху маркер – извиква инспекция на региона
        marker.on('click', () => {
            if (typeof window.inspectRegion === 'function') {
                window.inspectRegion(region.name);
            } else {
                alert(`${region.name}\nВойски: ${region.armySize}\nЗащита: ${region.defenseLevel}\nРесурс: ${region.resource || 'неизвестен'}`);
            }
        });
    });

    // Затваряне на модала
    const closeBtn = modal.querySelector('#closeMapBtn');
    if (closeBtn) closeBtn.onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

window.refreshMap = function() {
    // Ако картата е отворена, я затваряме и отваряме наново (опресняване)
    const modal = document.getElementById('interactive-map-modal');
    if (modal) {
        modal.remove();
        window.openInteractiveMap();
    } else {
        console.warn("Картата не е отворена, няма какво да се опресни.");
    }
};

// За да не се чупи код, който използва старата функция openRegionsMap, я пренасочваме
if (typeof window.openRegionsMap === 'function') {
    const oldOpenRegions = window.openRegionsMap;
    window.openRegionsMap = function() {
        window.openInteractiveMap();
    };
}

console.log("✅ mapGenerator.js зареден – LEАFLET карта, интерактивна, с цветове за ancientOwner");
