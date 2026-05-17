/**
 * МОДУЛ: РЕГИОНИ - Велика България
 * СТАТУС: НАПЪЛНО НАДГРАДЕН (Инфраструктурна Еволюция и Планетарни Куполи)
 * КОРЕКЦИЯ: Добавена еволюция на изгледа на регионите според Ерата и нивото им, без изрязване на твоя код.
 * Статистика на файловете в проекта: 16
 */

window.openRegionsMap = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    if (!window.worldData || !window.worldData.regions) {
        console.error("Грешка: Липсват данни за регионите in world_data.js");
        return;
    }

    const regions = window.worldData.regions;
    const regionKeys = Object.keys(regions);

    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];

    mainArea.innerHTML = `
        <div id="regions-screen" style="padding:20px; background: rgba(5,5,5,0.98); border: 2px solid #d4af37; color: white; font-family: 'Georgia', serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #d4af37; text-transform: uppercase; letter-spacing: 1px;">🗺️ Карта на Велика България</h2>
                <div style="font-size: 0.9em; color: #aaa;">Контролирани територии: <b style="color: #00ffcc;">${ownedRegionsFlat.length} / ${regionKeys.length}</b></div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; max-height: 70vh; overflow-y: auto; padding-right: 5px;">
                ${regionKeys.map(key => {
                    const reg = regions[key];
                    const isOwned = ownedRegionsFlat.includes(key);
                    const borderStyle = isOwned ? 'border: 1px solid #4caf50; background: rgba(76,175,80,0.03);' : 'border: 1px solid #333; background: rgba(255,255,255,0.01);';
                    const infra = reg.infrastructureLevel || 1;

                    return `
                        <div style="${borderStyle} padding: 12px; border-radius: 4px; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1.0)'">
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                                    <b style="color: ${isOwned ? '#4caf50' : '#fff'}; font-size: 0.95em;">${key}</b>
                                    <span style="font-size: 0.75em; background: #222; padding: 2px 6px; border-radius: 3px; color: #ffd700;">🏠 Лв ${infra}</span>
                                </div>
                                <p style="margin: 4px 0; font-size: 0.8em; color: #aaa;">Гарнизон: <b style="color: #ccc;">${reg.armySize || 0}</b> воини</p>
                                <p style="margin: 4px 0; font-size: 0.8em; color: #aaa;">Трудност: <b style="color: #ff4444;">${reg.difficulty || 10}%</b></p>
                            </div>
                            <button onclick="window.inspectRegion('${key}')" style="margin-top: 10px; width: 100%; background: #222; color: #d4af37; border: 1px solid #d4af37; padding: 6px; cursor: pointer; font-size: 0.8em; font-weight: bold; border-radius: 3px; text-transform: uppercase;">Оглед</button>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
};

window.inspectRegion = function(regionName) {
    if (!window.worldData || !window.worldData.regions || !window.worldData.regions[regionName]) return;
    
    const reg = window.worldData.regions[regionName];
    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];
    const isOwned = ownedRegionsFlat.includes(regionName);
    const infra = reg.infrastructureLevel || 1;

    // ТВОЯТ НАДГРАДЕН ЕПОХАЛЕН АРХИТЕКТУРЕН КЛАС (За прехода към космическо бъдеще)
    let architecturalEra = "Древно родово укрепление (Палисади и Ров)";
    let eraColor = "#d4af37";
    if (infra >= 3 && infra < 5) {
        architecturalEra = "Средновековен каменен заслон (Крепостни кули)";
        eraColor = "#00ffcc";
    } else if (infra >= 5) {
        architecturalEra = "Космически планетарен купол и Космодрум 🚀";
        eraColor = "#ff3366";
    }

    const upgradeCost = infra * 300;

    const overlay = document.createElement('div');
    overlay.id = 'region-inspect-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.85); z-index: 16000; display: flex;
        align-items: center; justify-content: center; font-family: 'Georgia', serif;
    `;

    overlay.innerHTML = `
        <div style="background: #0a0a0a; border: 2px solid #d4af37; width: 90%; max-width: 440px; padding: 25px; border-radius: 6px; color: white; box-shadow: 0 0 30px rgba(0,0,0,0.95);">
            <h3 style="margin-top: 0; color: #d4af37; font-size: 1.2em; border-bottom: 1px solid #333; padding-bottom: 8px; text-transform: uppercase;">🔍 Регион: ${regionName}</h3>
            
            <p style="font-size: 0.9em; margin: 8px 0;"><b style="color: #888;">Статус:</b> ${isOwned ? '<span style="color:#4caf50; font-weight:bold;">Под твой контрол</span>' : '<span style="color:#ff4444;">Незавладян</span>'}</p>
            <p style="font-size: 0.9em; margin: 8px 0;"><b style="color: #888;">Ниво на инфраструктура:</b> <span style="color: #ffd700; font-weight:bold;">${infra}</span></p>
            <p style="font-size: 0.9em; margin: 8px 0;"><b style="color: #888;">Архитектурна ера:</b> <span style="color: ${eraColor}; font-weight:bold;">${architecturalEra}</span></p>
            <p style="font-size: 0.9em; margin: 8px 0;"><b style="color: #888;">Размер на гарнизона:</b> ${reg.armySize} воини</p>
            <p style="font-size: 0.9em; margin: 8px 0;"><b style="color: #888;">Защитна сила:</b> Ранг ${reg.defenseLevel || 1}</p>
            <p style="font-size: 0.9em; margin: 8px 0;"><b style="color: #888;">Трудност:</b> ${reg.difficulty}%</p>
            <p style="font-size: 0.9em; margin: 8px 0; line-height: 1.4;"><b style="color: #888;">Местни родове:</b> <span style="color: #ccc;">${Array.isArray(reg.nativeClans) ? reg.nativeClans.join(', ') : 'Няма информация'}</span></p>
            
            <div style="margin-top: 20px; padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 0.8em; color: #aaa;">
                    <div>Модернизация на региона:</div>
                    <div style="color: #ffd700; font-weight: bold; margin-top: 2px;">Цена: ${upgradeCost} злато 💰</div>
                </div>
                ${isOwned ? `
                    <button onclick="window.upgradeRegionInfrastructure('${regionName}', ${upgradeCost})" style="background: #4caf50; color: white; border: none; padding: 6px 12px; cursor: pointer; font-weight: bold; font-size: 0.8em; border-radius: 3px; text-transform: uppercase;">Надгради</button>
                ` : `<span style="font-size: 0.75em; color: #555; font-style: italic;">Завладейте за строеж</span>`}
            </div>

            <div style="margin-top: 25px; display: flex; gap: 10px;">
                ${!isOwned ? `
                    <button onclick="document.getElementById('region-inspect-overlay').remove(); if(window.startBattle){ window.startBattle(window.worldData.regions['${regionName}']); }" style="flex:1; background:#7b1a1a; color:white; border:1px solid #a32a2a; padding:10px; cursor:pointer; font-weight:bold; font-size:0.85em; text-transform:uppercase; border-radius:4px; transition: background 0.2s;" onmouseover="this.style.background='#992222'" onmouseout="this.style.background='#7b1a1a'">
                        ЗАВЛАДЕЙ
                    </button>
                ` : ''}
                <button onclick="document.getElementById('region-inspect-overlay').remove()" style="flex:1; background:#1b1b1b; color:#ccc; border:1px solid #333; padding:10px; cursor:pointer; font-weight:bold; font-size:0.85em; text-transform:uppercase; border-radius:4px;">
                    ЗАТВОРИ
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
};

/**
 * ИЗПЪЛНЕНИЕ НА СТРОЕЖА И СИНХРОНИЗАЦИЯ С ИКОНОМИКАТА
 */
window.upgradeRegionInfrastructure = function(regionName, cost) {
    const hero = window.currentHero;
    if (!hero) return;

    if (hero.gold >= cost) {
        hero.gold -= cost;
        
        // Вдигаме инфраструктурното ниво в глобалния обект
        if (window.worldData && window.worldData.regions && window.worldData.regions[regionName]) {
            const reg = window.worldData.regions[regionName];
            reg.infrastructureLevel = (reg.infrastructureLevel || 1) + 1;
            reg.defenseLevel = (reg.defenseLevel || 1) + 1; // Автоматично укрепваме и защитата
        }

        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`🏗️ СТРОЕЖ: Регион "${regionName}" бе успешно модернизиран до Ниво ${window.worldData.regions[regionName].infrastructureLevel}! Приходите от тук нарастват.`);
        }

        // Обновяване на UI панелите
        if (window.updateCharacterUI) window.updateCharacterUI(hero);
        
        // Презареждаме прозорците за моментален визуален ефект
        document.getElementById('region-inspect-overlay').remove();
        window.openRegionsMap();
        window.inspectRegion(regionName);

    } else {
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg("❌ НЕДОСТИГ: Нямате достатъчно злато в хазната за този мащабен строеж!");
        }
    }
};
