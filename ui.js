/**
 * МОДУЛ: ИНТЕРФЕЙС
 * Визуализира всички компоненти в десния и левия панел.
 */

window.updateCharacterUI = function(hero) {
    const charPanel = document.getElementById('character-panel');
    if (!charPanel) return;

    // Секция за профили
    const spouseHTML = window.currentSpouse ? `
        <div style="text-align: center; width: 120px;">
            <div style="font-size: 10px; color: #d4af37;">${window.currentSpouse.dynasty}</div>
            <div style="border: 2px solid #d4af37; background: #111; width: 100px; height: 100px; margin: 0 auto; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 40px;">👸</div>
            <div style="font-size: 14px; margin-top: 5px;">${window.currentSpouse.name}</div>
        </div>
    ` : `
        <div style="opacity: 0.4; text-align: center; width: 120px;">
            <div style="font-size: 10px;">Търси се съпруга</div>
            <div style="border: 2px dashed #444; width: 100px; height: 100px; margin: 0 auto; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 30px;">💍</div>
            <div style="font-size: 14px; margin-top: 5px;">---</div>
        </div>
    `;

    const kanHTML = `
        <div style="text-align: center; width: 120px;">
            <div style="font-size: 10px; color: #d4af37;">${hero.dynasty}</div>
            <div style="border: 2px solid #d4af37; background: #111; width: 100px; height: 100px; margin: 0 auto; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 40px;">🏇</div>
            <div style="font-size: 14px; margin-top: 5px;">Кан ${hero.name}</div>
        </div>
    `;

    charPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; padding: 10px; background: rgba(212, 175, 55, 0.05); border-radius: 10px;">
            ${spouseHTML}
            ${kanHTML}
        </div>

        <button onclick="window.advanceTurn()" style="width: 100%; background: #d4af37; color: black; padding: 15px; cursor: pointer; border: none; font-family: 'Cinzel', serif; font-weight: bold; margin-bottom: 15px; border-radius: 5px;">СЛЕДВАЩ ХОД (3 МЕСЕЦА)</button>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 25px;">
            <button onclick="window.startBattle()" style="background: #7b1a1a; color: white; border: none; padding: 12px; cursor: pointer; font-family: 'Cinzel', serif;">БИТКА</button>
            <button onclick="window.openMarriageMenu()" style="background: #1a7b3a; color: white; border: none; padding: 12px; cursor: pointer; font-family: 'Cinzel', serif;">БРАК</button>
        </div>

        <h3 style="font-family: 'Cinzel', serif; font-size: 16px; border-bottom: 1px solid #333; padding-bottom: 5px; color: #d4af37;">⚔️ КАЗАРМА</h3>
        <div style="background: #111; padding: 15px; border: 1px solid #333; border-radius: 5px; margin-bottom: 20px;">
            <p>Мощ: <span style="color: #ff4d4d;">${hero.heroPower}</span> | Войска: ${hero.armySize}</p>
            <button onclick="window.buyUnits()" style="width: 100%; background: transparent; color: #d4af37; border: 1px solid #d4af37; padding: 10px; cursor: pointer;">НАЕМАНЕ</button>
        </div>

        <div style="background: #000; padding: 10px; border: 1px solid #222; font-size: 13px;">
            💰 Хазна: ${hero.gold} | 🌟 Престиж: ${hero.xp}
        </div>
    `;

    window.updateRegionsSidebar();
    
    // Горна лента синхронизация
    document.getElementById('gold-amount').innerText = hero.gold;
    document.getElementById('army-total').innerText = hero.armySize;
};

window.updateRegionsSidebar = function() {
    const sidebar = document.getElementById('provinces-list');
    if (!sidebar) return;
    sidebar.innerHTML = window.playerRegions.map(reg => `
        <div style="border: 1px solid #333; background: #0a0a0a; padding: 10px; margin-bottom: 8px; border-left: 3px solid #d4af37;">
            <div style="color: #d4af37; font-weight: bold; font-size: 13px;">${reg}</div>
            <div style="font-size: 11px; color: #666;">Род ${window.currentHero.dynasty}</div>
        </div>
    `).join('');
};
