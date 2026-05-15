/**
 * МОДУЛ: АРТЕФАКТИ - Велика България
 * СТАТУС: ОБНОВЕН (Добавени легендарни находки от експедиции)
 */

window.playerInventory = [];

// Разширена база данни с артефакти
window.artifactsDatabase = {
    // Родови артефакти
    "sword_of_kubrat": { id: "sword_of_kubrat", name: "Мечът на Кубрат", icon: "🗡️", bonus: { heroPower: 50 }, clan: "Дуло" },
    "scepter_of_philip": { id: "scepter_of_philip", name: "Скиптърът на Филип II", icon: "🔱", bonus: { heroPower: 45 }, clan: "Македони" },
    "decebalus_shield": { id: "decebalus_shield", name: "Щитът на Децебал", icon: "🛡️", bonus: { heroPower: 40 }, clan: "Даки" },
    "thracian_rhyston": { id: "thracian_rhyston", name: "Одриски ритон", icon: "🍷", bonus: { goldBonus: 20 }, clan: "Одриси" },
    
    // ЛЕГЕНДАРНИ НАХОДКИ ОТ СВЕТА (от Expeditions)
    "world_jade_skull": { id: "world_jade_skull", name: "Нефритен череп на Кукулкан", icon: "💀", bonus: { heroPower: 100 }, clan: "Маи" },
    "world_north_sword": { id: "world_north_sword", name: "Меч на Севера", icon: "⚔️", bonus: { heroPower: 70 }, clan: "Викинги" },
    "world_ra_eye": { id: "world_ra_eye", name: "Окото на Ра", icon: "👁️", bonus: { goldBonus: 50 }, clan: "Египет" },
    "world_dragon_seal": { id: "world_dragon_seal", name: "Китайски драконов печат", icon: "🐉", bonus: { heroPower: 80 }, clan: "Хан" }
};

/**
 * ФУНКЦИЯ ЗА ДОБАВЯНЕ НА ПРЕДМЕТ В ХАЗНАТА
 * Използва се директно от expeditions.js
 */
window.addItemToTreasury = function(itemName) {
    // Търсим дали предметът съществува в базата данни по име
    let artifactKey = Object.keys(window.artifactsDatabase).find(key => 
        window.artifactsDatabase[key].name === itemName
    );

    let itemData;

    if (artifactKey) {
        itemData = window.artifactsDatabase[artifactKey];
    } else {
        // Ако предметът е нов/генериран динамично, създаваме временен обект
        itemData = {
            id: "gen_" + Date.now(),
            name: itemName,
            icon: "🏺",
            bonus: { heroPower: 20 },
            clan: "Неизвестен"
        };
    }

    // Проверка за дубликати
    if (window.playerInventory.find(i => i.name === itemData.name)) return;

    window.playerInventory.push(itemData);
    
    // Прилагане на бонусите
    if (itemData.bonus.heroPower) {
        window.currentHero.heroPower += itemData.bonus.heroPower;
    }

    if (window.logEvent) {
        window.logEvent(`В съкровищницата е поставен нов артефакт: ${itemData.name}!`, "royal");
    }

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    
    // Ако решетката на съкровищницата е отворена, я опресняваме
    if (window.renderTreasury) window.renderTreasury();
};

window.renderTreasury = function() {
    const grid = document.getElementById('treasury-grid');
    if (!grid) return;

    grid.innerHTML = "";
    window.playerInventory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = `
            background: #1a1a1a;
            border: 1px solid #d4af37;
            padding: 10px;
            text-align: center;
            border-radius: 4px;
            position: relative;
        `;
        itemDiv.innerHTML = `
            <div style="font-size: 30px; margin-bottom: 5px;">${item.icon}</div>
            <div style="font-size: 9px; color: #d4af37; font-family: 'Cinzel';">${item.name}</div>
            <div style="font-size: 8px; color: #aaa;">${item.clan}</div>
        `;
        grid.appendChild(itemDiv);
    });
};

window.toggleTreasury = function() {
    const overlay = document.getElementById('treasury-overlay');
    if (overlay) {
        const isOpening = overlay.style.display === 'none';
        overlay.style.display = isOpening ? 'block' : 'none';
        if (isOpening) window.renderTreasury();
    }
};
