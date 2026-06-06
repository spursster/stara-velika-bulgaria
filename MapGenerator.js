/**
 * MapGenerator.js – ПРОЦЕДУРНА VORONOI КАРТА (версия 3.1 – АДАПТИВНА)
 * - Автоматично генерира полигони за всички региони
 * - Адаптивна към размерите на екрана (телефон/таблет/десктоп)
 * - Прерисува се при завъртане или промяна на размера на прозореца
 */

let currentVoronoiMap = null; // за запазване на референция, ако е необходимо

window.openInteractiveMap = function() {
    const oldModal = document.getElementById('interactive-map-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'interactive-map-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(8px);
        z-index: 300000; display: flex; align-items: center; justify-content: center;
        padding: 12px; box-sizing: border-box;
    `;

    modal.innerHTML = `
        <div style="background: #0a0a1a; border: 2px solid #d4af37; border-radius: 24px; width: 100%; max-width: 1300px; height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
            <div style="padding: 10px 16px; background: #1a1a2e; border-bottom: 2px solid #d4af37; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                <h2 style="color: #ffd700; margin: 0; font-size: 1.2rem;">🗺️ Карта на Велика България</h2>
                <button id="closeMapBtn" style="background: #2c1a0c; border: 1px solid #ff8888; border-radius: 50%; width: 32px; height: 32px; color: #ff8888; cursor: pointer; font-size: 18px;">✕</button>
            </div>
            <div id="voronoi-map-container" style="flex: 1; background: #0f0f1a; position: relative; overflow: auto;"></div>
            <div style="padding: 6px 10px; background: #1a1a2e; border-top: 1px solid #d4af37; font-size: 0.7rem; color: #ccc; text-align: center; flex-shrink: 0;">
                🏰 Кликнете върху регион за информация
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const container = document.getElementById('voronoi-map-container');
    if (!container) return;

    // Функция за рисуване на картата с текущите размери
    function renderVoronoiMap() {
        if (!window.worldData || !window.worldData.regions) {
            console.warn("worldData не е готов");
            return;
        }

        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width < 100 || height < 100) return;

        const regions = Object.values(window.worldData.regions);
        const ownedRegions = (window.playerRegions && window.playerRegions.flat) ? window.playerRegions.flat() : [];

        function getRegionColor(region) {
            if (ownedRegions.includes(region.name)) return '#2c8a2c';      // ваш
            if (region.ancientOwner) return '#aa55ff';                    // древен
            if (region.nativeClans && region.nativeClans.length > 0) return '#aa3a3a'; // враг
            return '#6a6a6a';                                            // независим
        }

        // Генериране на точки в мрежа + случаен шум
        const points = [];
        const margin = Math.min(40, width * 0.08);
        const cols = Math.ceil(Math.sqrt(regions.length) * 1.2);
        const rows = Math.ceil(regions.length / cols);
        let idx = 0;
        for (let i = 0; i < cols && idx < regions.length; i++) {
            for (let j = 0; j < rows && idx < regions.length; j++) {
                let x = margin + (i / (cols - 1 || 1)) * (width - 2 * margin);
                let y = margin + (j / (rows - 1 || 1)) * (height - 2 * margin);
                x += (Math.random() - 0.5) * 18;
                y += (Math.random() - 0.5) * 18;
                points.push({ x, y, region: regions[idx] });
                idx++;
            }
        }
        while (idx < regions.length) {
            points.push({
                x: margin + Math.random() * (width - 2 * margin),
                y: margin + Math.random() * (height - 2 * margin),
                region: regions[idx]
            });
            idx++;
        }

        // Използваме d3-delaunay (ако d3 не е зареден, зареждаме динамично)
        if (typeof d3 === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
            script.onload = () => drawVoronoi(points, width, height, container, getRegionColor);
            document.head.appendChild(script);
        } else {
            drawVoronoi(points, width, height, container, getRegionColor);
        }
    }

    function drawVoronoi(points, width, height, container, getRegionColor) {
        // Изчистваме контейнера
        container.innerHTML = '';

        const delaunay = d3.Delaunay.from(points.map(p => [p.x, p.y]));
        const voronoi = delaunay.voronoi([0, 0, width, height]);

        points.forEach((point, i) => {
            const cell = voronoi.cellPolygon(i);
            if (!cell || cell.length < 3) return;

            const region = point.region;
            const color = getRegionColor(region);

            // Създаваме SVG елемент за тази клетка
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
            polygon.setAttribute('stroke-width', '1.2');
            polygon.setAttribute('stroke-opacity', '0.7');
            polygon.setAttribute('fill-opacity', '0.8');
            polygon.style.pointerEvents = 'visible';
            polygon.style.cursor = 'pointer';

            // Текст – размер според ширината на екрана
            let fontSize = Math.max(9, Math.min(14, width / 45));
            const center = [point.x, point.y];
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', center[0]);
            text.setAttribute('y', center[1]);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', '#fff');
            text.setAttribute('font-size', `${fontSize}px`);
            text.setAttribute('font-family', 'Cinzel, serif');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-shadow', '1px 1px 0px #000');
            text.setAttribute('pointer-events', 'none');
            let displayName = region.name;
            if (displayName.length > 15 && width < 600) displayName = displayName.slice(0, 12) + '…';
            else if (displayName.length > 20 && width < 900) displayName = displayName.slice(0, 16) + '…';
            text.textContent = displayName;

            svg.appendChild(polygon);
            svg.appendChild(text);
            container.appendChild(svg);

            polygon.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof window.inspectRegion === 'function') {
                    window.inspectRegion(region.name);
                } else {
                    alert(`${region.name}\nВойски: ${region.armySize}\nЗащита: ${region.defenseLevel}`);
                }
            });
        });
        console.log(`✅ Voronoi карта генерирана – ${points.length} региона, размер ${width}x${height}`);
    }

    // Първоначално рисуване (след малко за да се уверим, че контейнерът има размери)
    setTimeout(() => renderVoronoiMap(), 30);

    // Адаптивност – прерисуване при промяна на размера на прозореца (с debounce)
    let resizeTimeout;
    function handleResize() {
        if (!document.getElementById('interactive-map-modal')) return;
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderVoronoiMap();
        }, 200);
    }
    window.addEventListener('resize', handleResize);
    // Също така слушаме за завъртане на мобилни устройства
    window.addEventListener('orientationchange', () => {
        setTimeout(() => renderVoronoiMap(), 100);
    });

    // Затваряне на модала – премахваме слушателите, за да не останат висящи
    const closeBtn = modal.querySelector('#closeMapBtn');
    const closeModal = () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
        modal.remove();
    };
    if (closeBtn) closeBtn.onclick = closeModal;
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
};

window.refreshMap = function() {
    const modal = document.getElementById('interactive-map-modal');
    if (modal) {
        // При refresh просто затваряме и отваряме наново
        modal.remove();
        window.openInteractiveMap();
    } else {
        console.warn("Картата не е отворена.");
    }
};

console.log("✅ MapGenerator.js версия 3.1 зареден – адаптивна Voronoi карта");
