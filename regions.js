/** ==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: regions.js (СИГУРНА ВЕРСИЯ – EVENT LISTENER ЗА АТАКА)
========================================================================== */

window.openRegionsMap = function() {
    if (!window.worldData || !window.worldData.regions) {
        console.error("Липсват данни за регионите");
        return;
    }
    const regions = window.worldData.regions;
    const regionKeys = Object.keys(regions);
    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];

    let overlay = document.getElementById('regions-map-overlay');
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = 'regions-map-overlay';
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); backdrop-filter: blur(8px); z-index: 50000; display: flex; justify-content: center; align-items: center; font-family: 'Cinzel', serif; overflow-y: auto; padding: 20px;`;

    let html = `<div style="background: rgba(0,0,0,0.85); border-radius: 32px; border: 1px solid #c9a87b; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 20px;">
        <h2 style="color:#ffdd99; text-align:center;">🗺️ Карта на Регионите</h2>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px,1fr)); gap:12px; margin-top:20px;">`;

    regionKeys.forEach(key => {
        const reg = regions[key];
        const isPlayerOwned = ownedRegionsFlat.includes(key);
        let controllingClan = (reg.nativeClans && reg.nativeClans[0]) || "Независим";
        const borderStyle = isPlayerOwned ? "2px solid #00ffcc" : "1px solid #c9a87b";
        const bgStyle = isPlayerOwned ? "rgba(0, 255, 204, 0.1)" : "rgba(0,0,0,0.5)";

        html += `<div style="border:${borderStyle}; background:${bgStyle}; border-radius:12px; padding:10px; cursor:pointer;" onclick="window.inspectRegion('${key.replace(/'/g, "\\'")}'); document.getElementById('regions-map-overlay').remove();">
            <div style="font-size:1.2rem;">🏰 ${key}</div>
            <div style="font-size:0.8rem;">🏴 ${controllingClan}</div>
            <div style="font-size:0.8rem;">💰 ${reg.resource}</div>
        </div>`;
    });

    html += `</div><button style="display:block; margin:20px auto 0; background:#2c1a0c; border:none; border-bottom:2px solid #a05a2c; padding:8px 24px; border-radius:40px; color:#ffdd99; cursor:pointer;" onclick="this.closest('#regions-map-overlay').remove()">🔒 Затвори Картата</button></div>`;
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
};

window.inspectRegion = function(regionName) {
    if (!window.worldData || !window.worldData.regions || !window.worldData.regions[regionName]) return;
    const reg = window.worldData.regions[regionName];
    const hero = window.currentHero;
    if (!hero) return;
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    const skills = hero.skills || {};
    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];
    const isPlayerOwned = ownedRegionsFlat.includes(regionName);
    let baseUpgradeCost = 500;
    let economyLevel = skills.economy || 0;
    let finalUpgradeCost = Math.max(100, Math.floor(baseUpgradeCost * (1 - (economyLevel * 0.10))));
    let nativeClan = (reg.nativeClans && reg.nativeClans[0]) || "Независим";

    const oldOverlay = document.getElementById('region-inspect-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'region-inspect-overlay';
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: center; z-index: 50001; font-family: 'Cinzel', serif; box-sizing: border-box; padding: 15px;`;

    let actionButtonHTML = '';
    if (isPlayerOwned) {
        actionButtonHTML = `<button id="upgrade-btn" class="region-action-btn" style="background:#2c5a2a;">🏗️ Модернизирай (${finalUpgradeCost} зл.)</button>`;
    } else {
        actionButtonHTML = `<button id="attack-btn" class="region-action-btn" style="background:#7a2e1a;">⚔️ ИЗПРАТИ ВОЙСКИ ЗА ЗАВЛАДЯВАНЕ ⚔️</button>`;
    }

    overlay.innerHTML = `<div style="background: rgba(0,0,0,0.9); border-radius: 32px; padding: 20px; max-width: 450px; width: 100%; text-align: center; border: 1px solid #c9a87b;">
        <h3 style="color:#ffdd99;">🏛️ Инспекция: ${regionName}</h3>
        <p>⛰️ Терен: ${reg.terrain}</p>
        <p>💰 Ресурс: ${reg.resource}</p>
        <p>🏴 Контролиращ Клан: ${nativeClan}</p>
        <p>🛡️ Защита: Ниво ${reg.defenseLevel || 1}</p>
        <p>🏗️ Инфраструктура: Ниво ${reg.infrastructureLevel || 1}</p>
        <p>⚠️ Трудност: ${reg.difficulty}%</p>
        <div style="margin: 20px 0;">${actionButtonHTML}</div>
        <button class="region-action-btn" style="background:#333;" id="close-inspect-btn">🔒 Затвори</button>
    </div>`;

    document.body.appendChild(overlay);

    // Event listener за бутона за атака
    const attackBtn = document.getElementById('attack-btn');
    if (attackBtn) {
        attackBtn.addEventListener('click', function() {
            if (window.startBattle) {
                window.startBattle(regionName);
            } else {
                console.error("startBattle не е дефинирана");
                alert("Бойната система не е заредена!");
            }
            overlay.remove();
        });
    }

    // Event listener за бутона за upgrade
    const upgradeBtn = document.getElementById('upgrade-btn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            window.upgradeRegionInfrastructure(regionName, finalUpgradeCost);
            overlay.remove();
        });
    }

    // Event listener за затваряне
    const closeBtn = document.getElementById('close-inspect-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            overlay.remove();
        });
    }
};

window.upgradeRegionInfrastructure = function(regionName, cost) {
    const hero = window.currentHero;
    if (!hero) return;
    if ((hero.gold || 0) >= cost) {
        hero.gold -= cost;
        if (window.worldData && window.worldData.regions && window.worldData.regions[regionName]) {
            const reg = window.worldData.regions[regionName];
            reg.infrastructureLevel = (reg.infrastructureLevel || 1) + 1;
            reg.defenseLevel = (reg.defenseLevel || 1) + 1;
        }
        if (window.showAdvisorMsg) window.showAdvisorMsg(`🏗️ Инфраструктурата на ${regionName} е модернизирана!`);
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
    } else {
        if (window.showAdvisorMsg) window.showAdvisorMsg("❌ Нямате достатъчно злато!");
    }
};
