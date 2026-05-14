/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */
window.initNewGame = function() {
    // 1. Първо дефинираме всички данни (Гръбнакът)
    window.currentHero = {
        name: "Аспарух",
        dynasty: "Дуло",
        gold: 1500,
        armySize: 300,
        heroPower: 100
    };

    window.gameTime = { year: 480, seasonIndex: 0, era: "пр.н.е." };
    window.playerRegions = ["Долна Мизия"];
    window.currentSpouse = null;
    window.playerInventory = [];

    // 2. Инициализираме външните модули
    if (window.initDiplomacy) window.initDiplomacy();

    // 3. ФИКС: Изчакваме 50 милисекунди, за да сме сигурни, че DOM е готов
    setTimeout(() => {
        if (window.updateCharacterUI) {
            window.updateCharacterUI(window.currentHero);
        }
        if (window.updateTimeUI) {
            window.updateTimeUI();
        }
        window.logEvent(`Кан ${window.currentHero.name} започна своето управление в античните земи!`, "royal");
    }, 50);
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

// Използваме по-сигурен начин за стартиране
if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}
