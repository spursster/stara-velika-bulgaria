/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 * Синхронизиран със Стъпка 2: 50 региона и автоматично разширение.
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
    
    // ВАЖНО: Вече започваме от центъра на Стара Велика България
    window.playerRegions = ["Стара Велика България"]; 
    
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

    const availableEvents = window.eventsDatabase.filter(ev => ev.condition(window.currentHero));

    if (availableEvents.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableEvents.length);
        window.showEventModal(availableEvents[randomIndex]);
    }
};

/**
 * ФУНКЦИЯ ЗА ПРИСЪЕДИНЯВАНЕ НА РЕГИОН
 * Вече напълно синхронизирана с 50-те региона в world_data.js
 */
window.conquerRegion = function(regionName) {
    const regionData = window.worldData.regions[regionName];
    
    if (!regionData) {
        console.error(`ГРЕШКА: Регион "${regionName}" не съществува в базата данни.`);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Кан ${window.currentHero.name}, нашите карти не познават земя на име ${regionName}. Проверете името в списъка с региони.`);
        return;
    }

    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        
        // Увеличаваме влиянието на родовете, които са местни за тази земя
        regionData.nativeClans.forEach(clanName => {
            if (window.worldData.clans[clanName]) {
                window.worldData.clans[clanName].regionsOwned += 1;
                console.log(`Родът ${clanName} засилва влиянието си в Обединението.`);
            }
        });

        // Преизчисляваме кой род е най-силен след новата придобивка
        if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Слава на Кана! Земята ${regionName} вече е част от нашите владения.`);
    }
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    if (window.processTime) window.processTime();
    if (window.calculateEconomy) window.calculateEconomy();
    
    // Проверка за събития при всеки ход
    window.triggerRandomEvent();

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

// Автоматично стартиране при зареждане
if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}
