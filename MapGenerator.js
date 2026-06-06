/**
 * MapGenerator.js – Leaflet карта с иконки (вместо кръгчета)
 * - Иконки: 🏰 (твой), 👹 (враг), 🏺 (древен), 🏜️ (независим)
 * - Запазени: клъстери, линии, постоянни имена, zoom/pan
 */

window.openInteractiveMap = function() {
    if (typeof L === 'undefined') {
        console.error("Leaflet не е зареден");
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
                🖱️ Плъзгай | 🔍 Мащабирай | 🏷️ Имената са винаги видими | 🌐 Линиите показват пътища
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

    const regions = Object.values(window.worldData.regions);
    const ownedRegions = (window.playerRegions && window.playerRegions.flat) ? window.playerRegions.flat() : [];

    // Функция за определяне на иконка и цвят
    function getRegionIconAndColor(region) {
        if (ownedRegions.includes(region.name)) {
            return { icon: '🏰', bgColor: '#2c8a2c', borderColor: '#ffd700' }; // ваш – зелен замък
        }
        if (region.ancientOwner) {
            return { icon: '🏺', bgColor: '#aa55ff', borderColor: '#ffd700' }; // древен – лилава амфора
        }
        if (region.nativeClans && region.nativeClans.length > 0 && region.nativeClans[0] !== "Независим") {
            return { icon: '👹', bgColor: '#cc5555', borderColor: '#ffd700' }; // враг – червен демон
        }
        return { icon: '🏜️', bgColor: '#6a6a6a', borderColor: '#c9a87b' }; // независим – сива пустиня
    }

    // Координати (без кръг – групиране по зони)
    function getCoords(regionName, idx) {
        const nameLower = regionName.toLowerCase();
        // Балкани
        if (nameLower.includes("плиска") || nameLower.includes("преслав") || nameLower.includes("търнов") ||
            nameLower.includes("софия") || nameLower.includes("пловдив") || nameLower.includes("одрин") ||
            nameLower.includes("македония") || nameLower.includes("траки") || nameLower.includes("мизия") ||
            nameLower.includes("добруджа") || nameLower.includes("битоля") || nameLower.includes("охрид") ||
            nameLower.includes("силистра") || nameLower.includes("варна") || nameLower.includes("русе") ||
            nameLower.includes("шум") || nameLower.includes("бургас") || nameLower.includes("стара загора") ||
            nameLower.includes("хасково") || nameLower.includes("кърджали") || nameLower.includes("белград") ||
            nameLower.includes("скопие") || nameLower.includes("ниш") || nameLower.includes("прищина") ||
            nameLower.includes("тирана") || nameLower.includes("загреб") || nameLower.includes("подгорица")) {
            return { lat: 42.0 + (idx % 5) * 0.4, lng: 24.0 + (idx % 7) * 0.6 };
        }
        // Западна Европа
        if (nameLower.includes("рим") || nameLower.includes("париж") || nameLower.includes("лондон") ||
            nameLower.includes("ахен") || nameLower.includes("берлин") || nameLower.includes("виена") ||
            nameLower.includes("прага") || nameLower.includes("милано") || nameLower.includes("неапол") ||
            nameLower.includes("марсилия") || nameLower.includes("лион") || nameLower.includes("бордо") ||
            nameLower.includes("кентърбъри") || nameLower.includes("единбург") || nameLower.includes("дъблин") ||
            nameLower.includes("брюксел") || nameLower.includes("кьолн") || nameLower.includes("мюнхен") ||
            nameLower.includes("хамбург") || nameLower.includes("бремен") || nameLower.includes("франкфурт") ||
            nameLower.includes("венеция")) {
            return { lat: 48.0 + (idx % 4) * 0.5, lng: 2.0 + (idx % 6) * 1.2 };
        }
        // Източна Европа, Русия
        if (nameLower.includes("киев") || nameLower.includes("москва") || nameLower.includes("новгород") ||
            nameLower.includes("минск") || nameLower.includes("казан") || nameLower.includes("астрахан") ||
            nameLower.includes("тбилиси") || nameLower.includes("баку") || nameLower.includes("банат") ||
            nameLower.includes("трансилвания") || nameLower.includes("букурещ") || nameLower.includes("яш")) {
            return { lat: 50.0 + (idx % 3) * 0.8, lng: 30.0 + (idx % 5) * 1.5 };
        }
        // Близък изток, Персия, Индия
        if (nameLower.includes("каиро") || nameLower.includes("багдад") || nameLower.includes("техеран") ||
            nameLower.includes("исфахан") || nameLower.includes("шираз") || nameLower.includes("делхи") ||
            nameLower.includes("бомбай") || nameLower.includes("калкута") || nameLower.includes("ланка") ||
            nameLower.includes("мекка") || nameLower.includes("медина") || nameLower.includes("йерусалим") ||
            nameLower.includes("дамаск") || nameLower.includes("антиохия")) {
            return { lat: 32.0 + (idx % 4) * 0.7, lng: 44.0 + (idx % 5) * 1.2 };
        }
        // Африка
        if (nameLower.includes("картаген") || nameLower.includes("тунис") || nameLower.includes("маракеш") ||
            nameLower.includes("тимбукту") || nameLower.includes("гана") || nameLower.includes("мали") ||
            nameLower.includes("абисиния") || nameLower.includes("мерое") || nameLower.includes("нубия") ||
            nameLower.includes("зимбабве") || nameLower.includes("конго") || nameLower.includes("сахара")) {
            return { lat: 15.0 + (idx % 5) * 3.0, lng: 15.0 + (idx % 6) * 4.0 };
        }
        // Фентъзи
        const fantasyKeywords = ["авалон", "атлантида", "му", "лемурия", "хиперборея", "елдърлейн", "мория", "еребор", "мордор", "изенгард", "рохан", "гондор", "ривендъл", "лотлориен", "мирквуд", "дейл", "есгарот", "валинор", "нибелунгайм", "мидгард", "асгард", "ванахейм", "йотунхейм", "алфхайм", "сварталхайм", "настронт", "олимп", "тартар", "елизиум", "хесперид"];
        if (fantasyKeywords.some(kw => nameLower.includes(kw))) {
            return { lat: 55.0 + (idx % 5) * 3.0, lng: 5.0 + (idx % 6) * 4.0 };
        }
        // Останали
        return { lat: 42.5 + (idx % 7) * 1.5, lng: 25.5 + (idx % 9) * 2.0 };
    }

    const regionPoints = regions.map((region, idx) => {
        const coords = getCoords(region.name, idx);
        return { region, lat: coords.lat, lng: coords.lng };
    });

    // Линии
    function distance(lat1, lng1, lat2, lng2) {
        const dx = lat1 - lat2;
        const dy = lng1 - lng2;
        return Math.sqrt(dx*dx + dy*dy);
    }
    const MAX_DIST = 2.5;
    const lines = [];
    for (let i = 0; i < regionPoints.length; i++) {
        for (let j = i+1; j < regionPoints.length; j++) {
            if (distance(regionPoints[i].lat, regionPoints[i].lng, regionPoints[j].lat, regionPoints[j].lng) < MAX_DIST) {
                lines.push([[regionPoints[i].lat, regionPoints[i].lng], [regionPoints[j].lat, regionPoints[j].lng]]);
            }
        }
    }
    lines.forEach(line => {
        L.polyline(line, { color: '#d4af37', weight: 1.5, opacity: 0.4, dashArray: '5, 5' }).addTo(map);
    });

    // Клъстер група
    const markers = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true,
        iconCreateFunction: function(cluster) {
            return L.divIcon({
                html: `<div style="background:#d4af37; color:#000; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-weight:bold; box-shadow:0 0 5px gold;">${cluster.getChildCount()}</div>`,
                className: 'custom-cluster',
                iconSize: L.point(30, 30)
            });
        }
    });

    regionPoints.forEach((rp) => {
        const region = rp.region;
        const { icon, bgColor, borderColor } = getRegionIconAndColor(region);
        
        // Създаваме HTML иконка (кръгла с емоджи)
        const iconHtml = `
            <div style="
                background: ${bgColor};
                width: 34px;
                height: 34px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                border: 2px solid ${borderColor};
                box-shadow: 0 2px 5px rgba(0,0,0,0.5);
                cursor: pointer;
            ">${icon}</div>
        `;
        
        const customIcon = L.divIcon({
            className: 'custom-marker-icon',
            html: iconHtml,
            iconSize: [34, 34],
            popupAnchor: [0, -17]
        });
        
        const marker = L.marker([rp.lat, rp.lng], { icon: customIcon });
        marker.bindTooltip(`<b>${region.name}</b><br>🏰 Сила: ${region.armySize}<br>🛡️ Защита: ${region.defenseLevel}`, { sticky: true });
        marker.on('click', () => {
            if (typeof window.inspectRegion === 'function') window.inspectRegion(region.name);
            else alert(region.name);
        });
        markers.addLayer(marker);

        // Постоянно име (леко под иконката)
        const labelIcon = L.divIcon({
            className: 'region-label',
            html: `<div style="background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 12px; border: 1px solid #d4af37; color: #ffdd99; font-size: 11px; font-family: 'Cinzel', serif; white-space: nowrap;">${region.name}</div>`,
            iconSize: [80, 20],
            iconAnchor: [40, 25]
        });
        const labelMarker = L.marker([rp.lat, rp.lng], { icon: labelIcon, interactive: false });
        markers.addLayer(labelMarker);
    });

    map.addLayer(markers);
    
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

console.log("✅ MapGenerator.js – версия с иконки (🏰👹🏺🏜️)");
