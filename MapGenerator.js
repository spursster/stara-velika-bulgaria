/**
 * mapGenerator.js – ЛЕКА АВТОМАТИЧНА КАРТА ЗА ВЕЛИКА БЪЛГАРИЯ
 * Версия: 1.1 – с поддръжка на ancientOwner
 */

window.currentMapCanvas = null;

window.generateMapCanvas = function(containerId, seed = "default") {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Контейнерът #${containerId} не съществува!`);
        return;
    }

    if (!window.worldData || !window.worldData.regions) {
        container.innerHTML = '<div style="color:#ffaa66;">Няма заредени региони.</div>';
        return;
    }

    const mapWidth = 800;
    const mapHeight = 600;
    const tileMargin = 2;

    let regions = Object.values(window.worldData.regions);
    if (regions.length === 0) {
        container.innerHTML = '<div style="color:#ffaa66;">Няма региони за показване.</div>';
        return;
    }

    regions.sort((a, b) => a.name.localeCompare(b.name));

    const cols = Math.ceil(Math.sqrt(regions.length));
    const rows = Math.ceil(regions.length / cols);
    const tileWidth = (mapWidth - (cols - 1) * tileMargin) / cols;
    const tileHeight = (mapHeight - (rows - 1) * tileMargin) / rows;

    const canvas = document.createElement('canvas');
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    canvas.style.border = '2px solid #d4af37';
    canvas.style.borderRadius = '8px';
    canvas.style.cursor = 'pointer';
    canvas.style.backgroundColor = '#1a1a2e';
    
    container.innerHTML = '';
    container.appendChild(canvas);
    window.currentMapCanvas = canvas;

    const ctx = canvas.getContext('2d');

    let ownedRegions = [];
    if (window.playerRegions) {
        ownedRegions = window.playerRegions.flat ? window.playerRegions.flat() : window.playerRegions;
    }

    const regionRects = [];

    for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = col * (tileWidth + tileMargin);
        const y = row * (tileHeight + tileMargin);
        const width = tileWidth;
        const height = tileHeight;

        // ⭐ НОВА ЛОГИКА ЗА ЦВЕТА
            let bgColor = '#5a5a5a'; // неутрален
        if (ownedRegions.includes(region.name)) {
            bgColor = '#2c5a2a'; // зелен – ваш
        } else if (region.ancientOwner) {
            bgColor = '#8a2be2'; // лилав – завзет от древна цивилизация
        } else if (region.nativeClans && region.nativeClans.length > 0) {
            bgColor = '#8b3a3a'; // червеникав – враг
        } else {
            bgColor = '#4a4a4a'; // тъмно сив – независим
        }
        ctx.fillStyle = bgColor;
        ctx.shadowBlur = 0;
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = '#d4af37';
        ctx.strokeRect(x, y, width, height);

        let shortName = region.name.length > 10 ? region.name.substring(0, 8) + '..' : region.name;
        ctx.fillStyle = '#ffdd99';
        ctx.font = `${Math.min(12, Math.floor(height / 4))}px Cinzel, serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(shortName, x + width / 2, y + height / 2);

        regionRects.push({
            region: region,
            x: x, y: y, w: width, h: height
        });
    }

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        const hit = regionRects.find(r => 
            mouseX >= r.x && mouseX <= r.x + r.w &&
            mouseY >= r.y && mouseY <= r.y + r.h
        );
        if (hit && typeof window.inspectRegion === 'function') {
            window.inspectRegion(hit.region.name);
        } else if (hit) {
            alert(`Регион: ${hit.region.name}\nТерен: ${hit.region.terrain}\nРесурс: ${hit.region.resource}`);
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        const hit = regionRects.find(r => 
            mouseX >= r.x && mouseX <= r.x + r.w &&
            mouseY >= r.y && mouseY <= r.y + r.h
        );
        canvas.style.cursor = hit ? 'pointer' : 'default';
        if (hit) {
            canvas.title = `${hit.region.name} (Сила: ${hit.region.armySize}, Защита: ${hit.region.defenseLevel})`;
        } else {
            canvas.title = '';
        }
    });
};

window.refreshMap = function(containerId) {
    if (containerId) {
        window.generateMapCanvas(containerId);
    } else if (window.currentMapCanvas && window.currentMapCanvas.parentElement) {
        const container = window.currentMapCanvas.parentElement;
        if (container && container.id) {
            window.generateMapCanvas(container.id);
        } else {
            console.warn("Няма контейнер за опресняване на картата.");
        }
    } else {
        console.warn("Няма активна карта за опресняване.");
    }
};

window.openInteractiveMap = function() {
    const oldModal = document.getElementById('interactive-map-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'interactive-map-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
        z-index: 200000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Cinzel', serif;
        padding: 20px;
        box-sizing: border-box;
    `;

    modal.innerHTML = `
        <div style="background: #0a0a1a; border: 2px solid #d4af37; border-radius: 24px; padding: 20px; max-width: 90vw; max-height: 90vh; overflow: auto; text-align: center;">
            <h2 style="color:#ffd700; margin-top:0;">🗺️ ИНТЕРАКТИВНА КАРТА</h2>
            <div id="map-container-modal" style="margin: 10px 0;"></div>
            <button id="close-map-modal" style="background:#2c1a0c; border:1px solid #d4af37; border-radius:30px; padding:8px 20px; color:#ffdd99; cursor:pointer; margin-top:15px;">Затвори</button>
        </div>
    `;

    document.body.appendChild(modal);

    const mapContainer = modal.querySelector('#map-container-modal');
    window.generateMapCanvas('map-container-modal');

    const closeBtn = modal.querySelector('#close-map-modal');
    closeBtn.onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

console.log("✅ mapGenerator.js зареден – с поддръжка на ancientOwner (лилави региони при инвазия)");
