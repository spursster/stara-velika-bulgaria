const INVENTORY_SLOTS = [
    { id: 'head', label: 'Шлем' }, { id: 'neck', label: 'Амулет' },
    { id: 'body', label: 'Доспехи' }, { id: 'mainHand', label: 'Оръжие' },
    { id: 'offHand', label: 'Щит' }, { id: 'ring1', label: 'Пръстен 1' },
    { id: 'ring2', label: 'Пръстен 2' }, { id: 'feet', label: 'Ботуши' },
    { id: 'relic', label: 'Артефакт' }
];

window.updateCharacterUI = function(hero) {
    const uiContainer = document.getElementById('character-panel');
    if (!uiContainer || !hero) return;

    let inventoryHTML = '<div class="inventory-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin: 10px 0;">';
    INVENTORY_SLOTS.forEach(slot => {
        const item = hero.inventory[slot.id];
        inventoryHTML += `
            <div class="inventory-slot" style="background: #111; border: 1px solid #444; height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 10px;">
                <span style="color: #777;">${slot.label}</span>
                <div style="color: #d4af37; font-weight: bold;">${item ? item.name : '---'}</div>
            </div>`;
    });
    inventoryHTML += '</div>';

    // Показване на владените региони
    const regionsList = window.playerRegions ? window.playerRegions.join(", ") : "Няма";

    uiContainer.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-bottom: 15px;">
            <h2 style="color: #d4af37; margin: 0;">${hero.name}</h2>
            <small>Род ${hero.dynasty}</small>
            <p style="margin: 5px 0;">Възраст: ${hero.age} г. | Ниво: ${hero.level}</p>
            <p style="margin: 5px 0; color: #aaa;">${hero.armyRank} (${hero.armySize} бойци)</p>
            <p style="margin: 5px 0; font-size: 12px; color: #2ecc71; font-weight: bold;">🚩 Земи: ${regionsList}</p>
        </div>

        <h4 style="color: #d4af37; margin: 10px 0 5px 0;">🛡️ ИНВЕНТАР</h4>
        ${inventoryHTML}

        <h4 style="color: #d4af37; margin: 15px 0 5px 0;">📜 УПРАВЛЕНИЕ</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <button onclick="window.advanceYear(window.currentHero)" style="background: #444; color: white; border: none; padding: 8px; cursor: pointer;">⌛ Година +1</button>
            <button onclick="window.levelUpCurrentHero()" style="background: #444; color: white; border: none; padding: 8px; cursor: pointer;">🏋️ Тренировка</button>
            <button onclick="window.handleBattleClick()" style="background: #721c24; color: white; border: none; padding: 8px; cursor: pointer;">⚔️ Битка</button>
            <button onclick="window.handleMarriageClick()" style="background: #1e7e34; color: white; border: none; padding: 8px; cursor: pointer;">💍 Брак</button>
        </div>

        <h4 style="color: #d4af37; margin: 20px 0 5px 0;">⚔️ КАЗАРМИ</h4>
        <div style="display: flex; flex-direction: column; gap: 5px; background: #1a1a1a; padding: 10px; border-radius: 5px;">
            <button onclick="window.handleRecruit('ЛЕКА_ПЕХОТА')" style="text-align: left; padding: 5px; font-size: 11px; cursor: pointer;">🏹 Пехота (100🪙)</button>
            <button onclick="window.handleRecruit('КОННИЦА')" style="text-align: left; padding: 5px; font-size: 11px; cursor: pointer;">🏇 Конница (300🪙)</button>
            <button onclick="window.handleRecruit('СТРЕЛЦИ')" style="text-align: left; padding: 5px; font-size: 11px; cursor: pointer;">🎯 Стрелци (150🪙)</button>
        </div>
    `;
};

window.levelUpCurrentHero = function() {
    if (window.currentHero) {
        window.currentHero.levelUp();
        window.updateCharacterUI(window.currentHero);
    }
};

window.handleRecruit = function(type) {
    if (window.currentHero && typeof window.recruitUnit === 'function') {
        const msg = window.recruitUnit(window.currentHero, type);
        const log = document.getElementById('event-log');
        if (log) log.innerHTML = `<p style="color: #ffd700;">[Армия] ${msg}</p>` + log.innerHTML;
    }
};

window.handleBattleClick = () => window.simulateBattle(window.currentHero, 'Ромеи');
window.handleMarriageClick = () => window.proposeMarriage(window.currentHero, 'Ромеи');
