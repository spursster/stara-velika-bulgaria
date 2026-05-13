/**
 * МОДУЛ: ИНТЕРФЕЙС (Обновен)
 * Визуализира профилите, управлението и времевата линия.
 */

window.updateCharacterUI = function(hero) {
    const charPanel = document.getElementById('character-panel');
    if (!charPanel) return;

    const spouseHTML = window.currentSpouse ? `
        <div class="profile-card" style="text-align: center; width: 120px;">
            <div class="profile-info" style="font-size: 10px; color: #d4af37;">${window.currentSpouse.dynasty}</div>
            <div class="profile-icon" style="background-image: url('assets/queen_icon.png'); border: 2px solid #d4af37; background-color: #1a1a1a; width: 100px; height: 100px; margin: 0 auto; background-size: cover; border-radius: 5px;"></div>
            <div class="profile-name" style="font-size: 14px; margin-top: 5px;">${window.currentSpouse.name}</div>
        </div>
    ` : `
        <div class="profile-card" style="opacity: 0.3; text-align: center; width: 120px;">
            <div class="profile-info" style="font-size: 10px;">Търси се съпруга</div>
            <div class="profile-icon" style="border: 2px dashed #555; width: 100px; height: 100px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 20px;">💍</div>
            <div class="profile-name" style="font-size: 14px; margin-top: 5px;">---</div>
        </div>
    `;

    const kanHTML = `
        <div class="profile-card" style="text-align: center; width: 120px;">
            <div class="profile-info" style="font-size: 10px; color: #d4af37;">${hero.dynasty}</div>
            <div class="profile-icon" style="background-image: url('assets/kan_icon.png'); border: 2px solid #d4af37; background-color: #1a1a1a; width: 100px; height: 100px; margin: 0 auto; background-size: cover; border-radius: 5px;"></div>
            <div class="profile-name" style="font-size: 14px; margin-top: 5px;">Кан ${hero.name}</div>
        </div>
    `;

    charPanel.innerHTML = `
        <div class="profile-container" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
            ${spouseHTML}
            ${kanHTML}
        </div>

        <div id="dynasty-bonus" style="color: #d4af37; font-size: 13px; margin: 15px 0; border-top: 1px solid #333; padding-top: 10px; text-align: center;">
            ✨ БОНУС: ${window.dynastyPerks[hero.dynasty].desc}
        </div>

        <h3 class="section-title" style="font-family: 'Cinzel', serif; border-bottom: 1px solid #333; padding-bottom: 5px; font-size: 16px;">📜 УПРАВЛЕНИЕ</h3>
        <div class="btn-grid" style="display: grid; grid-template-columns: 1fr; gap: 10px;">
            <button class="action-btn btn-turn" onclick="window.advanceTurn()" style="background: #d4af37; color: black; padding: 15px; cursor: pointer; border: none; font-family: 'Cinzel', serif; font-weight: bold; font-size: 16px;">СЛЕДВАЩ ХОД (3 МЕСЕЦА)</button>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px;">
                <button class="action-btn" onclick="window.startBattle()" style="background: #7b1a1a; color: white; border: none; padding: 10px; cursor: pointer; font-size: 12px;">БИТКА</button>
                <button class="action-btn" onclick="window.openMarriageMenu()" style="background: #1a7b3a; color: white; border: none; padding: 10px; cursor: pointer; font-size: 12px;">БРАК</button>
                <button class="action-btn" style="background: #8e44ad; color: white; border: none; padding: 10px; cursor: pointer; font-size: 12px;">РИТУАЛ</button>
            </div>
        </div>
    `;
    
    window.updateRegionsSidebar();
};

window.updateTimeDisplay = function(timeStr, eraStr) {
    const timeElem = document.getElementById('current-time-info');
    if (timeElem) timeElem.innerText = `${timeStr} | ${eraStr}`;
};

window.updateRegionsSidebar = function() {
    const sidebar = document.getElementById('provinces-list');
    if (!sidebar) return;
    sidebar.innerHTML = window.playerRegions.map(reg => `
        <div class="province-slot" style="border: 1px solid #333; background: #0a0a0a; padding: 8px; margin-bottom: 8px; border-left: 3px solid #d4af37;">
            <div style="color: #d4af37; font-weight: bold; font-size: 12px;">${reg}</div>
            <div style="font-size: 10px; color: #888;">Владение на род ${window.currentHero.dynasty}</div>
        </div>
    `).join('');
};
