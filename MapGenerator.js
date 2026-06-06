/**
 * MapGenerator.js – Leaflet карта с постоянни имена и линии между регионите
 * - Имената на регионите се винаги видими (без mouseover)
 * - Линиите се генерират автоматично между близки региони (разстояние < 2.5 градуса)
 * - Запазва zoom, pan, клъстери, цветове според притежател
 */

window.openInteractiveMap = function() {
    // Проверка за Leaflet
    if (typeof L === 'undefined') {
        console.error("Leaflet (L) не е зареден");
        alert("Грешка: Липсва Leaflet библиотеката.");
        return;
    }

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
            <div style="padding:6px 10px; background:#1a1a2e; border-top:1px solid #d4af37; font-size:0.7rem; color:#ccc; text-align:center;">
                🖱️ Плъзгай | 🔍 Мащабирай | 🏷️ Имената на регионите са винаги видими | 🌐 Линиите показват връзки
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const container = document.getElementById('leaflet-cluster-container');
    if (!container) return;

    const map = L.map(container).setView([42.5, 25.5], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB',
        subdomains: 'abcd',
        maxZoom: 8,
        minZoom: 4
    }).addTo(map);

    // ---------- Данни за регионите ----------
    const regions = Object.values(window.worldData.regions);
    const ownedRegions = (window.playerRegions && window.playerRegions.flat) ? window.playerRegions.flat() : [];

    // Цвят според притежател
    function getRegionColor(region) {
        if (ownedRegions.includes(region.name)) return '#2c8a2c';
        if (region.ancientOwner) return '#aa55ff';
        if (region.nativeClans && region.nativeClans.length > 0 && region.nativeClans[0] !== "Независим") return '#cc5555';
        return '#6a6a6a';
    }

    // Генериране на координати (същата логическа подредба като преди)
    function getCoords(regionName, idx) {
        const nameLower = regionName.toLowerCase();
        if (nameLower.includes("плиска") || nameLower.includes("преслав") || nameLower.includes("търнов") ||
            nameLower.includes("софия") || nameLower.includes("пловдив") || nameLower.includes("одрин") ||
            nameLower.includes("македония")) {
            return { lat: 42.0 + (idx % 5) * 0.4, lng: 24.0 + (idx % 7) * 0.6 };
        }
        if (nameLower.includes("рим") || nameLower.includes("париж") || nameLower.includes("лондон")) {
            return { lat: 48.0 + (idx % 4) * 0.5, lng: 2.0 + (idx % 6) * 1.2 };
        }
        if (nameLower.includes("киев") || nameLower.includes("москва")) {
            return { lat: 50.0 + (idx % 3) * 0.8, lng: 30.0 + (idx % 5) * 1.5 };
        }
        if (nameLower.includes("каиро") || nameLower.includes("багдад")) {
            return { lat: 32.0 + (idx % 4) * 0.7, lng: 44.0 + (idx % 5) * 1.2 };
        }
        const fantasy = ["авалон", "атлантида", "мордор", "елизиум"];
        if (fantasy.some(kw => nameLower.includes(kw))) {
            return { lat: 35.0 + (idx % 5) * 3.0, lng: 15.0 + (idx % 6) * 4.0 };
        }
        const angle = idx * 0.15;
        const radius = 5.5;
        return { lat: 42.5 + radius * Math.cos(angle), lng: 25.5 + radius * Math.sin(angle) };
    }

    // Изчисляваме координатите за всички региони и ги запазваме
    const regionPoints = regions.map((region, idx) => {
        const coords = getCoords(region.name, idx);
        return { region, lat: coords.lat, lng: coords.lng };
    });

    // ---------- 1. ДОБАВЯНЕ НА ЛИНИИ МЕЖДУ БЛИЗКИ РЕГИОНИ ----------
    // Функция за изчисляване на разстояние в градуси (евклидово)
    function distance(lat1, lng1, lat2, lng2) {
        const dx = lat1 - lat2;
        const dy = lng1 - lng2;
        return Math.sqrt(dx*dx + dy*dy);
    }
    const MAX_DIST = 2.5; // максимално разстояние за свързване (около 250 км)

    const lines = [];
    for (let i = 0; i < regionPoints.length; i++) {
        for (let j = i+1; j < regionPoints.length; j++) {
            const d = distance(regionPoints[i].lat, regionPoints[i].lng, regionPoints[j].lat, regionPoints[j].lng);
            if (d < MAX_DIST) {
                lines.push([[regionPoints[i].lat, regionPoints[i].lng], [regionPoints[j].lat, regionPoints[j].lng]]);
            }
        }
    }
    // Добавяме линиите към картата (първо, за да са под маркерите)
    lines.forEach(line => {
        L.polyline(line, {
            color: '#d4af37',
            weight: 1.5,
            opacity: 0.4,
            dashArray: '5, 5' // пунктир за по-приятен вид
        }).addTo(map);
    });
    console.log(`📏 Добавени ${lines.length} линии между региони.`);

    // ---------- 2. ДОБАВЯНЕ НА МАРКЕРИ (кръгчета) И ПОСТОЯННИ ИМЕНА ----------
    const markers = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true
    });

    regionPoints.forEach((rp) => {
        const region = rp.region;
        const color = getRegionColor(region);
        
        // 2.1 Кръгче (маркер)
        const circle = L.circleMarker([rp.lat, rp.lng], {
            radius: 10,
            fillColor: color,
            color: '#d4af37',
            weight: 1.8,
            fillOpacity: 0.85
        });
        circle.bindTooltip(`<b>${region.name}</b><br>🏰 Сила: ${region.armySize}<br>🛡️ Защита: ${region.defenseLevel}`, { sticky: true });
        circle.on('click', () => {
            if (typeof window.inspectRegion === 'function') {
                window.inspectRegion(region.name);
            } else {
                alert(region.name);
            }
        });
        markers.addLayer(circle);
        
        // 2.2 Постоянно име (текст) – използваме L.marker с divIcon, за да е винаги видимо
        const labelIcon = L.divIcon({
            className: 'region-label',
            html: `<div style="background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 12px; border: 1px solid #d4af37; color: #ffdd99; font-size: 11px; font-family: 'Cinzel', serif; white-space: nowrap; text-shadow: 1px 1px 0 #000;">${region.name}</div>`,
            iconSize: [80, 20],
            iconAnchor: [40, 25] // позициониране под кръгчето
        });
        const labelMarker = L.marker([rp.lat, rp.lng], { icon: labelIcon, interactive: false });
        markers.addLayer(labelMarker);
    });

    map.addLayer(markers);
    
    // ---------- Затваряне на модала ----------
    const closeBtn = modal.querySelector('#closeMapBtn');
    if (closeBtn) closeBtn.onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    window.addEventListener('resize', () => setTimeout(() => map.invalidateSize(), 100));
};

window.refreshMap = function() {
    const modal = document.getElementById('interactive-map-modal');
    if (modal) modal.remove();
    window.openInteractiveMap();
};

console.log("✅ MapGenerator.js – Leaflet с постоянни имена и линии между регионите");
