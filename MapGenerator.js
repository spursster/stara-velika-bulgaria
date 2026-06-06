/**
 * MapGenerator.js – ПРОЦЕДУРНА VORONOI КАРТА (версия 3.2)
 * - Автоматично генерира фиксирани координати за всички региони
 * - НЕ променя world_data.js – всички координати се изчисляват на летене
 * - Картата е стабилна (една и съща при всяко отваряне)
 */

// Хеш функция за преобразуване на низ в число (детерминистично)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function getRegionCoordinates(regionName, index, total) {
    // Предварително дефинирани зони за исторически региони (на база ключови думи)
    const nameLower = regionName.toLowerCase();
    
    // Балкански региони (център – България)
    if (nameLower.includes("плиска") || nameLower.includes("преслав") || nameLower.includes("търнов") ||
        nameLower.includes("видин") || nameLower.includes("софия") || nameLower.includes("пловдив") ||
        nameLower.includes("одрин") || nameLower.includes("траки") || nameLower.includes("мизия") ||
        nameLower.includes("добруджа") || nameLower.includes("македония") || nameLower.includes("битоля") ||
        nameLower.includes("охрид") || nameLower.includes("силистра") || nameLower.includes("варна") ||
        nameLower.includes("русе") || nameLower.includes("шум") || nameLower.includes("бургас") ||
        nameLower.includes("стара загора") || nameLower.includes("хасково") || nameLower.includes("кърджали")) {
        // Балкани – x между 300 и 700, y между 250 и 450
        let hash = simpleHash(regionName);
        let x = 300 + (hash % 400);
        let y = 250 + (Math.floor(hash / 100) % 200);
        return { x, y };
    }
    
    // Западна Европа (Италия, Франция, Германия, Британия)
    if (nameLower.includes("венеция") || nameLower.includes("рим") || nameLower.includes("париж") ||
        nameLower.includes("лондон") || nameLower.includes("ахен") || nameLower.includes("берлин") ||
        nameLower.includes("виена") || nameLower.includes("прага") || nameLower.includes("милано") ||
        nameLower.includes("неапол") || nameLower.includes("марсилия") || nameLower.includes("лион") ||
        nameLower.includes("бордо") || nameLower.includes("кентърбъри") || nameLower.includes("единбург") ||
        nameLower.includes("дъблин") || nameLower.includes("брюксел") || nameLower.includes("кьолн") ||
        nameLower.includes("мюнхен") || nameLower.includes("хамбург") || nameLower.includes("бремен") ||
        nameLower.includes("франкфурт") || nameLower.includes("ко") && (nameLower.includes("енхаген") === false)) {
        let hash = simpleHash(regionName);
        let x = 100 + (hash % 300);
        let y = 200 + (Math.floor(hash / 100) % 300);
        return { x, y };
    }
    
    // Източна Европа, Русия, Степ (Киев, Москва, Кавказ, Хазари)
    if (nameLower.includes("киев") || nameLower.includes("москва") || nameLower.includes("новгород") ||
        nameLower.includes("владимир") || nameLower.includes("суздал") || nameLower.includes("рязан") ||
        nameLower.includes("твер") || nameLower.includes("смоленск") || nameLower.includes("полоцк") ||
        nameLower.includes("минск") || nameLower.includes("витебск") || nameLower.includes("чернигов") ||
        nameLower.includes("переяслав") || nameLower.includes("астрахан") || nameLower.includes("сарай") ||
        nameLower.includes("казан") || nameLower.includes("булгар") || nameLower.includes("дербент") ||
        nameLower.includes("тбилиси") || nameLower.includes("баку")) {
        let hash = simpleHash(regionName);
        let x = 650 + (hash % 350);
        let y = 150 + (Math.floor(hash / 100) % 300);
        return { x, y };
    }
    
    // Близък изток, Персия, Арабия, Египет
    if (nameLower.includes("анкара") || nameLower.includes("кония") || nameLower.includes("трапезунд") ||
        nameLower.includes("никея") || nameLower.includes("смирна") || nameLower.includes("антиохия") ||
        nameLower.includes("дамаск") || nameLower.includes("багдад") || nameLower.includes("йерусалим") ||
        nameLower.includes("каиро") || nameLower.includes("александрия") || nameLower.includes("мемфис") ||
        nameLower.includes("тива") || nameLower.includes("мекка") || nameLower.includes("медина") ||
        nameLower.includes("сана") || nameLower.includes("маскат") || nameLower.includes("техеран") ||
        nameLower.includes("исфахан") || nameLower.includes("шираз") || nameLower.includes("табриз") ||
        nameLower.includes("нишапур") || nameLower.includes("мерв") || nameLower.includes("самарканд") ||
        nameLower.includes("бухара") || nameLower.includes("делхи") || nameLower.includes("бомбай") ||
        nameLower.includes("калкута") || nameLower.includes("мадрас") || nameLower.includes("пешавар") ||
        nameLower.includes("кашмир") || nameLower.includes("ланка")) {
        let hash = simpleHash(regionName);
        let x = 800 + (hash % 400);
        let y = 300 + (Math.floor(hash / 100) % 300);
        return { x, y };
    }
    
    // Далечен изток, Китай, Япония, Корея
    if (nameLower.includes("пекин") || nameLower.includes("нанкин") || nameLower.includes("сиан") ||
        nameLower.includes("хангжу") || nameLower.includes("киото") || nameLower.includes("токио") ||
        nameLower.includes("корея") || nameLower.includes("виетнам")) {
        let hash = simpleHash(regionName);
        let x = 1150 + (hash % 200);
        let y = 250 + (Math.floor(hash / 100) % 250);
        return { x, y };
    }
    
    // Африка (без Египет)
    if (nameLower.includes("картаген") || nameLower.includes("тунис") || nameLower.includes("триполи") ||
        nameLower.includes("киренайка") || nameLower.includes("фес") || nameLower.includes("маракеш") ||
        nameLower.includes("тимбукту") || nameLower.includes("гана") || nameLower.includes("сонгай") ||
        nameLower.includes("мали") || nameLower.includes("абисиния") || nameLower.includes("мерое") ||
        nameLower.includes("асуан") || nameLower.includes("нубия") || nameLower.includes("зимбабве") ||
        nameLower.includes("килиманджаро") || nameLower.includes("занзибар") || nameLower.includes("мадагаскар") ||
        nameLower.includes("конго") || nameLower.includes("сахара")) {
        let hash = simpleHash(regionName);
        let x = 500 + (hash % 500);
        let y = 550 + (Math.floor(hash / 100) % 250);
        return { x, y };
    }
    
    // Острови (Гренландия, Исландия, Ирландия, Сицилия, Крит, Кипър, Малта, Балеари, Канарски, Мадейра)
    if (nameLower.includes("гренландия") || nameLower.includes("исландия") || nameLower.includes("ирландия") ||
        nameLower.includes("сицилия") || nameLower.includes("крит") || nameLower.includes("кипър") ||
        nameLower.includes("малта") || nameLower.includes("балеари") || nameLower.includes("канарски") ||
        nameLower.includes("мадейра")) {
        let hash = simpleHash(regionName);
        let x = 50 + (hash % 250);
        let y = 400 + (Math.floor(hash / 100) % 200);
        return { x, y };
    }
    
    // Фентъзи митични земи (разположени в горния ляв и десен ъгъл)
    const fantasyKeywords = ["авалон", "атлантида", "му", "лемурия", "хиперборея", "елдърлейн", "мория", "еребор", "мордор", "изенгард", "рохан", "гондор", "ривендъл", "лотлориен", "мирквуд", "дейл", "есгарот", "валинор", "нибелунгайм", "мидгард", "асгард", "ванахейм", "йотунхейм", "алфхайм", "сварталхайм", "настронт", "олимп", "тартар", "елизиум", "хесперид"];
    if (fantasyKeywords.some(kw => nameLower.includes(kw))) {
        let hash = simpleHash(regionName);
        let x = (hash % 2 === 0) ? 50 + (hash % 250) : 1050 + (hash % 200);
        let y = 50 + (Math.floor(hash / 100) % 200);
        return { x, y };
    }
    
    // Всички останали (процедурни или неизвестни) – разполагаме ги в оставащото пространство
    let hash = simpleHash(regionName);
    let x = 300 + (hash % 800);
    let y = 100 + (Math.floor(hash / 100) % 500);
    return { x, y };
}

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
            if (region.nativeClans && region.nativeClans.length > 0 && region.nativeClans[0] !== "Независим") return '#aa3a3a'; // враг
            return '#6a6a6a';                                            // независим
        }

        // Генериране на точки със стабилни координати
        const points = [];
        const margin = Math.min(50, width * 0.08);
        
        regions.forEach((region, idx) => {
            // Получаваме или изчисляваме координати
            let x, y;
            if (region.x !== undefined && region.y !== undefined) {
                // Ако вече има координати в worldData, ползваме тях
                x = margin + (region.x / 1300) * (width - 2 * margin);
                y = margin + (region.y / 700) * (height - 2 * margin);
            } else {
                // Изчисляваме координати на база име
                const coords = getRegionCoordinates(region.name, idx, regions.length);
                x = margin + (coords.x / 1300) * (width - 2 * margin);
                y = margin + (coords.y / 700) * (height - 2 * margin);
            }
            points.push({ x, y, region });
        });

        // Използваме d3-delaunay
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
        container.innerHTML = '';

        const delaunay = d3.Delaunay.from(points.map(p => [p.x, p.y]));
        const voronoi = delaunay.voronoi([0, 0, width, height]);

        points.forEach((point, i) => {
            const cell = voronoi.cellPolygon(i);
            if (!cell || cell.length < 3) return;

            const region = point.region;
            const color = getRegionColor(region);

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

            let fontSize = Math.max(9, Math.min(14, width / 45));
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', point.x);
            text.setAttribute('y', point.y);
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

    setTimeout(() => renderVoronoiMap(), 30);

    let resizeTimeout;
    function handleResize() {
        if (!document.getElementById('interactive-map-modal')) return;
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => renderVoronoiMap(), 200);
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => setTimeout(() => renderVoronoiMap(), 100));

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
        modal.remove();
        window.openInteractiveMap();
    } else {
        console.warn("Картата не е отворена.");
    }
};

console.log("✅ MapGenerator.js версия 3.2 зареден – стабилна Voronoi карта без промяна на world_data.js");
