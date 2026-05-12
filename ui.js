const INVENTORY_SLOTS = [
    { id: 'head', label: 'Шлем' }, { id: 'neck', label: 'Амулет' },
    { id: 'body', label: 'Доспехи' }, { id: 'mainHand', label: 'Оръжие' },
    { id: 'offHand', label: 'Щит' }, { id: 'ring1', label: 'Пръстен 1' },
    { id: 'ring2', label: 'Пръстен 2' }, { id: 'feet', label: 'Ботуши' },
    { id: 'relic', label: 'Артефакт' }
];

function updateCharacterUI(hero) {
    const uiContainer = document.getElementById('character-panel');
    if (!uiContainer || !hero) return;

    let inventoryHTML = '<div class="inventory-grid">';
    INVENTORY_SLOTS.forEach(slot => {
        const item = hero.inventory[slot.id];
        inventoryHTML += `
            <div class="inventory-slot">
                <span class="slot-label">${slot.label}</span>
                <div class="item-visual">${item ? item.name : '---'}</div>
            </div>`;
    });
    inventoryHTML += '</div>';

    uiContainer.innerHTML = `
        <div class="hero-header">
            <h2>${hero.name}</h2>
            <p>Династия: ${hero.dynasty}</p>
            <p>Възраст: ${hero.age} г. | Ниво: ${hero.level}</p>
            <p>Войска: ${hero.armyRank} (${hero.armySize} души)</p>
        </div>
        ${inventoryHTML}
        <div class="actions-grid">
            <button onclick="window.advanceYear(window.currentHero)">⌛ Година +1</button>
            <button onclick="window.levelUpCurrentHero()">🏋️ Тренировка</button>
            <button onclick="window.handleBattleClick()">⚔️ Битка (Ромеи)</button>
            <button onclick="window.handleRitualClick()">🔥 Ритуал</button>
        </div>`;
}

window.handleBattleClick = () => window.simulateBattle(window.currentHero, 'Ромеи');
window.handleRitualClick = () => {
    alert(window.performAncientRitual(window.currentHero));
    updateCharacterUI(window.currentHero);
};
window.levelUpCurrentHero = () => {
    window.currentHero.levelUp();
    updateCharacterUI(window.currentHero);
};
window.updateCharacterUI = updateCharacterUI;
