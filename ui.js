/**
 * МОДУЛ: ИНТЕРФЕЙС - Велика България
 * Визуализира профилите и поддържа статистиката на файловете.
 */

window.updateCharacterUI = function(hero) {
    const charPanel = document.getElementById('character-panel');
    if (!charPanel) return;

    // Визуализация на съпругата (ако има такава)
    const spouseHTML = window.currentSpouse ? `
        <div style="text-align: center; width: 110px;">
            <div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel', serif;">${window.currentSpouse.dynasty}</div>
            <div style="border: 1px solid #d4af37; background: #111; width: 90px; height: 90px; margin: 0 auto; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 35px;">👸</div>
            <div style="font-size: 13px; margin-top: 5px;">${window.currentSpouse.name}</div>
        </div>
    ` : `
        <div style="opacity: 0.2; text-align: center; width: 110px;">
            <div style="font-size: 10px; font-family: 'Cinzel', serif;">Търси се съпруга</div>
            <div style="border: 1px dashed #444; width: 90px; height: 90px; margin: 0 auto; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 25px;">💍</div>
        </div>
    `;

    // Визуализация на владетеля (Кан)
    const kanHTML = `
        <div style="text-align: center; width: 110px;">
            <div style="font-size: 10px; color: #d4af37; font-family: 'Cinzel', serif;">${hero.dynasty}</div>
            <div style="border: 2px solid #d4af37; background: #111; width: 90px; height: 90px; margin: 0 auto; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 35px;">🏇</div>
            <div style="font-size: 13px; margin-top: 5px;">Кан ${hero.name}</div>
        </div>
    `;

    charPanel.innerHTML = `
        <!-- ПАНЕЛ ДИНАСТИЯ -->
        <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 25px; padding: 15px; background: rgba(212, 175, 55, 0.05); border-radius: 5px; border: 1px solid rgba(212, 175, 55, 0.1);">
            ${spouseHTML}
            ${kanHTML}
        </div>

        <!-- КАЗАРМА (Barracks) -->
        <h3 style="font-family: 'Cinzel', serif; font-size: 15px; border-bottom: 1px solid #333; padding-bottom: 5px; color: #d4af37; margin-top: 0;">⚔️ КАЗАРМА</h3>
        <div style="background: #111; padding: 15px; border: 1px solid #222; border-radius: 5px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                <span>Бойна мощ:</span>
                <b style="color: #ff4d4d;">${hero.heroPower}</b>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px;">
                <span>Численост:</span>
                <b>${hero.armySize} воини</b>
            </div>
            <button onclick="window.buyUnits()" style="width: 100%; background: transparent; color: #d4af37; border: 1px solid #d4af37; padding: 8px; cursor: pointer; font-size: 11px; font-family: 'Cinzel', serif; transition: 0.3s;">ОБУЧЕНИЕ НА ВОЙСКИ</button>
        </div>

        <!-- СТАТИСТИКА -->
        <div style="background: rgba(0,0,0,0.5); padding: 12px; border: 1px solid #1a1a1a; font-size: 12px; border-radius: 4px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>🌟 Престиж на рода:</span>
                <span style="color: #eee;">${hero.xp}</span>
            </div>
        </div>
    `;

    // Синхронизация с горната лента (Header)
    const goldDisplay = document.getElementById('gold-amount');
    const armyDisplay = document.getElementById('army-total');
    
    if (goldDisplay) goldDisplay.innerText = hero.gold;
    if (armyDisplay) armyDisplay.innerText = hero.armySize;

    window.updateRegionsSidebar();
};

window.updateRegionsSidebar = function() {
    const sidebar = document.getElementById('provinces-list');
    if (!sidebar) return;
    
    if (window.playerRegions && window.playerRegions.length > 0) {
        sidebar.innerHTML = window.playerRegions.map(reg => `
            <div style="border: 1px solid #222; background: #050505; padding: 10px; margin-bottom: 8px; border-left: 2px solid #d4af37; font-size: 12px;">
                <b style="color: #d4af37; font-family: 'Cinzel', serif;">${reg}</b>
                <div style="font-size: 10px; color: #555;">Род ${window.currentHero.dynasty}</div>
            </div>
        `).join('');
    } else {
        sidebar.innerHTML = "<div style='font-size: 11px; color: #444;'>Няма открити владения.</div>";
    }
};
