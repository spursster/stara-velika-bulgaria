/**
 * МОДУЛ: ИНТЕРФЕЙС
 * Управлява визуалното представяне на Империята.
 */

window.updateCharacterUI = function(hero) {
    const charPanel = document.getElementById('character-panel');
    if (!charPanel) return;

    // Секция за съпругата (ляво)
    const spouseHTML = window.currentSpouse ? `
        <div class="profile-card" style="text-align: center; width: 120px;">
            <div style="font-size: 10px; color: #d4af37;">${window.currentSpouse.dynasty}</div>
            <div style="border: 2px solid #d4af37; background: #1a1a1a; width: 100px; height: 100px; margin: 0 auto; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 40px;">👸</div>
            <div style="font-size: 14px; margin-top: 5px;">${window.currentSpouse.name}</div>
        </div>
    ` : `
        <div class="profile-card" style="opacity: 0.4; text-align: center; width: 120px;">
            <div style="font-size: 10px;">Търси се съпруга</div>
            <div style="border: 2px dashed #444; width: 100px; height: 100px; margin: 0 auto; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 30px;">💍</div>
            <div style="font-size: 14px; margin-top: 5px;">---</div>
        </div>
    `;

    // Секция за Кана (дясно)
    const kanHTML = `
        <div class="profile-card" style="text-align: center; width: 120px;">
            <div style="font-size: 10px; color: #d4af37;">${hero.dynasty}</div>
            <div style="border: 2px solid #d4af37; background: #1a1a1a; width: 100px; height: 100px; margin: 0 auto; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 40px;">🏇</div>
            <div style="font-size: 14px; margin-top: 5px;">Кан ${hero.name}</div>
        </div>
    `;

    charPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; padding: 10px; background: rgba(212, 175, 55, 0.05); border-radius: 10px;">
            ${spouseHTML}
            ${kanHTML}
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
            <button onclick="window.advanceTurn()" style="width: 100%; background: #d4af37; color: black; padding: 15px; cursor: pointer; border: none; font-family: 'Cinzel', serif; font-weight: bold; font-size: 14px; border-radius: 5px; box-shadow: 0 4px 0 #967d28;">СЛЕДВАЩ ХОД (3 МЕСЕЦА)</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
            <button onclick="window.startBattle()" style="background: #7b1a1a; color: white; border: none; padding: 12px; cursor: pointer; font-family: 'Cinzel', serif;">БИТКА</button>
            <button onclick="window.openMarriageMenu()" style="background: #1a7b3a; color: white; border: none; padding: 12px; cursor: pointer; font-family: 'Cinzel', serif;">БРАК</button>
        </div>

        <div id="stats-summary" style="background: #111; padding: 10px; border: 1px solid #333; font-size: 13px;">
            <div style="display: flex; justify-content: space-between;"><span>💰 Злато:</span> <b>${hero.gold}</b></div>
            <div style="display: flex; justify-content: space-between;"><span>⚔️ Войска:</span> <b>${hero.armySize}</b></div>
            <div style="display: flex; justify-content: space-between;"><span>🌟 Опит:</span> <b>${hero.xp}</b></div>
        </div>
    `;

    window.updateRegionsSidebar();
    
    // Обновяваме и златото в хедъра
    const goldElem = document.getElementById('gold-amount');
    const armyElem = document.getElementById('army-total');
    if (goldElem) goldElem.innerText = hero.gold;
    if (armyElem) armyElem.innerText = hero.armySize;
};

window.updateRegionsSidebar = function() {
    const sidebar = document.getElementById('provinces-list');
    if (!sidebar) return;
    sidebar.innerHTML = window.playerRegions.map(reg => `
        <div style="border: 1px solid #333; background: #0a0a0a; padding: 10px; margin-bottom: 8px; border-left: 3px solid #d4af37;">
            <div style="color: #d4af37; font-weight: bold; font-size: 13px;">${reg}</div>
            <div style="font-size: 11px; color: #888;">Род ${window.currentHero.dynasty}</div>
        </div>
    `).join('');
};
