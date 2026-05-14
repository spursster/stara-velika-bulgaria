/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * Синхронизиран с 50 региона и автоматизирана икономика.
 */
window.initNewGame = function() {
    // 1. Дефиниране на началните данни за Кана
    window.currentHero = {
        name: "Кубрат", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 500,
        heroPower: 150
    };

    window.gameTime = { year: 632, seasonIndex: 0, era: "от н.е." };
    
    // ВАЖНО: Започваме от Крим, който съществува в world_data.js
    window.playerRegions = ["Крим"]; 
    
    window.currentSpouse = null;
    window.playerInventory = [];

    if (window.initDiplomacy) window.initDiplomacy();

    // 2. Първоначална синхронизация със световните данни
    setTimeout(() => {
        if (window.worldData && window.worldData.clans[window.currentHero.dynasty]) {
            // Родът Дуло получава контрол над началния регион
            window.worldData.clans[window.currentHero.dynasty].regionsOwned = window.playerRegions.length;
            window.worldData.clans[window.currentHero.dynasty].isJoined = true;
        }

        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Приветствам Ви, Велики Кане! Вашето управление започва в ${window.playerRegions[0]}. Родът ${window.currentHero.dynasty} очаква Вашите заповеди.`);
        }
    }, 100); 
};

/**
 * ФУНКЦИЯ ЗА СЛУЧАЙНИ СЪБИТИЯ
 */
window.triggerRandomEvent = function() {
    if (!window.eventsDatabase || !window.showEventModal) return;

    // Филтрираме събитията, чиито условия са изпълнени
    const availableEvents = window.eventsDatabase.filter(ev => ev.condition(window.currentHero));

    if (availableEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableEvents.length);
        window.showEventModal(availableEvents[randomIndex]);
    }
};

/**
 * ФУНКЦИЯ ЗА ПРИСЪЕДИНЯВАНЕ НА РЕГИОН
 */
window.conquerRegion = function(regionName) {
    // Вземаме данните от обекта worldData
    const regionData = window.worldData.regions[regionName];
    
    if (!regionData) {
        console.error(`ГРЕШКА: Регион "${regionName}" не съществува в базата данни.`);
        return;
    }

    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        
        // Увеличаваме влиянието на местните родове
        regionData.nativeClans.forEach(clanName => {
            if (window.worldData.clans[clanName]) {
                window.worldData.clans[clanName].regionsOwned += 1;
            }
        });

        if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Слава на Кана! Земята ${regionName} вече е под наш контрол.`);
    }
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Напредване на времето
    if (window.processTime) window.processTime();
    
    // 2. Изчисляване на икономиката при всеки ход
    if (window.calculateEconomy) window.calculateEconomy();
    
    // 3. Проверка за събития (лидери и дипломация)
    window.triggerRandomEvent();

    // 4. Опресняване на интерфейса
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

// Автоматично стартиране
if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}
