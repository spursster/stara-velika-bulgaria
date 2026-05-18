/**
 * МОДУЛ: РЕГИОНИ И ГЕОПОЛИТИЧЕСКА КАРТА - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН И СИНХРОНИЗИРАН (Синхронизация на 13-те рода)
 * КОРЕКЦИЯ: Твърдо обвързване с актуалното име "Уния Траки" и премахване на термина "племена".
 * Статистика на файловете в проекта: 16
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

    // Прецизно изравняване на масива за собственост на земите
    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];

    mainArea.innerHTML = `
        <div id="regions-screen" style="padding:20px; background: rgba(5,5,5,0.98); border: 2px solid #d4af37; color: white; font-family: 'Georgia', serif; box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
                <h2 style="color: #d4af37; margin: 0; text-transform: uppercase; letter-spacing: 1px;">🗺️ ГЕОПОЛИТИЧЕСКА КАРТА НА КЛАНОВЕТЕ</h2>
                <button onclick="if(window.showPalaceUI) window.showPalaceUI();" 
                        style="background: #a32a2a; color: white; border: 1px solid #ff4444; padding: 6px 15px; cursor: pointer; font-weight: bold; border-radius: 4px; font-size: 0.8em;">❌ ЗАТВОРИ КАРТАТА</button>
            </div>
            
            <p style="font-size: 0.85em; color: #ccc; margin-bottom: 20px; line-height: 1.5;">
                Управлявайте имперските територии. Изберете регион, за да прегледате местния родов ресурс, трудността за удържане или да инвестирате в инфраструктура.
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; max-height: 450px; overflow-y: auto; padding-right: 5px;">
                ${regionKeys.map(regionName => {
                    const isOwned = ownedRegionsFlat.includes(regionName);
                    const regData = regions[regionName];
                    const nativeClan = (regData.nativeClans && regData.nativeClans[0]) ? regData.nativeClans[0] : "Независим";
                    
                    return `
                        <div onclick="window.inspectRegion('${regionName}')" style="
                            background: ${isOwned ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 255, 255, 0.02)'};
                            border: 1px solid ${isOwned ? '#4caf50' : '#333'};
                            padding: 12px; border-radius: 4px; cursor: pointer; text-align: center;
                            transition: transform 0.2s, border-color 0.2s;
                        " onmouseover="this.style.transform='scale(1.02)'; this.style.borderColor='#d4af37';" onmouseout="this.style.transform='scale(1)'; this.style.borderColor='${isOwned ? '#4caf50' : '#333'}';">
                            <b style="color: #fff; font-size: 0.9em; display: block; margin-bottom: 4px;">${regionName}</b>
                            <span style="font-size: 0.75em; color: #aaa; display: block; margin-bottom: 6px;">🏞️ ${regData.terrain || 'Равнина'}</span>
                            <div style="font-size: 0.75em; font-weight: bold; color: ${isOwned ? '#4caf50' : '#ff9800'}; text-transform: uppercase; letter-spacing: 0.5px;">
                                ${isOwned ? '⚔️ Под Ваш контрол' : `Род: ${nativeClan}`}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="margin-top: 20px; text-align: center; border-top: 1px solid #222; padding-top: 15px;">
                <button onclick="if(window.showPalaceUI) window.showPalaceUI();" 
                        style="background: #222; color: #ccc; border: 1px solid #444; padding: 10px 30px; cursor: pointer; border-radius: 4px; font-size: 0.85em; text-transform: uppercase;">
                    Върни се в двореца
                </button>
            </div>
        </div>
    `;
};

/**
 * ИНСПЕКЦИЯ НА КОНКРЕТЕН РЕГИОН И СТРОИТЕЛСТВО
 */
window.inspectRegion = function(regionName) {
    if (!window.worldData || !window.worldData.regions || !window.worldData.regions[regionName]) return;

    const reg = window.worldData.regions[regionName];
    const hero = window.currentHero;
    if (!hero) return;

    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];
    const isOwned = ownedRegionsFlat.includes(regionName);

    const nativeClan = (reg.nativeClans && reg.nativeClans[0]) ? reg.nativeClans[0] : "Свободен Род";
    const currentInfra = reg.infrastructureLevel || 1;
    const upgradeCost = currentInfra * 250; // Динамична цена за модернизация

    // Изчистване от стари наслагвания, ако има такива
    const oldOverlay = document.getElementById('region-inspect-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'region-inspect-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center;
        z-index: 10000; font-family: 'Georgia', serif; color: white; padding: 15px; box-sizing: border-box;
    `;

    overlay.innerHTML = `
        <div style="background: #0a0a0a; border: 2px solid #d4af37; padding: 25px; border-radius: 6px; max-width: 450px; width: 100%; box-sizing: border-box; position: relative;">
            <div onclick="document.getElementById('region-inspect-overlay').remove()" 
                 style="position: absolute; top: 10px; right: 15px; color: #ff4444; font-weight: bold; cursor: pointer; font-size: 1.2em;">&times;</div>
            
            <h3 style="margin-top: 0; color: #d4af37; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 10px; text-align: center; letter-spacing: 0.5px;">
                🔎 ОГЛЕД: ${regionName}
            </h3>

            <table style="width: 100%; font-size: 0.85em; color: #ccc; margin-bottom: 20px; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #111;"><td style="padding: 6px 0;">⛰️ Терен:</td><td style="text-align: right; color: #fff;">${reg.terrain || 'Равнина'}</td></tr>
                <tr style="border-bottom: 1px solid #111;"><td style="padding: 6px 0;">💎 Родов ресурс:</td><td style="text-align: right; color: #ffd700; font-weight: bold;">${reg.resource || 'Зърно'}</td></tr>
                <tr style="border-bottom: 1px solid #111;"><td style="padding: 6px 0;">🏰 Местен клан:</td><td style="text-align: right; color: #fff;">Род ${nativeClan}</td></tr>
                <tr style="border-bottom: 1px solid #111;"><td style="padding: 6px 0;">🎯 Ниво на отбрана:</td><td style="text-align: right; color: #4caf50;">Ниво ${reg.defenseLevel || 1}</td></tr>
                <tr style="border-bottom: 1px solid #111;"><td style="padding: 6px 0;">🏗️ Инфраструктура:</td><td style="text-align: right; color: #2196f3;">Ниво ${currentInfra}</td></tr>
                <tr><td style="padding: 6px 0;">💀 Трудност за превземане:</td><td style="text-align: right; color: #ff4444;">${reg.difficulty || 10}</td></tr>
            </table>

            <div style="display: flex; gap: 10px; margin-top: 15px;">
                ${isOwned ? `
                    <button onclick="window.upgradeRegionInfrastructure('${regionName}', ${upgradeCost})" style="flex: 2; background: #a32a2a; color: white; border: 1px solid #ff4444; padding: 10px; cursor: pointer; font-weight: bold; font-size: 0.85em; text-transform: uppercase; border-radius: 4px;">
                        🏗️ РАЗШИРИ ИНФРАСТРУКТУРАТА (-${upgradeCost} 💰)
                    </button>
                ` : `
                    <button onclick="document.getElementById('region-inspect-overlay').remove(); if(window.startBattle) window.startBattle({name: '${regionName}', difficulty: ${reg.difficulty || 20}, armySize: ${Math.floor((reg.difficulty || 20) * 5)}});" style="flex: 2; background: #4caf50; color: white; border: 1px solid #81c784; padding: 10px; cursor: pointer; font-weight: bold; font-size: 0.85em; text-transform: uppercase; border-radius: 4px;">
                        ⚔️ ПОВЕДИ ПОХОД ЗА ЗАВЛАДЯВАНЕ
                    </button>
                `}
                <button onclick="document.getElementById('region-inspect-overlay').remove()" style="flex: 1; background: #1b1b1b; color: #ccc; border: 1px solid #333; padding: 10px; cursor: pointer; font-weight: bold; font-size: 0.85em; text-transform: uppercase; border-radius: 4px;">
                    ЗАТВОРИ
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
};

/**
 * НАДГРАЖДАНЕ НА ИНФРАСТРУКТУРАТА ВЪВ ВЛАДЕНИТЕ ЗЕМИ
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
            window.showAdvisorMsg(`🏗️ СТРОЕЖ: Инфраструктурата на регион "${regionName}" бе успешно модернизирана до Ниво ${window.worldData.regions[regionName].infrastructureLevel}! Местните доходи нарастват.`);
        }

        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        
        // Моментално обновяване на интерфейса и картата
        document.getElementById('region-inspect-overlay').remove();
        window.openRegionsMap();
        window.inspectRegion(regionName);

    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("📉 СЪВЕТНИК: В имперската хазна няма достатъчно злато за финансиране на този мащабен строеж!");
        }
    }
};
