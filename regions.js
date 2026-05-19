/** ==========================================================================
ПРОЕКТ: ВЕЛИКА БЪЛГАРИЯ
ФАЙЛ: regions.js (ОКОНЧАТЕЛНА ВЕРСИЯ – СИГУРЕН БУТОН ЗА АТАКА)
========================================================================== */

window.openRegionsMap = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;
    if (!window.worldData || !window.worldData.regions) {
        console.error("Грешка: Липсват данни за регионите в world_data.js");
        return;
    }
    const regions = window.worldData.regions;
    const regionKeys = Object.keys(regions);
    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];
    let html = `<div style="padding:20px;"><h2 style="color:#ffdd99;">🗺️ Карта на Регионите</h2><div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px,1fr)); gap:12px;">`;
    regionKeys.forEach(key => {
        const reg = regions[key];
        const isPlayerOwned = ownedRegionsFlat.includes(key);
        let controllingClan = "Няма";
        if (reg.nativeClans && reg.nativeClans.length > 0) {
            controllingClan = reg.nativeClans[0];
        }
        const borderStyle = isPlayerOwned ? "2px solid #00ffcc" : "1px solid #c9a87b";
        const bgStyle = isPlayerOwned ? "rgba(0, 255, 204, 0.1)" : "rgba(0,0,0,0.5)";
        html += `<div style="border:${borderStyle}; background:${bgStyle}; border-radius:12px; padding:10px; cursor:pointer;" onclick="window.inspectRegion('${key.replace(/'/g, "\\'")}')">
            <div style="font-size:1.2rem;">🏰 ${key}</div>
            <div style="font-size:0.8rem;">🏴 Клан: ${controllingClan}</div>
            <div style="font-size:0.8rem;">💰 ${reg.resource}</div>
        </div>`;
    });
    html += `</div><button style="margin-top:20px;" onclick="window.showMainMenu ? window.showMainMenu() : location.reload()">Назад към Главното Меню</button></div>`;
    mainArea.innerHTML = html;
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
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: center; z-index: 50000; font-family: 'Cinzel', serif; box-sizing: border-box; padding: 15px;`;

    let actionButtonHTML = '';
    if (isPlayerOwned) {
        actionButtonHTML = `<button class="region-action-btn" style="background:#2c5a2a;" onclick="window.upgradeRegionInfrastructure('${regionName.replace(/'/g, "\\'")}', ${finalUpgradeCost})">🏗️ Модернизирай (${finalUpgradeCost} зл.)</button>`;
    } else {
        // Безопасен бутон за атака – използва data-атрибут
        actionButtonHTML = `<button class="region-action-btn attack-button" style="background:#7a2e1a;" data-region-name="${regionName.replace(/"/g, '&quot;')}">⚔️ ИЗПРАТИ ВОЙСКИ ЗА ЗАВЛАДЯВАНЕ ⚔️</button>`;
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
        <button class="region-action-btn" style="background:#333;" onclick="this.closest('#region-inspect-overlay').remove()">🔒 Затвори</button>
    </div>`;

    // Добавяне на event listener за бутона за атака
    const attackBtn = overlay.querySelector('.attack-button');
    if (attackBtn) {
        attackBtn.addEventListener('click', function(e) {
            const rName = this.getAttribute('data-region-name');
            if (rName && window.startBattle) {
                // Извикваме startBattle с името на региона
                window.startBattle(rName);
            } else {
                console.error("Липсва startBattle или data-region-name");
                alert("Грешка: Бойната система не е заредена.");
            }
            // Затваряме прозореца
            const overlayElem = document.getElementById('region-inspect-overlay');
            if (overlayElem) overlayElem.remove();
        });
    }

    document.body.appendChild(overlay);
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
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🏗️ Инфраструктурата на ${regionName} е модернизирана!`);
        }
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        const overlay = document.getElementById('region-inspect-overlay');
        if (overlay) overlay.remove();
        window.openRegionsMap();
        window.inspectRegion(regionName);
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ Нямате достатъчно злато!");
        }
    }
};
