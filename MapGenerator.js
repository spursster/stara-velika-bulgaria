/**
 * MapGenerator.js – Leaflet с клъстери и цветове според притежател
 * - Адаптивен zoom и панорамиране
 * - Групира маркерите при отдалечен мащаб
 * - Няма нужда от d3
 */

window.openInteractiveMap = function() {
    const oldModal = document.getElementById('interactive-map-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'interactive-map-modal';
    modal.style.cssText = `
        position: fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.9); backdrop-filter:blur(8px);
        z-index:300000; display:flex; align-items:center; justify-content:center;
        padding:12px; box-sizing:border-box;
    `;

    modal.innerHTML = `
        <div style="background:#0a0a1a; border:2px solid #d4af37; border-radius:24px; width:100%; max-width:1300px; height:90vh; display:flex; flex-direction:column; overflow:hidden;">
            <div style="padding:10px 16px; background:#1a1a2e; border-bottom:2px solid #d4af37; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
                <h2 style="color:#ffd700; margin:0; font-size:1.2rem;">🗺️ Карта на Велика България</h2>
                <button id="closeMapBtn" style="background:#2c1a0c; border:1px solid #ff8888; border-radius:50%; width:32px; height:32px; color:#ff8888; cursor:pointer;">✕</button>
            </div>
            <div id="leaflet-cluster-container" style="flex:1; background:#0f0f1a;"></div>
            <div style="padding:6px 10px; background:#1a1a2e; border-top:1px solid #d4af37; font-size:0.7rem; color:#ccc; text-align:center; flex-shrink:0;">
                🖱️ Плъзгай и мащабирай с мишката | Кликни върху маркер за информация
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const container = document.getElementById('leaflet-cluster-container');
    if (!container) return;

    // Инициализация на картата (център Балканите, мащаб 5)
    const map = L.map(container).setView([42.5, 25.5], 5);

    // Тъмен tile слой (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 8,
        minZoom: 4
    }).addTo(map);

    // Клъстерна група (маркерите автоматично се групират при отдалечен zoom)
    const markers = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: function(cluster) {
            return L.divIcon({
                html: `<div style="background:#d4af37; color:#000; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-weight:bold;">${cluster.getChildCount()}</div>`,
                className: 'custom-cluster',
                iconSize: L.point(30, 30)
            });
        }
    });

    const regions = Object.values(window.worldData.regions);
    const ownedRegions = (window.playerRegions && window.playerRegions.flat) ? window.playerRegions.flat() : [];

    function getRegionColor(region) {
        if (ownedRegions.includes(region.name)) return '#2c8a2c';      // ваш
        if (region.ancientOwner) return '#aa55ff';                    // древен
        if (region.nativeClans && region.nativeClans.length > 0 && region.nativeClans[0] !== "Независим") return '#cc5555'; // враг
        return '#6a6a6a';                                            // независим
    }

    // Генериране на координати (същата логическа подредба като при Voronoi)
    function getCoords(regionName, idx) {
        const nameLower = regionName.toLowerCase();
        // Балкани
        if (nameLower.includes("плиска") || nameLower.includes("преслав") || nameLower.includes("търнов") ||
            nameLower.includes("софия") || nameLower.includes("пловдив") || nameLower.includes("одрин") ||
            nameLower.includes("македония") || nameLower.includes("траки")) {
            return { lat: 42.0 + (idx % 5) * 0.4, lng: 24.0 + (idx % 7) * 0.6 };
        }
        // Западна Европа
        if (nameLower.includes("рим") || nameLower.includes("париж") || nameLower.includes("лондон") ||
            nameLower.includes("берлин") || nameLower.includes("виена")) {
            return { lat: 48.0 + (idx % 4) * 0.5, lng: 2.0 + (idx % 6) * 1.2 };
        }
        // Източна Европа
        if (nameLower.includes("киев") || nameLower.includes("москва") || nameLower.includes("минск")) {
            return { lat: 50.0 + (idx % 3) * 0.8, lng: 30.0 + (idx % 5) * 1.5 };
        }
        // Близък изток
        if (nameLower.includes("каиро") || nameLower.includes("багдад") || nameLower.includes("техеран")) {
            return { lat: 32.0 + (idx % 4) * 0.7, lng: 44.0 + (idx % 5) * 1.2 };
        }
        // Фентъзи
        const fantasyKeywords = ["авалон", "атлантида", "му", "лемурия", "хиперборея", "елдърлейн", "мория", "еребор", "мордор", "изенгард", "рохан", "гондор", "ривендъл", "лотлориен", "мирквуд", "дейл", "есгарот", "валинор", "нибелунгайм", "мидгард", "асгард", "ванахейм", "йотунхейм", "алфхайм", "сварталхайм", "настронт", "олимп", "тартар", "елизиум", "хесперид"];
        if (fantasyKeywords.some(kw => nameLower.includes(kw))) {
            return { lat: 35.0 + (idx % 5) * 3.0, lng: 15.0 + (idx % 6) * 4.0 };
        }
        // Останали – разполагаме в кръг около Балканите
        const angle = idx * 0.15;
        const radius = 5.5;
        return { lat: 42.5 + radius * Math.cos(angle), lng: 25.5 + radius * Math.sin(angle) };
    }

    // Създаване на маркери и добавяне в клъстер групата
    regions.forEach((region, idx) => {
        const { lat, lng } = getCoords(region.name, idx);
        const color = getRegionColor(region);
        
        const marker = L.circleMarker([lat, lng], {
            radius: 10,
            fillColor: color,
            color: '#d4af37',
            weight: 1.8,
            opacity: 0.9,
            fillOpacity: 0.85
        });
        
        marker.bindTooltip(`<b>${region.name}</b><br>🏰 Сила: ${region.armySize}<br>🛡️ Защита: ${region.defenseLevel}`, { sticky: true });
        
        marker.on('click', () => {
            if (typeof window.inspectRegion === 'function') {
                window.inspectRegion(region.name);
            } else {
                alert(`${region.name}\nВойски: ${region.armySize}\nЗащита: ${region.defenseLevel}`);
            }
        });
        
        markers.addLayer(marker);
    });

    map.addLayer(markers);
    
    // Затваряне
    const closeBtn = modal.querySelector('#closeMapBtn');
    if (closeBtn) closeBtn.onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    
    // Адаптивност – прецентриране при resize
    window.addEventListener('resize', () => setTimeout(() => map.invalidateSize(), 100));
};

window.refreshMap = function() {
    const modal = document.getElementById('interactive-map-modal');
    if (modal) modal.remove();
    window.openInteractiveMap();
};

console.log("✅ MapGenerator.js – Leaflet с клъстери, zoom и панорамиране");
