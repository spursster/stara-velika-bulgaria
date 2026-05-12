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

    // Ако владетелят е починал, показваме менюто за наследници и спираме дотук
    if (!hero.isAlive) {
        window.showSuccessionMenu();
        return;
    }

    // Генериране на инвентар
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

    // Списък с региони
    const regionsList = window.playerRegions ? window.playerRegions.join(", ") : "Няма";

    // Основен интерфейс
    uiContainer.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-bottom: 15px;">
            <h2 style="color: #d4af37; margin: 0;">${hero.name}</h2>
            <small style="color: #ffd700;">Род ${hero.dynasty} | Черта: ${hero.trait || 'Балансиран'}</small>
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
            <button onclick="window.handleRecruit('ЛЕКА_ПЕХОТА')" style="text-align: left; padding: 5px; font-size: 11px; cursor: pointer; background: #333; color: #ccc; border: 1px solid #444;">🏹 Пехота (100🪙)</button>
            <button onclick="window.handleRecruit('КОННИЦА')" style="text-align: left; padding: 5px; font-size: 11px; cursor: pointer; background: #333; color: #ccc; border: 1px solid #444;">🏇 Конница (300🪙)</button>
            <button onclick="window.handleRecruit('СТРЕЛЦИ')" style="text-align: left; padding: 5px; font-size: 11px; cursor: pointer; background: #333; color: #ccc; border: 1px solid #444;">🎯 Стрелци (150🪙)</button>
        </div>
    `;
};

// Функция за показване на менюто за наследници
window.showSuccessionMenu = function() {
    const uiContainer = document.getElementById('character-panel');
    if (!uiContainer || !window.potentialSuccessors) return;

    let successorsHTML = `
        <div style="background: #111; padding: 15px; border: 2px solid #d4af37; border-radius: 8px; margin-top: 10px;">
            <h3 style="color: #d4af37; text-align: center; margin-top: 0;">👑 Наследство</h3>
            <p style="font-size: 11px; text-align: center; color: #ccc;">Владетелят завърши земния си път. Избери кой от синовете му ще поеме тежестта на короната:</p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    window.potentialSuccessors.forEach((s, index) => {
        successorsHTML += `
            <button onclick="window.selectSuccessor(${index})" style="background: #222; color: white; border: 1px solid #d4af37; padding: 10px; cursor: pointer; text-align: left; border-radius: 4px; transition: 0.3s;">
                <strong style="color: #ffd700;">${s.name}</strong><br>
                <small style="color: #aaa;">Черта: ${s.trait}</small>
            </button>
        `;
    });

    successorsHTML += `</div></div>`;
    uiContainer.innerHTML = successorsHTML;
};

// Функция за избор на наследник
window.selectSuccessor = function(index) {
    const chosen = window.potentialSuccessors[index];
    if (window.familyLegacy) chosen.inventory = { ...window.familyLegacy };
    
    window.currentHero = chosen;
    window.updateCharacterUI(chosen);
    
    const log = document.getElementById('event-log');
    if (log) {
        log.innerHTML = `<div style="background: #1e1e1e; border-left: 4px solid #ffd700; padding: 5px; margin-bottom: 10px;">📜 <strong>Нова ера:</strong> ${chosen.name} пое властта. Нека духът на предците го води!</div>` + log.innerHTML;
    }
};

// Други помощни функции
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
        if (log) log.innerHTML = `<p style="color: #ffd700; font-size: 12px;">[Армия] ${msg}</p>` + log.innerHTML;
    }
};

window.handleBattleClick = () => window.simulateBattle(window.currentHero, 'Ромеи');
window.handleMarriageClick = () => window.proposeMarriage(window.currentHero, 'Ромеи');
