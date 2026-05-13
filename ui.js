window.updateCharacterUI = function(hero) {
    const lang = window.gameLang || 'bg';
    const charPanel = document.getElementById('character-panel');
    const regionsList = document.getElementById('provinces-list');
    
    if (!charPanel || !regionsList) return;

    // 1. Обновяваме регионите в страничния панел
    regionsList.innerHTML = window.playerRegions.map(reg => `
        <div class="province-slot" style="border: 1px solid #d4af37; background: #1a1a1a; margin-bottom: 5px;">
            <div class="province-name" style="font-size: 10px; padding: 4px; color: #d4af37;">${reg}</div>
            <div style="width: 100%; height: 30px; background: #222;"></div> 
        </div>
    `).join('');

    // 2. Обновяваме централния панел (Кан и Бутони)
    charPanel.innerHTML = `
        <h2 style="color: #d4af37;">Кан ${hero.name}</h2>
        <div style="font-size: 30px;">✨</div>
        <p>${hero.armySize} воини</p>

        <h3 class="section-title">📜 УПРАВЛЕНИЕ</h3>
        <div class="btn-grid">
            <button class="action-btn btn-year" onclick="window.advanceYear(window.currentHero)">Година +1</button>
            <button class="action-btn btn-battle" onclick="window.simulateBattle(window.currentHero)">Битка</button>
            <button class="action-btn btn-marriage" onclick="window.proposeMarriage(window.currentHero, 'Ромеи')">Брак</button>
            <button class="action-btn btn-ritual">Ритуал</button>
        </div>

        <h3 class="section-title">⚔️ КАЗАРМА</h3>
        <div style="background: #1a1a1a; border: 1px solid #333; padding: 10px; text-align: left; cursor: pointer;" onclick="window.buyUnits('infantry')">
            🏹 Пехота (100 🪙)
        </div>
    `;
};
