const INVENTORY_SLOTS = [
    { id: 'head', label: 'Шлем' }, 
    { id: 'neck', label: 'Амулет' },
    { id: 'body', label: 'Доспехи' }, 
    { id: 'mainHand', label: 'Оръжие' },
    { id: 'offHand', label: 'Щит' }, 
    { id: 'ring1', label: 'Пръстен 1' },
    { id: 'ring2', label: 'Пръстен 2' }, 
    { id: 'feet', label: 'Ботуши' }, 
    { id: 'relic', label: 'Артефакт' }
];

window.updateCharacterUI = function(hero) {
    const uiContainer = document.getElementById('character-panel');
    if (!uiContainer || !hero) return;

    // Добавяне на секция за Казарми
    let barracksHTML = `
        <div class="barracks-section" style="margin-top: 20px; border-top: 1px solid #444; padding-top: 10px;">
            <h4 style="color: #d4af37;">⚔️ Казарми (Наемане на родове)</h4>
            <div style="display: flex; flex-direction: column; gap: 5px;">
                <button onclick="window.handleRecruit('ЛЕКА_ПЕХОТА')" style="font-size: 11px;">Пехота (100🪙)</button>
                <button onclick="window.handleRecruit('КОННИЦА')" style="font-size: 11px;">Конница (300🪙)</button>
                <button onclick="window.handleRecruit('СТРЕЛЦИ')" style="font-size: 11px;">Стрелци (150🪙)</button>
            </div>
        </div>
    `;
    uiContainer.innerHTML += barracksHTML;

    let inventoryHTML = '<div class="inventory-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin: 15px 0;">';
    INVENTORY_SLOTS.forEach(slot => {
        const item = hero.inventory[slot.id];
        inventoryHTML += `
            <div class="inventory-slot" style="background: #333; border: 1px solid #555; height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <span class="slot-label" style="font-size: 9px; color: #aaa; text-transform: uppercase;">${slot.label}</span>
                <div class="item-visual" style="font-size: 11px; color: #fff; font-weight: bold;">${item ? item.name : '---'}</div>
            </div>`;
    });
    inventoryHTML += '</div>';

    uiContainer.innerHTML = `
        <div class="hero-header" style="text-align: center; border-bottom: 1px solid #d4af37; padding-bottom: 10px;">
            <h2 style="color: #d4af37; margin-bottom: 5px;">${hero.name}</h2>
            <p style="margin: 2px 0;">Род: <strong>${hero.dynasty}</strong></p>
            <p style="margin: 2px 0;">Възраст: ${hero.age} г. | Ниво: ${hero.level}</p>
            <p style="margin: 2px 0;">Войска: ${hero.armyRank} (${hero.armySize} души)</p>
        </div>
        
        <div class="inventory-section">
            <h4 style="margin: 15px 0 5px 0; color: #d4af37;">🛡️ Инвентар</h4>
            ${inventoryHTML}
        </div>

        <div class="actions-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
            <button onclick="window.advanceYear(window.currentHero)" style="padding: 10px; cursor: pointer; background: #d4af37; border: none; font-weight: bold;">⌛ Година +1</button>
            <button onclick="window.levelUpCurrentHero()" style="padding: 10px; cursor: pointer; background: #d4af37; border: none; font-weight: bold;">🏋️ Тренировка</button>
            <button onclick="window.handleBattleClick()" style="padding: 10px; cursor: pointer; background: #c0392b; color: white; border: none; font-weight: bold;">⚔️ Битка</button>
            <button onclick="window.handleRitualClick()" style="padding: 10px; cursor: pointer; background: #8e44ad; color: white; border: none; font-weight: bold;">🔥 Ритуал</button>
            <button onclick="window.handleMarriageClick()" style="padding: 10px; cursor: pointer; background: #e67e22; color: white; border: none; font-weight: bold;">💍 Сватба</button>
        </div>
    `;

    // Показване на божествата
    if (hero.divineUnits && hero.divineUnits.length > 0) {
        let divineHTML = '<div style="margin-top: 15px; border: 1px dashed gold; padding: 5px;"><h4>🌟 Божества:</h4><ul style="font-size: 12px; padding-left: 20px;">';
        hero.divineUnits.forEach(unit => {
            divineHTML += `<li>${unit.name} (${unit.stats.type})</li>`;
        });
        divineHTML += '</ul></div>';
        uiContainer.innerHTML += divineHTML;
    }
};

window.levelUpCurrentHero = function() {
    if (window.currentHero) {
        window.currentHero.levelUp();
        window.updateCharacterUI(window.currentHero);
    }
};

window.handleBattleClick = function() {
    if (window.currentHero && typeof window.simulateBattle === 'function') {
        window.simulateBattle(window.currentHero, 'Ромеи');
    }
};

window.handleRitualClick = function() {
    if (window.currentHero && typeof window.performAncientRitual === 'function') {
        const res = window.performAncientRitual(window.currentHero);
        alert(res);
        window.updateCharacterUI(window.currentHero);
    }
};
window.handleMarriageClick = function() {
    if (window.currentHero) {
        window.proposeMarriage(window.currentHero, 'Ромеи'); // За момента тестваме с Ромеите
    }
};
