/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */
window.initNewGame = function() {
    // 1. Дефиниране на началните данни
    // Използваме "Кан" като титла в логиката (съгласно инструкциите)
    window.currentHero = {
        name: "Аспарух", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 300,
        heroPower: 100
    };

    // Начало: 480 г. пр.н.е. (Античност)
    window.gameTime = { year: 480, seasonIndex: 0, era: "пр.н.е." };
    window.playerRegions = ["Долна Мизия"];
    window.currentSpouse = null;
    window.playerInventory = [];

    // 2. Инициализираме външните модули
    if (window.initDiplomacy) window.initDiplomacy();

    // 3. Синхронизация с UI и активиране на Съветника
    setTimeout(() => {
        if (window.updateCharacterUI) {
            window.updateCharacterUI(window.currentHero);
        }
        if (window.updateTimeUI) {
            window.updateTimeUI();
        }
        
        // ИНТЕГРАЦИЯ: Съветникът приветства играча вместо обикновен лог
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Приветствам Ви, Велики Кане! Вашето управление над античните земи започва в година 480 пр.н.е. Родът ${window.currentHero.dynasty} очаква Вашите заповеди.`);
        }
        
        if (window.logEvent) {
            window.logEvent(`Кан ${window.currentHero.name} пое властта.`, "royal");
        }
    }, 50);
};

/**
 * ФУНКЦИЯ ЗА СЛЕДВАЩ ХОД - Свързва бутона ⏳ с всички модули
 */
window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Напредване на времето
    if (window.processTime) {
        window.processTime();
    }

    // 2. Икономика и приходи
    if (window.calculateEconomy) {
        window.calculateEconomy();
    }

    // 3. Активиране на събитията
    if (window.triggerRandomEvent) {
        window.triggerRandomEvent();
    }

    // 4. Обновяване на интерфейса
    if (window.updateCharacterUI) {
        window.updateCharacterUI(window.currentHero);
    }
};

// Сигурен старт на играта
if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}
