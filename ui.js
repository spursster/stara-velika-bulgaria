/**
 * МОДУЛ: ИНТЕРФЕЙС
 * Управлява визуалното представяне на Империята, включително семейния профил и казармата.
 */

window.updateCharacterUI = function(hero) {
    const charPanel = document.getElementById('character-panel');
    if (!charPanel) return;

    // 1. Секция за съпругата (ляво)
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

    // 2. Секция за Кана (дясно)
    const kanHTML = `
        <div class="profile-card" style="text-align: center; width: 120px;">
            <div style="font-size: 10px; color: #d4af37;">${hero.dynasty}</div>
            <div style="border: 2px solid #d4af37; background: #1a1a1a; width: 100px; height: 100px; margin: 0 auto; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 40px;">🏇</div>
            <div style="font-size: 14px; margin-top: 5px;">Кан ${hero.name}</div>
        </div>
    `;

    // 3. Основно съдържание на панела
    charPanel.innerHTML = `
        <!-- СЕМЕЕН ПРОФИЛ -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; padding: 10px; background: rgba(212, 175, 55, 0.05); border-radius: 10px;">
            ${spouseHTML}
            ${kanHTML}
        </div>

        <!-- УПРАВЛЕНИЕ -->
        <div style="text-align: center; margin-bottom: 20px;">
            <button onclick="window.advanceTurn()" style="width: 100%; background: #d4af37; color: black; padding: 15px; cursor: pointer; border: none; font-family: 'Cinzel', serif; font-weight: bold; font-size: 14px; border-radius: 5px; box-shadow: 0 4px 0 #967d28;">СЛЕДВАЩ ХОД (3 МЕСЕЦА)</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
            <button onclick="window.startBattle()" style="background: #7b1a1a; color: white; border: none; padding: 12px; cursor: pointer; font-family: 'Cinzel', serif; border-radius: 3px;">БИТКА</button>
            <button onclick="window.openMarriageMenu()" style="background: #1a7b3a; color: white; border: none; padding: 12px; cursor: pointer; font-family: 'Cinzel', serif; border-radius: 3px;">БРАК</button>
        </div>

        <!-- КАЗАРМА (ВЪЗСТАНОВЕНА) -->
        <h3 style="font-family: 'Cinzel', serif; font-size: 16px; border-bottom: 1px solid #333; padding-bottom: 5px; color: #d4af37;">⚔️ КАЗАРМА</h3>
        <div id="barracks-ui" style="background: #111; padding: 15px; border: 1px solid #333; border-radius: 5px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Обща мощ:</span>
                <span style="color: #ff4d4d; font-weight: bold;">${hero.heroPower}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span>Численост:</span>
                <span style="color: #eee;">${hero.armySize} воини</span>
            </div>
            <button onclick="window.buyUnits()" style="width: 100%; background: transparent; color: #d4af37; border: 1px solid #d4af37; padding: 10px; cursor: pointer; font-size: 12px; transition: 0.3s;">НАЕМАНЕ НА ВОЙСКИ</button>
        </div>

        <!-- СТАТИСТИКА -->
        <div id="stats-summary" style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 5px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="color: #888;">💰 Хазна:</span>
                <span style="color: #ffd700;">${hero.gold}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #888;">🌟 Престиж:</span>
                <span>${hero.xp}</span>
            </div>
        </div>
    `;

    // Обновяваме списъка с провинции в левия панел
    window.updateRegionsSidebar();
    
    // Синхронизираме данните в горната лента (Top Bar)
    const goldElem = document.getElementById('gold-amount');
    const armyElem = document.getElementById('army-total');
    if (goldElem) goldElem.innerText = hero.gold;
    if (armyElem) armyElem.innerText = hero.armySize;
};

window.updateRegionsSidebar = function() {
    const sidebar = document.getElementById('provinces-list');
    if (!sidebar) return;
    sidebar.innerHTML = window.playerRegions.map(reg => `
        <div style="border: 1px solid #333; background: #0a0a0a; padding: 10px; margin-bottom: 8px; border-left: 3px solid #d4af37; border-radius: 2px;">
            <div style="color: #d4af37; font-weight: bold; font-size: 13px;">${reg}</div>
            <div style="font-size: 11px; color: #666;">Владение на род ${window.currentHero.dynasty}</div>
        </div>
    `).join('');
};
