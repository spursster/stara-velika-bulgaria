/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * Синхронизиран с 50 региона, автоматизирана икономика и система за ВЕСТИ.
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
    
    // Начален регион
    window.playerRegions = ["Крим"]; 
    
    window.currentSpouse = null;
    window.playerInventory = [];

    if (window.initDiplomacy) window.initDiplomacy();

    // 2. Първоначална синхронизация със световните данни
    setTimeout(() => {
        if (window.worldData && window.worldData.clans[window.currentHero.dynasty]) {
            window.worldData.clans[window.currentHero.dynasty].regionsOwned = window.playerRegions.length;
            window.worldData.clans[window.currentHero.dynasty].isJoined = true;
        }

        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        // Съобщението при започване влиза в Летописа
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Приветствам Ви, Велики Кане! Вашето управление започва в ${window.playerRegions[0]}. Родът ${window.currentHero.dynasty} очаква Вашите заповеди.`);
        }
    }, 100); 
};

/**
 * ФУНКЦИЯ ЗА СЛУЧАЙНИ СЪБИТИЯ (Обновена за системата Вести)
 */
window.triggerRandomEvent = function() {
    if (!window.eventsDatabase) return;

    // Филтрираме събитията, чиито условия са изпълнени
    const availableEvents = window.eventsDatabase.filter(ev => ev.condition(window.currentHero));

    if (availableEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableEvents.length);
        const selectedEvent = availableEvents[randomIndex];
        
        // ВАЖНО: Добавяме в опашката вместо директно показване
        if (window.eventQueue) {
            window.eventQueue.push(selectedEvent);
            // Опресняваме брояча на бутона
            if (window.updateNotificationBadge) window.updateNotificationBadge();
        }
    }
};

/**
 * ФУНКЦИЯ ЗА ПРИСЪЕДИНЯВАНЕ НА РЕГИОН
 */
window.conquerRegion = function(regionName) {
    const regionData = window.worldData.regions[regionName];
    
    if (!regionData) {
        console.error(`ГРЕШКА: Регион "${regionName}" не съществува в базата данни.`);
        return;
    }

    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        
        regionData.nativeClans.forEach(clanName => {
            if (window.worldData.clans[clanName]) {
                window.worldData.clans[clanName].regionsOwned += 1;
            }
        });

        if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        // Вестта за нова земя влиза в Летописа
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Слава на Кана! Земята ${regionName} вече е под наш контрол.`);
    }
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    // 1. Напредване на времето
    if (window.processTime) window.processTime();
    
    // 2. Изчисляване на икономиката при всеки ход
    if (window.calculateEconomy) window.calculateEconomy();
    
    // 3. Проверка за събития (добавят се в опашката)
    window.triggerRandomEvent();

    // 4. Опресняване на интерфейса и брояча на вестите
    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
    if (window.updateNotificationBadge) window.updateNotificationBadge();
};

// Автоматично стартиране
if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}
