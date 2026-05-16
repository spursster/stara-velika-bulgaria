/**
 * МОДУЛ: РЕГИОНИ - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (51 региона) - БЕЗПРОБЛЕМНА ИНТЕГРАЦИЯ НА МАСИВИТЕ
 * Управлява визуалното представяване и детайлната информация за териториите.
 * Статистика на файловете в проекта: 16
 */

window.openRegionsMap = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    // Сигурна защита за worldData при първоначално зареждане
    if (!window.worldData || !window.worldData.regions) {
        console.error("Грешка: Липсват данни за регионите в world_data.js");
        return;
    }

    const regions = window.worldData.regions;
    const regionKeys = Object.keys(regions);

    // СИНХРОНИЗАЦИОНЕН МОСТ: Подсигуряваме, че playerRegions се чете правилно дори и ако е вложен масив
    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];

    mainArea.innerHTML = `
        <div id="regions-screen" style="padding:20px; background: rgba(5,5,5,0.98); border: 2px solid #d4af37; color: white; font-family: 'Georgia', serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2 style="color: #d4af37; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 1.3em;">Карта на Родовете</h2>
                <button onclick="document.getElementById('regions-screen').remove()" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:24px; font-weight:bold;">✕</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; max-height: 60vh; overflow-y: auto; padding-right: 5px;">
                ${regionKeys.map(key => {
                    const isOwned = ownedRegionsFlat.includes(key);
                    const reg = regions[key];
                    return `
                        <div onclick="window.inspectRegion('${key}')" style="
                            padding: 12px; 
                            background: ${isOwned ? 'rgba(212,175,55,0.15)' : '#0d0d0d'}; 
                            border: 1px solid ${isOwned ? '#d4af37' : '#222'};
                            cursor: pointer;
                            text-align: center;
                            border-radius: 4px;
                            transition: all 0.2s ease-in-out;
                        " onmouseover="this.style.borderColor='#d4af37'; this.style.background='rgba(212,175,55,0.05)';" onmouseout="this.style.borderColor='${isOwned ? '#d4af37' : '#222'}'; this.style.background='${isOwned ? 'rgba(212,175,55,0.15)' : '#0d0d0d'}';">
                            <div style="font-size: 0.85em; font-weight: bold; color: ${isOwned ? '#d4af37' : '#fff'}; text-transform: uppercase; letter-spacing: 0.5px;">${key}</div>
                            <div style="font-size: 0.7em; color: #aaa; margin-top: 6px; font-style: italic;">${reg.resource || 'Няма'}</div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="margin-top: 20px; padding: 12px; background: #111; border: 1px solid #333; border-radius: 4px; display: flex; justify-content: space-between; font-size: 0.85em;">
                <span>Овладени територии: <b style="color:#d4af37;">${ownedRegionsFlat.length} / 51</b></span>
                <span style="color: #888; font-style: italic;">* Изберете регион за инспекция и действия</span>
            </div>
        </div>
    `;
};

/**
 * ПРЕГЛЕД НА КОНКРЕТЕН РЕГИОН
 */
window.inspectRegion = function(regionName) {
    if (!window.worldData || !window.worldData.regions || !window.worldData.regions[regionName]) return;

    const reg = window.worldData.regions[regionName];
    const ownedRegionsFlat = Array.isArray(window.playerRegions) ? window.playerRegions.flat() : [];
    const isOwned = ownedRegionsFlat.includes(regionName);
    
    // Създаваме информационен прозорец (Modal) на преден план
    const infoOverlay = document.createElement('div');
    infoOverlay.id = 'region-inspect-overlay';
    infoOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.8); z-index: 40000; display: flex;
        align-items: center; justify-content: center; font-family: 'Georgia', serif;
    `;

    infoOverlay.innerHTML = `
        <div style="width: 85%; max-width: 320px; padding: 25px; background: #0a0a0a; border: 2px solid #d4af37; color: white; border-radius: 6px; box-shadow: 0 0 25px rgba(0,0,0,0.95); box-sizing: border-box;">
            <h3 style="color: #d4af37; margin: 0 0 15px 0; border-bottom: 1px solid #333; padding-bottom: 8px; text-align: center; text-transform: uppercase; letter-spacing: 1px;">${regionName}</h3>
            <p style="font-size: 0.9em; margin: 8px 0;"><b style="color: #888;">Терен:</b> ${reg.terrain}</p>
            <p style="font-size: 0.9em; margin: 8px 0;"><b style="color: #888;">Ресурс:</b> <span style="color: #e5c158;">${reg.resource}</span></p>
            <p style="font-size: 0.9em; margin: 8px 0;"><b style="color: #888;">Трудност:</b> ${reg.difficulty}%</p>
            <p style="font-size: 0.9em; margin: 8px 0; line-height: 1.4;"><b style="color: #888;">Местни родове:</b> <span style="color: #ccc;">${Array.isArray(reg.nativeClans) ? reg.nativeClans.join(', ') : 'Няма информация'}</span></p>
            
            <div style="margin-top: 25px; display: flex; gap: 10px;">
                ${!isOwned ? `
                    <button onclick="document.getElementById('region-inspect-overlay').remove(); if(window.startBattle){ window.startBattle('${regionName}'); }" style="flex:1; background:#7b1a1a; color:white; border:1px solid #a32a2a; padding:10px; cursor:pointer; font-weight:bold; font-size:0.85em; text-transform:uppercase; border-radius:4px; transition: background 0.2s;" onmouseover="this.style.background='#992222'" onmouseout="this.style.background='#7b1a1a'">
                        ЗАВЛАДЕЙ
                    </button>
                ` : ''}
                <button onclick="document.getElementById('region-inspect-overlay').remove()" style="flex:1; background:#1b1b1b; color:#ccc; border:1px solid #333; padding:10px; cursor:pointer; font-weight:bold; font-size:0.85em; text-transform:uppercase; border-radius:4px; transition: color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#ccc'">
                    ЗАТВОРИ
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(infoOverlay);
};
