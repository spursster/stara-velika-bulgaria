/**
МОДУЛ: РЕГИОНИ И ГЕОПОЛИТИЧЕСКА КАРТА - Велика България
СТАТУС: НАПЪЛНО СИНХРОНИЗИРАН И БЕЗ ГРЕШКИ
КОРЕКЦИЯ: Поправени счупени HTML стрингове, оператори и имена на променливи.
*/
window.openRegionsMap = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;
    if (!window.worldData || !window.worldData.regions) {
        console.error("Грешка: Липсват данни за регионите в world_data.js");
        return;
    }

    const regions = window.worldData.regions;
    const regionKeys = Object.keys(regions);

    // Изравняване на масива за собственост на земите от играча
    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];

    mainArea.innerHTML = `
        <div id="regions-screen" style="padding:20px; background: rgba(5,5,5,0.98); border: 2px solid #d4af37; color: white; font-family: 'Cinzel', serif; box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="margin:0; color:#ffd700; text-transform:uppercase; font-size:1.3em;">Карта на Регионите</h2>
                <span style="font-size:11px; color:#aaa;">Кликнете на регион за инспекция или атака</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; max-height: 400px; overflow-y: auto; padding-right: 5px;">
                ${regionKeys.map(key => {
                    const reg = regions[key];
                    const isPlayerOwned = ownedRegionsFlat.includes(key);
                    
                    // Намиране на текущия контролиращ клан
                    let controllingClan = "Няма";
                    if (reg.nativeClans && reg.nativeClans.length > 0) {
                        controllingClan = reg.nativeClans[0];
                    }

                    let borderStyle = isPlayerOwned ? "2px solid #00ffcc" : "1px solid #333";
                    let bgStyle = isPlayerOwned ? "rgba(0, 255, 204, 0.05)" : "rgba(0,0,0,0.4)";

                    return `
                        <div onclick="window.inspectRegion('${key}')" style="background: ${bgStyle}; border: ${borderStyle}; padding: 10px; border-radius: 6px; cursor: pointer; text-align: center; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
                            <div style="font-size: 1.4em; margin-bottom: 4px;">️</div>
                            <strong style="color: #ffd700; font-size: 12px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${key}</strong>
                            <div style="font-size: 10px; color: #888; margin-top: 3px;">Клан: ${controllingClan}</div>
                            <div style="font-size: 9px; color: #aaa; margin-top: 2px;">💎 ${reg.resource}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <button class="menu-btn" onclick="if(window.backToMainMenu) window.backToMainMenu();" style="width: 100%; margin-top: 15px;">Назад към Главното Меню</button>
        </div>
    `;
};

/**
ИНСПЕКЦИЯ И ДЕЙСТВИЯ ЗА КОНКРЕТЕН РЕГИОН
*/
window.inspectRegion = function(regionName) {
    if (!window.worldData || !window.worldData.regions || !window.worldData.regions[regionName]) return;
    const reg = window.worldData.regions[regionName];
    const hero = window.currentHero;
    if (!hero) return;

    // Инициализация на RPG пасивите за сигурност
    if (window.initializeHeroRPGData) window.initializeHeroRPGData(hero);
    let skills = hero.skills || {};
    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];
    const isPlayerOwned = ownedRegionsFlat.includes(regionName);

    // Изчисляване на цената за подобрение с отстъпка от Diablo умението за Икономика
    let baseUpgradeCost = 500;
    let economyLevel = skills.economy || 0;
    let finalUpgradeCost = Math.max(100, Math.floor(baseUpgradeCost * (1 - (economyLevel * 0.10))));
    let nativeClan = (reg.nativeClans && reg.nativeClans[0]) || "Независим";

    // Премахване на стар инспекционен прозорец, ако съществува
    const oldOverlay = document.getElementById('region-inspect-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'region-inspect-overlay';
    overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: center; z-index: 50000; font-family: 'Cinzel', serif; box-sizing: border-box; padding: 15px;`;

    let actionButtonHTML = '';
    if (isPlayerOwned) {
        actionButtonHTML = `
            <button onclick="window.upgradeRegionInfrastructure('${regionName}', ${finalUpgradeCost})" style="width: 100%; background: #00ffcc; color: #000; border: none; padding: 12px; font-weight: bold; cursor: pointer; text-transform: uppercase; border-radius: 4px; font-size: 0.85em; margin-bottom: 10px;">
                🏗️ Модернизирай Инфраструктура (${finalUpgradeCost} зл.)
            </button>
        `;
    } else {
        actionButtonHTML = `
            <button onclick="document.getElementById('region-inspect-overlay').remove(); if(window.startBattle) window.startBattle('${regionName}');" style="width: 100%; background: #ff3366; color: #fff; border: none; padding: 12px; font-weight: bold; cursor: pointer; text-transform: uppercase; border-radius: 4px; font-size: 0.85em; margin-bottom: 10px;">
                ️ Изпрати Войски за Завладяване
            </button>
        `;
    }

    overlay.innerHTML = `
        <div style="background: #0a0a0a; border: 2px solid #d4af37; width: 100%; max-width: 380px; border-radius: 8px; padding: 20px; color: white; box-sizing: border-box;">
            <h3 style="margin-top: 0; color: #ffd700; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 10px; text-align: center;">
                Инспекция: ${regionName}
            </h3>
            <div style="font-size: 11px; color: #ccc; line-height: 1.8; margin-bottom: 20px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 4px;">
                <div>⛰️ Терен: <strong>${reg.terrain}</strong></div>
                <div>💎 Ресурс: <strong>${reg.resource}</strong></div>
                <div>🚩 Контролиращ Клан: <strong>${nativeClan}</strong></div>
                <div>🛡️ Ниво на Защита: <strong>Ниво ${reg.defenseLevel || 1}</strong></div>
                <div>️ Инфраструктура: <strong>Ниво ${reg.infrastructureLevel || 1}</strong></div>
                <div>💀 Трудност на Терена: <strong>${reg.difficulty}%</strong></div>
            </div>

            ${actionButtonHTML}

            <button onclick="document.getElementById('region-inspect-overlay').remove()" style="width: 100%; background: #222; color: #fff; border: 1px solid #444; padding: 10px; cursor: pointer; font-size: 0.8em; text-transform: uppercase; border-radius: 4px;">
                Затвори
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
};

/**
НАДГРАЖДАНЕ НА ИНФРАСТРУКТУРАТА ВЪВ ВЛАДЕНИТЕ ЗЕМИ
*/
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
            window.showAdvisorMsg(`️ СТРОЕЖ: Инфраструктурата на регион "${regionName}" бе успешно модернизирана! Нивото на защита се повиши.`);
        }

        if (window.updateCharacterUI) window.updateCharacterUI(hero);

        // Моментално обновяване на интерфейса и преначертаване
        const overlay = document.getElementById('region-inspect-overlay');
        if (overlay) overlay.remove();

        window.openRegionsMap();
        window.inspectRegion(regionName);
    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато за извършване на тези строителни дейности!");
        }
    }
};
