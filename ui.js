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

    // Попълване на целия панел с информация за владетеля
    uiContainer.innerHTML = `
        <div class="hero-header">
            <h2>${hero.name}</h2>
            <p>Династия: ${hero.dynasty}</p>
            <p>Ранг на войската: <strong>${hero.armyRank}</strong> (${hero.armySize} воини)</p>
            <p>Ниво: ${hero.level}</p>
        </div>
        <hr>
        <h4>Инвентар (Heroes III стил)</h4>
        ${inventoryHTML}
        <div class="actions">
            <button onclick="levelUpCurrentHero()">Тренировка (Level Up)</button>
        </div>
    `;
}

// Функция за обработка на клик върху слот
function handleSlotClick(slotId) {
    console.log(`Кликна върху слот: ${slotId}. Тук ще се отваря меню с артефакти.`);
    // Тук по-късно ще добавим логика за избор на предмети
}

// Свързване с глобалния обект за тестване
window.updateCharacterUI = updateCharacterUI;
