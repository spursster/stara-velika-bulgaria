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
    // Проверка дали регионът съществува в базата данни
    if (!window.worldData.regions[regionName]) {
        console.error(`Грешка: Регионът "${regionName}" не съществува в world_data.js!`);
        return;
    }

    if (!window.playerRegions.includes(regionName)) {
        window.playerRegions.push(regionName);
        
        // Актуализираме броя земи за рода-собственик
        const regData = window.worldData.regions[regionName];
        regData.nativeClans.forEach(clanName => {
            if (window.worldData.clans[clanName]) {
                window.worldData.clans[clanName].regionsOwned += 1;
            }
        });

        if (window.recalculateClanHierarchy) window.recalculateClanHierarchy();
        if (window.updateCharacterUI) window.updateCharacterUI(window.currentHero);
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
