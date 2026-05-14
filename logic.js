/**
 * МОДУЛ: ГЛАВНА ЛОГИКА - Велика България
 */
window.initNewGame = function() {
    window.currentHero = {
        name: "Аспарух", 
        dynasty: "Дуло",
        gold: 1500,
        armySize: 300,
        heroPower: 100
    };

    window.gameTime = { year: 480, seasonIndex: 0, era: "пр.н.е." };
    
    // ВАЖНО: Използваме точното име от world_data.js
    window.playerRegions = ["Мизия"]; 
    
    window.currentSpouse = null;
    window.playerInventory = [];

    if (window.initDiplomacy) window.initDiplomacy();

    setTimeout(() => {
        if (window.worldData && window.worldData.clans[window.currentHero.dynasty]) {
            window.worldData.clans[window.currentHero.dynasty].regionsOwned = window.playerRegions.length;
        }

        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        if (window.showAdvisorMsg) {
            window.showAdvisorMsg(`Приветствам Ви, Велики Кане! Вашето управление започва. Родът ${window.currentHero.dynasty} очаква Вашите заповеди.`);
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
 * ФУНКЦИЯ ЗА ПРИСЪЕДИНЯВАНЕ НА РЕГИОН (Безопасна)
 */
window.conquerRegion = function(regionName) {
    // 1. Проверка дали името съществува в базата данни
    const regionData = window.worldData.regions[regionName];
    
    if (!regionData) {
        console.error(`ВНИМАНИЕ: Регион "${regionName}" не съществува! Използвайте "Северна Тракия", "Мизия" или "Панония".`);
        if (window.showAdvisorMsg) window.showAdvisorMsg(`Кан ${window.currentHero.name}, нашите карти не познават земя на име ${regionName}.`);
        return;
    }

    // 2. Добавяне само ако вече не е притежаван
    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        
        // Автоматично присъединяваме родния за региона род, ако има такъв
        regionData.nativeClans.forEach(clanName => {
            if (window.worldData.clans[clanName]) {
                window.worldData.clans[clanName].regionsOwned += 1;
            }
        });

        if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
        
        console.log(`Успешно присъединена земя: ${regionName}`);
    }
};

window.advanceTurn = function() {
    if (!window.currentHero) return;

    if (window.processTime) window.processTime();
    if (window.calculateEconomy) window.calculateEconomy();
    
    // Активираме проверка за събития при всеки ход
    window.triggerRandomEvent();

    if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
};

if (document.readyState === 'complete') {
    window.initNewGame();
} else {
    window.onload = () => window.initNewGame();
}
