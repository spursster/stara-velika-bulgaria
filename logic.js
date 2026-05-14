/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */
window.initNewGame = function() {
    // 1. Дефиниране на началните данни
    // Използваме "Кан" като титла в логиката
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
    }, 50); // Изчакване за готовност на DOM
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

    // 4. Обновяване на интерфейса - гарантира визуална точност
    if (window.updateCharacterUI) {
        window.updateCharacterUI(window.currentHero);
    }
};

// Сигурен старт на играта съобразно състоянието на документа
if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}

/**
 * ЛОГИКА ЗА СЛУЧАЙНИ СЪБИТИЯ
 * Избира събитие, чиито условия са изпълнени.
 */
window.triggerRandomEvent = function() {
    if (!window.eventsDatabase || !window.showEventModal) return;

    // Филтрираме само събитията, чиито условия (condition) са изпълнени в момента
    const availableEvents = window.eventsDatabase.filter(ev => ev.condition(window.currentHero));

    if (availableEvents.length > 0) {
        // Избираме случайно едно от наличните събития
        const randomIndex = Math.floor(Math.random() * availableEvents.length);
        const selectedEvent = availableEvents[randomIndex];
        
        // Показваме го на екрана
        window.showEventModal(selectedEvent);
    }
};

/**
 * ФУНКЦИЯ ЗА ПРЕВЗЕМАНЕ НА РЕГИОН
 * Използвайте тази функция, за да сте сигурни, че имената съвпадат и йерархията се обновява.
 */
window.conquerRegion = function(regionName) {
    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        
        // Намираме кой род е местен за този регион и му добавяме мощ
        for (let clanName in window.worldData.clans) {
            const regionData = window.worldData.regions[regionName];
            if (regionData && regionData.nativeClans.includes(clanName)) {
                window.worldData.clans[clanName].regionsOwned += 1;
            }
        }
        
        if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        window.showAdvisorMsg(`Слава, Велики Кане! ${regionName} вече е под Ваша власт.`);
    }
};
