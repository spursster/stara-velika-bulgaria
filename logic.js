/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */
window.initNewGame = function() {
    // Начални данни за Кан-а, съобразени с античността
    window.currentHero = {
        name: "Аспарух",
        dynasty: "Дуло",
        gold: 1500,
        armySize: 300,
        heroPower: 100
    };

    // ФИКС: Синхронизация с датата от index.html
    window.gameTime = { year: 480, seasonIndex: 0, era: "пр.н.е." };
    
    window.playerRegions = ["Долна Мизия"];
    window.currentSpouse = null;
    window.playerInventory = [];

    // Първо зареждаме данните, после UI
    if (window.initDiplomacy) window.initDiplomacy();
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    
    // Обновяване на времето веднага при старт
    if (window.updateTimeUI) window.updateTimeUI();
    
    window.logEvent(`Кан ${window.currentHero.name} започна своето управление в античните земи!`, "royal");
};

/**
 * ФУНКЦИЯ ЗА СЛЕДВАЩ ХОД - Свързва бутона ⏳ с всички модули
 */
window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Напредване на времето (през time.js)
    if (window.processTime) {
        window.processTime();
    }

    // 2. Икономика и приходи (през economy.js)
    if (window.calculateEconomy) {
        window.calculateEconomy();
    }

    // 3. Активиране на събитията (от твоя events.js)
    if (window.triggerRandomEvent) {
        window.triggerRandomEvent();
    }

    // 4. Обновяване на интерфейса (през ui.js)
    if (window.updateCharacterUI) {
        window.updateCharacterUI(window.currentHero);
    }
};

window.onload = () => window.initNewGame();
