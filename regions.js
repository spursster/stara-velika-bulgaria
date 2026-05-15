/**
 * МОДУЛ: РЕГИОНИ - Велика България
 * СТАТУС: ФИНАЛНА СИНХРОНИЗАЦИЯ (51 региона)
 * Управлява визуалното представяване и детайлната информация за териториите.
 */

window.openRegionsMap = function() {
    const mainArea = document.getElementById('game-main-area');
    if (!mainArea) return;

    // Генерираме списък с всички 51 региона от базата данни
    const regions = window.worldData.regions;
    const regionKeys = Object.keys(regions);

    mainArea.innerHTML = `
        <div id="regions-screen" style="padding:20px; background: rgba(5,5,5,0.95); border: 1px solid #d4af37; color: white;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                <h2 style="color: #d4af37; margin: 0; text-transform: uppercase;">Карта на Родовете</h2>
                <button onclick="document.getElementById('regions-screen').remove()" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:20px;">✕</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; max-height: 65vh; overflow-y: auto; padding-right: 5px;">
                ${regionKeys.map(key => {
                    const isOwned = window.playerRegions.includes(key);
                    const reg = regions[key];
                    return `
                        <div onclick="window.inspectRegion('${key}')" style="
                            padding: 10px; 
                            background: ${isOwned ? 'rgba(212,175,55,0.2)' : '#111'}; 
                            border: 1px solid ${isOwned ? '#d4af37' : '#333'};
                            cursor: pointer;
                            text-align: center;
                            transition: 0.3s;
                        " onmouseover="this.style.borderColor='#d4af37'" onmouseout="this.style.borderColor='${isOwned ? '#d4af37' : '#333'}'">
                            <div style="font-size: 0.85em; font-weight: bold; color: ${isOwned ? '#d4af37' : '#fff'};">${key}</div>
                            <div style="font-size: 0.7em; color: #888; margin-top: 5px;">${reg.resource}</div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div style="margin-top: 20px; padding: 10px; background: #1a1a1a; border-top: 1px solid #444; display: flex; justify-content: space-between; font-size: 0.8em;">
                <span>Овладени територии: <b style="color:#d4af37;">${window.playerRegions.length} / 51</b></span>
                <span style="color: #888;">* Кликнете върху регион за детайли</span>
            </div>
        </div>
    `;
};

/**
 * ПРЕГЛЕД НА КОНКРЕТЕН РЕГИОН
 */
window.inspectRegion = function(regionName) {
    const reg = window.worldData.regions[regionName];
    if (!reg) return;

    const isOwned = window.playerRegions.includes(regionName);
    
    // Създаваме малък информационен прозорец (Tooltip/Modal)
    const infoOverlay = document.createElement('div');
    infoOverlay.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 300px; padding: 20px; background: #0a0a0a; border: 2px solid #d4af37;
        z-index: 30000; color: white; box-shadow: 0 0 20px rgba(0,0,0,1);
    `;

    infoOverlay.innerHTML = `
        <h3 style="color: #d4af37; margin-top: 0; border-bottom: 1px solid #333; padding-bottom: 5px;">${regionName}</h3>
        <p style="font-size: 0.9em;"><b style="color: #aaa;">Терен:</b> ${reg.terrain}</p>
        <p style="font-size: 0.9em;"><b style="color: #aaa;">Ресурс:</b> ${reg.resource}</p>
        <p style="font-size: 0.9em;"><b style="color: #aaa;">Трудност:</b> ${reg.difficulty}%</p>
        <p style="font-size: 0.9em;"><b style="color: #aaa;">Местни родове:</b> ${reg.nativeClans.join(', ')}</p>
        
        <div style="margin-top: 15px; display: flex; gap: 10px;">
            ${!isOwned ? `<button onclick="this.parentElement.parentElement.remove(); window.startBattle()" style="flex:1; background:#7b1a1a; color:white; border:none; padding:8px; cursor:pointer;">ЗАВЛАДЕЙ</button>` : ''}
            <button onclick="this.parentElement.parentElement.remove()" style="flex:1; background:#333; color:white; border:none; padding:8px; cursor:pointer;">ЗАТВОРИ</button>
        </div>
    `;
    document.body.appendChild(infoOverlay);
};
