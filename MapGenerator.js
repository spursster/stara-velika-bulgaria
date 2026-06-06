/**
 * MapGenerator.js – ПРОЦЕДУРНА VORONOI КАРТА (версия 3.0)
 * - Генерира автоматично полигони за всички региони
 * - Оцветява според притежател (зелено – ваш, червено – враг, лилаво – древен, сиво – независим)
 * - Няма нужда от ръчни координати или рисуване
 */

window.generateMapCanvas = function() {
    console.warn("generateMapCanvas е остаряла. Използвайте openInteractiveMap().");
};

window.openInteractiveMap = function() {
    const oldModal = document.getElementById('interactive-map-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'interactive-map-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(8px);
        z-index: 300000; display: flex; align-items: center; justify-content: center;
        padding: 15px; box-sizing: border-box;
    `;

    modal.innerHTML = `
        <div style="background: #0a0a1a; border: 2px solid #d4af37; border-radius: 24px; width: 100%; max-width: 1200px; height: 85vh; display: flex; flex-direction: column; overflow: hidden;">
            <div style="padding: 12px; background: #1a1a2e; border-bottom: 2px solid #d4af37; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="color: #ffd700; margin: 0;">🗺️ Карта на Велика България</h2>
                <button id="closeMapBtn" style="background: #2c1a0c; border: 1px solid #ff8888; border-radius: 50%; width: 32px; height: 32px; color: #ff8888; cursor: pointer;">✕</button>
            </div>
            <div id="voronoi-map-container" style="flex: 1; background: #0f0f1a; position: relative;"></div>
            <div style="padding: 8px; background: #1a1a2e; border-top: 1px solid #d4af37; font-size: 12px; color: #ccc; text-align: center;">
                🏰 Кликнете върху регион за информация
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const container = document.getElementById('voronoi-map-container');
    if (!container) return;

    // Вземаме регионите от worldData
    const regions = Object.values(window.worldData.regions);
    const regionNames = regions.map(r => r.name);
    const ownedRegions = (window.playerRegions && window.playerRegions.flat) ? window.playerRegions.flat() : [];

    // Определяме цвят за регион
    function getRegionColor(region) {
        if (ownedRegions.includes(region.name)) return '#2c8a2c';      // зелен – ваш
        if (region.ancientOwner) return '#aa55ff';                    // лилав – древна цивилизация
        if (region.nativeClans && region.nativeClans.length > 0) return '#aa3a3a'; // червен – враг
        return '#6a6a6a';                                            // сив – независим
    }

    // Генерираме произволни точки (центрове на полигони) – разпределени равномерно
    const width = container.clientWidth;
    const height = container.clientHeight;
    const points = [];
    const margin = 60;
    const cols = Math.ceil(Math.sqrt(regions.length) * 1.2);
    const rows = Math.ceil(regions.length / cols);
    
    let idx = 0;
    for (let i = 0; i < cols && idx < regions.length; i++) {
        for (let j = 0; j < rows && idx < regions.length; j++) {
            let x = margin + (i / (cols - 1)) * (width - 2 * margin);
            let y = margin + (j / (rows - 1)) * (height - 2 * margin);
            // Добавяме малко случаен шум за по-естествен вид
            x += (Math.random() - 0.5) * 25;
            y += (Math.random() - 0.5) * 25;
            points.push({ x, y, region: regions[idx] });
            idx++;
        }
    }
    // Ако има останали региони, ги добавяме на случаен принцип
    while (idx < regions.length) {
        points.push({
            x: margin + Math.random() * (width - 2 * margin),
            y: margin + Math.random() * (height - 2 * margin),
            region: regions[idx]
        });
        idx++;
    }

    // Построяване на Voronoi диаграма с помощта на библиотека (ако не е заредена – добавяме динамично)
    if (typeof window.d3 === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
        script.onload = () => renderVoronoi();
        document.head.appendChild(script);
    } else {
        renderVoronoi();
    }

    function renderVoronoi() {
        const voronoi = d3.Delaunay.from(points.map(p => [p.x, p.y]));
        const diagram = voronoi.voronoi([0, 0, width, height]);
        
        // Изчистваме контейнера
        container.innerHTML = '';
        
        // Рисуваме всеки полигон
        points.forEach((point, i) => {
            const cell = diagram.cellPolygon(i);
            if (!cell) return;
            
            const region = point.region;
            const color = getRegionColor(region);
            
            // Създаваме SVG полигон
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.style.position = 'absolute';
            svg.style.top = '0';
            svg.style.left = '0';
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.style.pointerEvents = 'none';
            
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const pointsAttr = cell.map(p => `${p[0]},${p[1]}`).join(' ');
            polygon.setAttribute('points', pointsAttr);
            polygon.setAttribute('fill', color);
            polygon.setAttribute('stroke', '#d4af37');
            polygon.setAttribute('stroke-width', '1.5');
            polygon.setAttribute('stroke-opacity', '0.7');
            polygon.setAttribute('fill-opacity', '0.75');
            polygon.style.pointerEvents = 'visible';
            polygon.style.cursor = 'pointer';
            
            // Добавяме текст с името на региона
            const center = [point.x, point.y];
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', center[0]);
            text.setAttribute('y', center[1]);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', '#fff');
            text.setAttribute('font-size', '11px');
            text.setAttribute('font-family', 'Cinzel, serif');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-shadow', '1px 1px 0 #000');
            text.setAttribute('pointer-events', 'none');
            text.textContent = region.name.length > 15 ? region.name.slice(0, 12) + '…' : region.name;
            
            svg.appendChild(polygon);
            svg.appendChild(text);
            container.appendChild(svg);
            
            // Клик върху полигона
            polygon.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof window.inspectRegion === 'function') {
                    window.inspectRegion(region.name);
                } else {
                    alert(`${region.name}\nВойски: ${region.armySize}\nЗащита: ${region.defenseLevel}`);
                }
            });
        });
        
        // Добавяме бутони за zoom (опционално – не е необходимо за Voronoi)
        console.log("✅ Voronoi карта генерирана с " + points.length + " региона.");
    }

    // Затваряне
    const closeBtn = modal.querySelector('#closeMapBtn');
    if (closeBtn) closeBtn.onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
};

window.refreshMap = function() {
    const modal = document.getElementById('interactive-map-modal');
    if (modal) {
        modal.remove();
        window.openInteractiveMap();
    } else {
        console.warn("Картата не е отворена.");
    }
};

console.log("✅ MapGenerator.js версия 3.0 зареден – процедурна Voronoi карта без ръчни координати");
