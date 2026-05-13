// Функция за изчертаване на основния интерфейс
window.updateCharacterUI = function(hero) {
    const charPanel = document.getElementById('character-panel');
    if (!charPanel) return;

    // Генериране на HTML за съпругата (ляв профил)
    const spouseHTML = window.currentSpouse ? `
        <div class="profile-card">
            <div class="profile-info">${window.currentSpouse.dynasty}</div>
            <div class="profile-icon" style="background-image: url('assets/queen_icon.png'); border: 2px solid #d4af37; background-color: #1a1a1a; width: 100px; height: 100px; margin: 0 auto; background-size: cover;"></div>
            <div class="profile-name">${window.currentSpouse.name}</div>
        </div>
    ` : `
        <div class="profile-card" style="opacity: 0.3;">
            <div class="profile-info">Търси се съпруга</div>
            <div class="profile-icon" style="border: 2px dashed #555; width: 100px; height: 100px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 20px;">💍</div>
            <div class="profile-name">---</div>
        </div>
    `;

    // Генериране на HTML за Кана (десен профил)
    const kanHTML = `
        <div class="profile-card">
            <div class="profile-info">${hero.years} | ${hero.dynasty}</div>
            <div class="profile-icon" style="background-image: url('assets/kan_icon.png'); border: 2px solid #d4af37; background-color: #1a1a1a; width: 100px; height: 100px; margin: 0 auto; background-size: cover;"></div>
            <div class="profile-name">Кан ${hero.name}</div>
        </div>
    `;

    // Основно съдържание на панела
    charPanel.innerHTML = `
        <div class="profile-container" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
            ${spouseHTML}
            ${kanHTML}
        </div>

        <div id="dynasty-bonus" style="color: #d4af37; font-size: 13px; margin: 15px 0; border-top: 1px solid #333; padding-top: 10px;">
            ✨ БОНУС: ${window.dynastyPerks[hero.dynasty].desc}
        </div>

        <h3 class="section-title">📜 УПРАВЛЕНИЕ</h3>
        <div class="btn-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <button class="action-btn btn-year" onclick="window.advanceYear()" style="background: #333; color: white; padding: 12px; cursor: pointer; border: none; font-family: 'Cinzel', serif;">ГОДИНА +1</button>
            <button class="action-btn btn-battle" onclick="window.startBattle()" style="background: #7b1a1a; color: white; padding: 12px; cursor: pointer; border: none; font-family: 'Cinzel', serif;">БИТКА</button>
            <button class="action-btn btn-marriage" onclick="window.openMarriageMenu()" style="background: #1a7b3a; color: white; padding: 12px; cursor: pointer; border: none; font-family: 'Cinzel', serif;">БРАК</button>
            <button class="action-btn btn-ritual" style="background: #8e44ad; color: white; padding: 12px; cursor: pointer; border: none; font-family: 'Cinzel', serif;">РИТУАЛ</button>
        </div>

        <h3 class="section-title" style="margin-top: 20px;">⚔️ КАЗАРМА</h3>
        <div id="barracks-preview" style="background: #111; border: 1px solid #333; padding: 10px; text-align: left;">
            <p>👥 Армия: ${hero.armySize} воини</p>
            <button onclick="window.buyUnits()" style="width: 100%; background: #d4af37; color: black; border: none; padding: 8px; font-weight: bold; cursor: pointer;">НАЕМИ ВОЙСКА</button>
        </div>
    `;

    // Винаги обновяваме и страничния панел с региони
    window.updateRegionsSidebar();
};

// Функция за обновяване на регионите (Ляв страничен панел)
window.updateRegionsSidebar = function() {
    const sidebar = document.getElementById('provinces-list');
    if (!sidebar) return;

    sidebar.innerHTML = window.playerRegions.map(reg => `
        <div class="province-slot" style="border: 1px solid #d4af37; background: #1a1a1a; padding: 5px; margin-bottom: 8px; font-size: 11px;">
            <div style="color: #d4af37; font-weight: bold;">${reg}</div>
            <div style="font-size: 9px; color: #888;">Владение на род ${window.currentHero.dynasty}</div>
        </div>
    `).join('');
};
