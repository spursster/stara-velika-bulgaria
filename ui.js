// Дефиниция на слотовете според твоята концепция (9 слота)
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

// Основна функция за визуализиране на панела на персонажа
function updateCharacterUI(hero) {
    const uiContainer = document.getElementById('character-panel');
    if (!uiContainer) return;

    // Добавяне на списък с божества в интерфейса
    if (hero.divineUnits.length > 0) {
        let divineHTML = '<h4>🌟 Божествени покровители:</h4><ul>';
        hero.divineUnits.forEach(unit => {
            divineHTML += `<li>${unit.name} (${unit.stats.type}) - Ниво: ${unit.level}</li>`;
        });
        divineHTML += '</ul>';
        uiContainer.innerHTML += divineHTML;
    }

    // Генериране на HTML за инвентара
    let inventoryHTML = '<div class="inventory-grid">';
    
    INVENTORY_SLOTS.forEach(slot => {
        const item = hero.inventory[slot.id];
        inventoryHTML += `
            <div class="inventory-slot" id="slot-${slot.id}" onclick="handleSlotClick('${slot.id}')">
                <span class="slot-label">${slot.label}</span>
                <div class="item-visual">${item ? item.name : 'Празно'}</div>
            </div>
        `;
    });
    
    inventoryHTML += '</div>';

   // Основна функция за визуализиране на панела на персонажа
function updateCharacterUI(hero) {
    const uiContainer = document.getElementById('character-panel');
    if (!uiContainer) return;

    window.currentHero = hero; // Подсигуряваме, че текущият герой е достъпен глобално

    let inventoryHTML = '<div class="inventory-grid">';
    INVENTORY_SLOTS.forEach(slot => {
        const item = hero.inventory[slot.id];
        inventoryHTML += `
            <div class="inventory-slot" id="slot-${slot.id}">
                <span class="slot-label">${slot.label}</span>
                <div class="item-visual">${item ? item.name : '---'}</div>
            </div>
        `;
    });
    inventoryHTML += '</div>';

    uiContainer.innerHTML = `
        <div class="hero-header">
            <h2>${hero.name}</h2>
            <p>Династия: <strong>${hero.dynasty}</strong></p>
            <p>Възраст: ${hero.age} г. / Макс: ${hero.maxAge} г.</p>
            <p>Войска: <strong>${hero.armyRank}</strong> (${hero.armySize} души)</p>
            <p>Ниво: ${hero.level}</p>
        </div>
        
        <div class="inventory-section">
            <h4>🛡️ Инвентар (9 слота)</h4>
            ${inventoryHTML}
        </div>

        <div class="actions-grid">
            <h4>📜 Управление</h4>
            <button onclick="advanceYear(window.currentHero)">⌛ Следваща година</button>
            <button onclick="levelUpCurrentHero()">🏋️ Тренировка</button>
            <button onclick="handleBattleClick()">⚔️ Нападни Ромеите</button>
            <button onclick="handleRitualClick()">🔥 Древен Ритуал</button>
        </div>
    `;

    // Показване на божествата, ако има такива
    if (hero.divineUnits && hero.divineUnits.length > 0) {
        let divineHTML = '<div class="divine-section"><h4>🌟 Божества:</h4><ul>';
        hero.divineUnits.forEach(unit => {
            divineHTML += `<li>${unit.name} - ${unit.stats.type}</li>`;
        });
        divineHTML += '</ul></div>';
        uiContainer.innerHTML += divineHTML;
    }
}

// Помощни функции за бутоните, за да не се обърква кода
function handleBattleClick() {
    if (window.currentHero) {
        window.simulateBattle(window.currentHero, 'Ромеи');
    }
}

function handleRitualClick() {
    if (window.currentHero) {
        const result = window.performAncientRitual(window.currentHero);
        alert(result);
        updateCharacterUI(window.currentHero);
    }
}

// Функция за обработка на клик върху слот
function handleSlotClick(slotId) {
    console.log(`Кликна върху слот: ${slotId}. Тук ще се отваря меню с артефакти.`);
    // Тук по-късно ще добавим логика за избор на предмети
}

// Свързване с глобалния обект за тестване
window.updateCharacterUI = updateCharacterUI;
